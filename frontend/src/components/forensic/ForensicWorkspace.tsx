import React, { useState, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType,
  ConnectionLineType,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import {
  Search,
  ArrowRight,
  Shield,
  Activity,
  Sparkles,
  GitFork,
  FileText,
  Filter,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  SlidersHorizontal,
  Download,
  Archive
} from 'lucide-react';
import CustomNode, { CustomNodeData } from '../graph/CustomNode';
import ParticleEdge from '../graph/ParticleEdge';
import { NodeDetailDrawer } from '../graph/NodeDetailDrawer';
import { EdgeDetailDrawer } from '../graph/EdgeDetailDrawer';
import { RadarScannerModal } from '../common/RadarScannerModal';
import { DestinationVASPCard } from './DestinationVASPCard';
import { TransitTimeline } from './TransitTimeline';
import { AISummaryCard } from './AISummaryCard';
import { FreezeNoticeModal } from './FreezeNoticeModal';
import { ReportModal } from './ReportModal';
import {
  DEMO_SUSPECT_ADDRESS,
  DEMO_NCRP_SAHYOG_ID,
  DEMO_WALLETS,
  DEMO_TRANSACTIONS
} from '../../data/demoData';
import { Blockchain, ChainFilter, TransactionData } from '../../types';

const nodeTypes = {
  customNode: CustomNode
};

const edgeTypes = {
  particleEdge: ParticleEdge
};

// Dagre graph auto-layout engine
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 260;
const nodeHeight = 130;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 80,
    ranksep: 160,
    marginx: 30,
    marginy: 30
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2
      }
    };
  });

  return { nodes: layoutedNodes, edges };
};

export interface ForensicWorkspaceProps {
  initialAddress?: string;
}

