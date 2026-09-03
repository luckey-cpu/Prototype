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
  Download
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

const nodeWidth = 240;
const nodeHeight = 110;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 45,
    ranksep: 90,
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

export const ForensicWorkspace: React.FC = () => {
  // Ingest state
  const [addressInput, setAddressInput] = useState(DEMO_SUSPECT_ADDRESS);
  const [selectedChain, setSelectedChain] = useState<Blockchain>('Ethereum');
  const [isScanning, setIsScanning] = useState(false);

  // Filter state
  const [chainFilter, setChainFilter] = useState<ChainFilter>('ALL');
  const [direction, setDirection] = useState<'LR' | 'TB'>('LR');

  // Inspector & Modal states
  const [selectedNodeData, setSelectedNodeData] = useState<CustomNodeData | null>(null);
  const [selectedTxData, setSelectedTxData] = useState<TransactionData | null>(null);
  const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

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

  const handleStartAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressInput.trim()) return;
    setIsScanning(true);
  };

  const handleScanComplete = () => {
    setIsScanning(false);
  };

  const handleLoadSample = () => {
    setAddressInput(DEMO_SUSPECT_ADDRESS);
    setIsScanning(true);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4.25rem)] overflow-hidden bg-[#0A0E1A] text-slate-100 selection:bg-[#00F0FF] selection:text-black">
      {/* Radar Scanner Modal */}
      <RadarScannerModal
        isOpen={isScanning}
        walletAddress={addressInput}
        onComplete={handleScanComplete}
      />

      {/* Freeze Notice Modal (Section 91 & 102 CrPC) */}
      <FreezeNoticeModal
        isOpen={isFreezeModalOpen}
        onClose={() => setIsFreezeModalOpen(false)}
        targetVASP="BINANCE"
        depositCluster="0x28C6c06298d514Db089934071355E5743bf21d60"
        suspectAddress={addressInput}
      />

      {/* Standardized LEA Investigation Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        caseId="NCRP-2026-00182"
      />

      {/* ========================================================================= */}
      {/* TOP BAR: Search/Ingest, NCRP/SAHYOG Tag, Network Status Badge              */}
      {/* ========================================================================= */}
      <div className="shrink-0 border-b border-slate-800/80 bg-[#121829] px-4 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-md z-20">
        {/* Left: Search / Ingest Input */}
        <form onSubmit={handleStartAnalysis} className="flex items-center gap-2 w-full md:w-auto flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#00F0FF] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="Ingest victim-reported suspect wallet address (e.g. 0x7A2F...91F)..."
              className="w-full bg-[#0A0E1A] border border-slate-700/80 focus:border-[#00F0FF] rounded-xl pl-9 pr-3 py-1.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#00F0FF]"
            />
          </div>

          <select
            value={selectedChain}
            onChange={(e) => setSelectedChain(e.target.value as Blockchain)}
            aria-label="Target Chain"
            className="bg-[#0A0E1A] border border-slate-700 text-slate-200 text-xs font-mono rounded-xl px-2.5 py-1.5 focus:border-[#00F0FF] focus:outline-none cursor-pointer"
          >
            <option value="Ethereum">Ethereum</option>
            <option value="Polygon">Polygon</option>
            <option value="BNB Chain">BNB Chain</option>
            <option value="Bitcoin">Bitcoin (UTXO)</option>
            <option value="Solana">Solana (SPL)</option>
          </select>

          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-xl bg-[#00F0FF] hover:bg-[#00F0FF]/80 text-black font-mono font-bold text-xs shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>INGEST</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Center/Right: NCRP/SAHYOG Tag & Network Status */}
        <div className="flex flex-wrap items-center gap-2.5 justify-end w-full md:w-auto">
          {/* NCRP/SAHYOG Complaint Tag */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/60 border border-[#FF3366]/40 text-[#FF3366] text-xs font-mono font-bold shadow-[0_0_12px_rgba(255,51,102,0.2)]">
            <Shield className="w-3.5 h-3.5" />
            <span>{DEMO_NCRP_SAHYOG_ID}</span>
          </div>

          {/* Network Status Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0A0E1A] border border-slate-800 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E676] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E676]" />
            </span>
            <span className="text-slate-400 text-[11px]">STATUS:</span>
            <span className="text-[#00E676] font-semibold text-[11px]">ONLINE &bull; LIVE INGEST ACTIVE</span>
          </div>

          {/* Report Modal Trigger */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold bg-[#121829] hover:bg-slate-800 text-[#00F0FF] border border-[#00F0FF]/40 hover:border-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.2)] transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>LEA REPORT</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 60% / 40% SPLIT SCREEN WORKSPACE                                          */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-3 gap-3">
        {/* ======================================================================= */}
        {/* LEFT PANEL (60%): Interactive Multi-Chain Fund Flow Graph               */}
        {/* ======================================================================= */}
        <div className="lg:w-[60%] flex flex-col rounded-2xl bg-[#121829] border border-[#00F0FF]/20 overflow-hidden shadow-xl relative min-h-[480px]">
          {/* Graph Top Filter Bar */}
          <div className="p-2.5 border-b border-slate-800/80 bg-[#0A0E1A]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 z-10">
            {/* Chain Protocol Filters */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
              <span className="text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span className="hidden sm:inline">Filter:</span>
              </span>

              <button
                onClick={() => setChainFilter('ALL')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  chainFilter === 'ALL'
                    ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/50 font-bold'
                    : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                }`}
              >
                All Chains ({DEMO_WALLETS.length})
              </button>

              <button
                onClick={() => setChainFilter('EVM')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  chainFilter === 'EVM'
                    ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/50 font-bold'
                    : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                }`}
              >
                EVM (ETH &bull; POL &bull; BNB)
              </button>

              <button
                onClick={() => setChainFilter('BITCOIN')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  chainFilter === 'BITCOIN'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold'
                    : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                }`}
              >
                Bitcoin (UTXO)
              </button>

              <button
                onClick={() => setChainFilter('SOLANA')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  chainFilter === 'SOLANA'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 font-bold'
                    : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                }`}
              >
                Solana (SPL)
              </button>

              <button
                onClick={() => setChainFilter('BRIDGES')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  chainFilter === 'BRIDGES'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/50 font-bold'
                    : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                }`}
              >
                Bridges (Stargate/LayerZero)
              </button>
            </div>

            {/* Layout Toggle */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setDirection(direction === 'LR' ? 'TB' : 'LR')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-[#00F0FF] transition-colors cursor-pointer"
                title="Toggle Graph Direction"
              >
                <GitFork className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{direction === 'LR' ? 'Horizontal' : 'Vertical'}</span>
              </button>
            </div>
          </div>

          {/* Interactive React Flow Canvas */}
          <div className="flex-1 relative w-full h-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              onEdgeClick={onEdgeClick}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              connectionLineType={ConnectionLineType.SmoothStep}
              fitView
              minZoom={0.2}
              maxZoom={1.8}
              defaultEdgeOptions={{ animated: true }}
            >
              <Background color="#00F0FF" gap={24} size={1} style={{ opacity: 0.08 }} />
              <Controls className="!bg-[#121829] !border-slate-800 !fill-slate-300" />
              <MiniMap
                nodeColor={(n) => {
                  const d = n.data as unknown as CustomNodeData;
                  if (d.walletType === 'Suspect') return '#FF3366';
                  if (d.walletType === 'Exchange / VASP') return '#00E676';
                  if (d.walletType === 'Bridge / Protocol') return '#9D4EDD';
                  return '#00F0FF';
                }}
                className="!bg-[#0A0E1A]/90 !border !border-slate-800 rounded-lg hidden sm:block"
                maskColor="rgba(10, 14, 26, 0.7)"
              />
            </ReactFlow>

            {/* Bottom Legend */}
            <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center gap-3 bg-[#0A0E1A]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00F0FF]" />
                Victim
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF3366] animate-pulse" />
                Suspect Aggregator
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FFB703]" />
                Mule Relay
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#9D4EDD]" />
                Bridge
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00E676]" />
                Verified VASP
              </span>
            </div>

            {/* Node Inspector Drawer */}
            {selectedNodeData && (
              <NodeDetailDrawer
                nodeData={selectedNodeData}
                onClose={() => setSelectedNodeData(null)}
                onAnalyzeWallet={(addr) => {
                  setAddressInput(addr);
                  setIsScanning(true);
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

        {/* ======================================================================= */}
        {/* RIGHT PANEL (40%): Real-Time Intelligence & Action Module               */}
        {/* ======================================================================= */}
        <div className="lg:w-[40%] flex flex-col gap-3 overflow-y-auto pr-1">
          {/* 1. Identified Destination VASP Card with "Generate Freeze Notice" */}
          <DestinationVASPCard
            onGenerateFreezeNotice={() => setIsFreezeModalOpen(true)}
          />

          {/* 2. Chronological Transit Timeline */}
          <TransitTimeline
            onSelectTx={(tx) => {
              setSelectedNodeData(null);
              setSelectedTxData(tx);
            }}
          />

          {/* 3. AI Investigative Summary Card */}
          <AISummaryCard />
        </div>
      </div>
    </div>
  );
};