export const ForensicWorkspace: React.FC<ForensicWorkspaceProps> = ({ initialAddress = DEMO_SUSPECT_ADDRESS }) => {
  // Filter state
  const [chainFilter, setChainFilter] = useState<ChainFilter>('ALL');
  const [direction, setDirection] = useState<'LR' | 'TB'>('LR');

  // Inspector & Modal states
  const [selectedNodeData, setSelectedNodeData] = useState<CustomNodeData | null>(null);
  const [selectedTxData, setSelectedTxData] = useState<TransactionData | null>(null);
  const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<'vasp' | 'timeline' | 'ai'>('vasp');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [rightPanelWidth, setRightPanelWidth] = useState(40); // percentage

  // Filter wallets according to chain protocol
  const filteredWallets = useMemo(() => {
    switch (chainFilter) {
      case 'EVM':
        return DEMO_WALLETS.filter((w) => ['Ethereum', 'Polygon', 'BNB Chain'].includes(w.blockchain));
      case 'BITCOIN':
        return DEMO_WALLETS.filter((w) => w.blockchain === 'Bitcoin' || w.wallet_type === 'Suspect');
      case 'SOLANA':
        return DEMO_WALLETS.filter((w) => w.blockchain === 'Solana' || w.wallet_type === 'Suspect');
      case 'BRIDGES':
        return DEMO_WALLETS.filter(
          (w) => w.wallet_type === 'Bridge / Protocol' || w.wallet_type === 'Suspect' || w.wallet_type === 'Exchange / VASP'
        );
      default:
        return DEMO_WALLETS;
    }
  }, [chainFilter]);

  // Build Graph elements
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const rawNodes: Node[] = filteredWallets.map((w) => ({
      id: w.address,
      type: 'customNode',
      position: { x: 0, y: 0 },
      data: {
        address: w.address,
        label: w.tags && w.tags.length > 0 ? w.tags[0] : w.wallet_type,
        walletType: w.wallet_type,
        riskLevel: w.risk_level,
        riskScore: w.risk_score,
        balanceUsd: w.current_balance_usd,
        inflowUsd: w.incoming_usd,
        outflowUsd: w.outgoing_usd,
        txCount: w.total_transactions,
        tags: w.tags
      }
    }));

    const validAddressSet = new Set(filteredWallets.map((w) => w.address.toLowerCase()));

    const rawEdges: Edge[] = DEMO_TRANSACTIONS.filter(
      (tx) =>
        validAddressSet.has(tx.from_address.toLowerCase()) &&
        validAddressSet.has(tx.to_address.toLowerCase())
    ).map((tx, idx) => {
      let strokeColor = '#00F0FF';
      if (tx.risk_flag === 'VASP_DEPOSIT_SWEEP' || tx.risk_flag === 'LAYERING_SPLIT') {
        strokeColor = '#FF3366';
      } else if (tx.is_cross_chain) {
        strokeColor = '#9D4EDD';
      } else if (tx.risk_flag === 'RAPID_FORWARDING') {
        strokeColor = '#FFB703';
      }

      return {
        id: `e-${idx}-${tx.tx_hash.slice(0, 8)}`,
        source: tx.from_address,
        target: tx.to_address,
        type: 'particleEdge',
        animated: true,
        data: {
          txHash: tx.tx_hash,
          amountUsd: tx.amount_usd,
          token: tx.token,
          timestamp: tx.timestamp,
          riskFlag: tx.risk_flag,
          isCrossChain: tx.is_cross_chain,
          bridgeName: tx.bridge_name,
          blockchain: tx.blockchain
        },
        style: {
          stroke: strokeColor,
          strokeWidth: 2,
          opacity: 0.85
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: strokeColor,
          width: 14,
          height: 14
        }
      };
    });

    return getLayoutedElements(rawNodes, rawEdges, direction);
  }, [filteredWallets, direction]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync layout when filter or direction changes
  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Interactive Node click handler
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedTxData(null);
    setSelectedNodeData(node.data as unknown as CustomNodeData);
  }, []);

  // Interactive Edge click handler
  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    setSelectedNodeData(null);
    const matched = DEMO_TRANSACTIONS.find(
      (tx) => tx.from_address === edge.source && tx.to_address === edge.target
    );
    if (matched) {
      setSelectedTxData(matched);
    }
  }, []);

  const onNodeMouseEnter = useCallback((_: React.MouseEvent, node: Node) => {
    setHoveredNode(node.id);
  }, []);

  const onNodeMouseLeave = useCallback(() => {
    setHoveredNode(null);
  }, []);

  const handleDrag = useCallback((e: MouseEvent) => {
    const newWidth = ((window.innerWidth - e.clientX) / window.innerWidth) * 100;
    if (newWidth >= 25 && newWidth <= 55) {
      setRightPanelWidth(newWidth);
    }
  }, []);

  const handleDragEnd = useCallback(() => {
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', handleDragEnd);
  }, [handleDrag]);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
  }, [handleDrag, handleDragEnd]);

  return (
    <div className="flex flex-col h-[calc(100vh-4.25rem)] overflow-hidden bg-slate-50 text-slate-800 selection:bg-blue-100 selection:text-blue-900">
      {/* Freeze Notice Modal (Section 91 & 102 CrPC) */}
      <FreezeNoticeModal
        isOpen={isFreezeModalOpen}
        onClose={() => setIsFreezeModalOpen(false)}
        targetVASP="BINANCE"
        depositCluster="0x28C6c06298d514Db089934071355E5743bf21d60"
        suspectAddress={initialAddress}
      />

      {/* Standardized LEA Investigation Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        caseId="NCRP-2026-00182"
      />

      {/* ========================================================================= */}
      {/* WORKSPACE ACTION BAR: NCRP Tag & Actions                                  */}
      {/* ========================================================================= */}
      <div className="shrink-0 border-b border-slate-200 bg-white px-4 py-2 flex items-center justify-between shadow-sm z-20">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-slate-500">ACTIVE WORKSPACE:</span>
          {/* NCRP/SAHYOG Complaint Tag */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-mono font-bold shadow-sm">
            <Shield className="w-3.5 h-3.5" />
            <span>{DEMO_NCRP_SAHYOG_ID}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Export Case Archive Trigger */}
          <button
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-400 shadow-sm transition-all cursor-pointer"
          >
            <Archive className="w-3.5 h-3.5" />
            <span>EXPORT CASE ARCHIVE</span>
          </button>
          
          {/* Report Modal Trigger */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold bg-white hover:bg-slate-50 text-blue-600 border border-blue-200 hover:border-blue-400 shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>GENERATE LEA REPORT</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2-Column Split: Graph (Left) & Inspector (Right)                          */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col lg:flex-row p-4 overflow-hidden relative">
        {/* ======================================================================= */}
        {/* LEFT PANEL: Interactive Graph Visualization Canvas                      */}
        {/* ======================================================================= */}
        <div 
          className="flex-1 flex flex-col rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden shadow-sm relative min-h-[480px]"
          style={{ width: `calc(${100 - rightPanelWidth}% - 0.5rem)` }}
        >
          {/* Graph Top Filter Bar */}
          <div className="p-2.5 border-b border-slate-200 bg-white/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 z-10">
            {/* Chain Protocol Filters */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
              <span className="text-slate-500 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Filter:</span>
              </span>

              <button
                onClick={() => setChainFilter('ALL')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  chainFilter === 'ALL'
                    ? 'bg-blue-100 text-blue-700 border border-blue-300 font-bold'
                    : 'text-slate-500 hover:text-slate-800 bg-white border border-slate-200 shadow-sm'
                }`}
              >
                All Chains ({DEMO_WALLETS.length})
              </button>

              <button
                onClick={() => setChainFilter('EVM')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  chainFilter === 'EVM'
                    ? 'bg-blue-100 text-blue-700 border border-blue-300 font-bold'
                    : 'text-slate-500 hover:text-slate-800 bg-white border border-slate-200 shadow-sm'
                }`}
              >
                EVM (ETH &bull; POL &bull; BNB)
              </button>

              <button
                onClick={() => setChainFilter('BITCOIN')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  chainFilter === 'BITCOIN'
                    ? 'bg-amber-50 text-amber-700 border border-amber-300 font-bold'
                    : 'text-slate-500 hover:text-slate-800 bg-white border border-slate-200 shadow-sm'
                }`}
              >
                Bitcoin (UTXO)
              </button>

              <button
                onClick={() => setChainFilter('SOLANA')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  chainFilter === 'SOLANA'
                    ? 'bg-purple-50 text-purple-700 border border-purple-300 font-bold'
                    : 'text-slate-500 hover:text-slate-800 bg-white border border-slate-200 shadow-sm'
                }`}
              >
                Solana (SPL)
              </button>

              <button
                onClick={() => setChainFilter('BRIDGES')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  chainFilter === 'BRIDGES'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-300 font-bold'
                    : 'text-slate-500 hover:text-slate-800 bg-white border border-slate-200 shadow-sm'
                }`}
              >
                Bridges (Stargate/LayerZero)
              </button>
            </div>

            </div>

          {/* Interactive React Flow Canvas */}
          <div className="flex-1 relative w-full h-full">
            <ReactFlow
              nodes={nodes.map((n) => ({
                ...n,
                className: hoveredNode && n.id !== hoveredNode && !edges.some(e => (e.source === hoveredNode && e.target === n.id) || (e.target === hoveredNode && e.source === n.id)) ? 'opacity-30 transition-opacity' : 'transition-opacity'
              }))}
              edges={edges.map((e) => ({
                ...e,
                className: hoveredNode && e.source !== hoveredNode && e.target !== hoveredNode ? 'opacity-10 transition-opacity' : 'transition-opacity'
              }))}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              onNodeMouseEnter={onNodeMouseEnter}
              onNodeMouseLeave={onNodeMouseLeave}
              onEdgeClick={onEdgeClick}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              connectionLineType={ConnectionLineType.SmoothStep}
              fitView
              minZoom={0.2}
              maxZoom={1.8}
              defaultEdgeOptions={{ animated: true }}
            >
              <Background color="#cbd5e1" gap={24} size={1} />
            {/* Floating Control Dock */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 bg-white/90 backdrop-blur-md px-3 py-2 rounded-2xl shadow-lg border border-slate-200">
              
              {/* Bottom Legend */}
              <div className="hidden lg:flex items-center gap-3 px-2 text-[10px] font-mono text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  Victim
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  Suspect
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Mule Relay
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  Bridge
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  Verified VASP
                </span>
              </div>
              
              <div className="w-px h-8 bg-slate-200 hidden lg:block mx-1"></div>

              {/* Layout Toggle */}
              <button
                onClick={() => setDirection(direction === 'LR' ? 'TB' : 'LR')}
                className="flex items-center justify-center gap-1 w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-blue-600 transition-colors shadow-sm cursor-pointer"
                title="Toggle Graph Direction"
              >
                <GitFork className="w-4 h-4" />
              </button>

              <Controls className="!relative !bottom-0 !left-0 !m-0 !bg-slate-50 !border-slate-200 !fill-slate-600 !shadow-sm !rounded-lg" showInteractive={false} />
              
              <MiniMap
                nodeColor={(n) => {
                  const d = n.data as unknown as CustomNodeData;
                  if (d.walletType === 'Suspect') return '#DC2626'; // red-600
                  if (d.walletType === 'Exchange / VASP') return '#16A34A'; // emerald-600
                  if (d.walletType === 'Bridge / Protocol') return '#4F46E5'; // indigo-600
                  if (d.walletType === 'Intermediary / Burner') return '#D97706'; // amber-600
                  return '#2563EB'; // blue-600
                }}
                className="!relative !bottom-0 !right-0 !m-0 !bg-slate-50 !border !border-slate-200 rounded-lg hidden sm:block !shadow-sm"
                maskColor="rgba(248, 250, 252, 0.7)"
              />
            </div>
            </ReactFlow>

            {/* Node Inspector Drawer */}
            {selectedNodeData && (
              <NodeDetailDrawer
                nodeData={selectedNodeData}
                onClose={() => setSelectedNodeData(null)}
                onAnalyzeWallet={(addr) => {
                  // This is now read-only or triggers a global event if we pass onAnalyzeWallet up to App.tsx.
                  // For now, it just views node detail.
                }}
              />
            )}

            {/* Edge Detail Drawer */}
            {selectedTxData && (
              <EdgeDetailDrawer
                transaction={selectedTxData}
                onClose={() => setSelectedTxData(null)}
              />
            )}
          </div>
        </div>

        {/* Drag Handle Splitter */}
        <div 
          className="w-4 hidden lg:flex items-center justify-center cursor-col-resize group z-10 mx-1"
          onMouseDown={handleDragStart}
        >
          <div className="w-1 h-12 rounded-full bg-slate-300 group-hover:bg-blue-500 transition-colors" />
        </div>

        {/* ======================================================================= */}
        {/* RIGHT PANEL: Real-Time Intelligence & Action Module                     */}
        {/* ======================================================================= */}
        <div 
          className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm shrink-0"
          style={{ width: `calc(${rightPanelWidth}% - 0.5rem)` }}
        >
          
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 bg-slate-50 shrink-0">
            <button 
              onClick={() => setActivePanel('vasp')} 
              className={`flex-1 py-3 text-[11px] font-bold font-mono transition-all ${activePanel === 'vasp' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
            >
              VASP INTELLIGENCE
            </button>
            <button 
              onClick={() => setActivePanel('timeline')} 
              className={`flex-1 py-3 text-[11px] font-bold font-mono transition-all ${activePanel === 'timeline' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
            >
              LEDGER AUDIT
            </button>
            <button 
              onClick={() => setActivePanel('ai')} 
              className={`flex-1 py-3 text-[11px] font-bold font-mono transition-all ${activePanel === 'ai' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
            >
              AI DIRECTIVES
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar relative">
            {activePanel === 'vasp' && (
              <div className="animate-in fade-in duration-200 h-full">
                <DestinationVASPCard onGenerateNotice={() => setIsFreezeModalOpen(true)} />
              </div>
            )}
            
            {activePanel === 'timeline' && (
              <div className="animate-in fade-in duration-200 h-full flex flex-col">
                <TransitTimeline
                  onSelectTx={(tx) => {
                    setSelectedNodeData(null);
                    setSelectedTxData(tx);
                  }}
                />
              </div>
            )}

            {activePanel === 'ai' && (
              <div className="animate-in fade-in duration-200 h-full">
                <AISummaryCard />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
