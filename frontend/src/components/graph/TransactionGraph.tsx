import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import CustomNode, { CustomNodeData } from './CustomNode';
import ParticleEdge, { ParticleEdgeData } from './ParticleEdge';
import { NodeDetailDrawer } from './NodeDetailDrawer';
import { EdgeDetailDrawer } from './EdgeDetailDrawer';
import { TransactionData, WalletData } from '../../types';
import { DEMO_WALLETS, DEMO_TRANSACTIONS } from '../../data/demoData';
import { Filter, Maximize2, RotateCcw, GitFork } from 'lucide-react';

interface TransactionGraphProps {
  onSelectWallet?: (address: string) => void;
  wallets?: WalletData[];
  transactions?: TransactionData[];
}

const nodeTypes = {
  customNode: CustomNode,
};

const edgeTypes = {
  particleEdge: ParticleEdge,
};

const nodeWidth = 220;
const nodeHeight = 85;

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = 'LR'
) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction, ranksep: 100, nodesep: 60 });

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
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export const TransactionGraph: React.FC<TransactionGraphProps> = ({
  onSelectWallet,
  wallets = DEMO_WALLETS,
  transactions = DEMO_TRANSACTIONS,
}) => {
  const [selectedNodeData, setSelectedNodeData] = useState<CustomNodeData | null>(null);
  const [selectedTxData, setSelectedTxData] = useState<TransactionData | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [direction, setDirection] = useState<'LR' | 'TB'>('LR');

  // Convert wallets and transactions to React Flow nodes and edges
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const rawNodes: Node[] = wallets.map((w) => ({
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
        tags: w.tags,
      },
    }));

    const rawEdges: Edge[] = transactions.map((tx, idx) => ({
      id: `edge-${idx}-${tx.tx_hash.slice(0, 8)}`,
      source: tx.from_address,
      target: tx.to_address,
      type: 'particleEdge',
      data: {
        amountUsd: tx.amount_usd,
        token: tx.token,
        isCrossChain: tx.is_cross_chain,
        bridgeName: tx.bridge_name,
        riskFlag: tx.risk_flag,
        txHash: tx.tx_hash,
      },
    }));

    return getLayoutedElements(rawNodes, rawEdges, direction);
  }, [wallets, transactions, direction]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Re-layout on direction change
  const onLayout = useCallback(
    (newDirection: 'LR' | 'TB') => {
      setDirection(newDirection);
      const layouted = getLayoutedElements(nodes, edges, newDirection);
      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);
    },
    [nodes, edges, setNodes, setEdges]
  );

  // Node click handler
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedTxData(null);
    setSelectedNodeData(node.data as unknown as CustomNodeData);
  }, []);

  // Edge click handler
  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      setSelectedNodeData(null);
      const edgeData = edge.data as unknown as ParticleEdgeData;
      const matchedTx = transactions.find((t) => t.tx_hash === edgeData.txHash);
      if (matchedTx) {
        setSelectedTxData(matchedTx);
      } else {
        setSelectedTxData({
          tx_hash: (edgeData.txHash as string) || '0x4a18f8e792c0192...',
          from_address: edge.source,
          to_address: edge.target,
          amount_usd: (edgeData.amountUsd as number) || 24580,
          amount_crypto: (edgeData.amountUsd as number) || 24580,
          token: (edgeData.token as string) || 'USDT',
          timestamp: '2026-08-18 12:12:15',
          blockchain: 'Ethereum',
          block_number: 20561825,
          status: 'CONFIRMED',
          direction: 'OUTGOING',
          risk_flag: (edgeData.riskFlag as string) || 'RAPID_FORWARDING',
          is_cross_chain: (edgeData.isCrossChain as boolean) || false,
        });
      }
    },
    [transactions]
  );

  // Filtering
  const filteredNodes = useMemo(() => {
    if (filterType === 'ALL') return nodes;
    return nodes.map((n) => {
      const nodeData = n.data as unknown as CustomNodeData;
      const isVisible =
        filterType === 'HIGH_RISK'
          ? nodeData.riskLevel === 'CRITICAL' || nodeData.riskLevel === 'HIGH'
          : filterType === 'VICTIM'
          ? nodeData.walletType === 'Victim'
          : filterType === 'MULE'
          ? nodeData.walletType === 'Intermediary / Burner'
          : filterType === 'VASP'
          ? nodeData.walletType === 'Exchange / VASP'
          : true;

      return {
        ...n,
        hidden: !isVisible,
      };
    });
  }, [nodes, filterType]);

  return (
    <div className="relative w-full h-[520px] sm:h-[650px] lg:h-[720px] rounded-2xl glass-panel border border-cyan-500/20 overflow-hidden select-none">
      {/* Top Floating Control Bar */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex flex-wrap items-center gap-2 bg-[#070c18]/90 backdrop-blur-md p-2 rounded-xl border border-slate-800 max-w-[calc(100%-1.5rem)]">
        <div className="flex items-center gap-1 text-xs font-mono text-slate-400 pl-1 sm:pl-2">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden xs:inline">Filter:</span>
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          aria-label="Filter graph nodes"
          className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono rounded-lg px-2 py-1.5 focus:border-cyan-500 focus:outline-none cursor-pointer"
        >
          <option value="ALL">All Nodes ({wallets.length})</option>
          <option value="HIGH_RISK">High / Critical</option>
          <option value="VICTIM">Victim</option>
          <option value="MULE">Mules</option>
          <option value="VASP">VASPs</option>
        </select>

        <div className="hidden sm:block h-4 w-[1px] bg-slate-700 mx-0.5" />

        <button
          onClick={() => onLayout(direction === 'LR' ? 'TB' : 'LR')}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300 transition-colors cursor-pointer"
          title="Toggle Layout Flow Direction"
        >
          <GitFork className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{direction === 'LR' ? 'Horizontal (L &rarr; R)' : 'Vertical (Top &rarr; B)'}</span>
          <span className="sm:hidden">{direction === 'LR' ? 'L&rarr;R' : 'T&rarr;B'}</span>
        </button>
      </div>

      {/* Legend Box */}
      <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center gap-3 bg-[#070c18]/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
          Victim
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          Suspect
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          Intermediary
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
          Bridge / DEX
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          Exchange / VASP
        </span>
      </div>

      {/* React Flow Viewport */}
      <ReactFlow
        nodes={filteredNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        minZoom={0.2}
        maxZoom={2.0}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1.2} color="#1e293b" />
        <Controls className="!bg-slate-900 !border-slate-800 !rounded-xl !shadow-lg [&>button]:!bg-slate-900 [&>button]:!border-slate-800 [&>button]:!text-cyan-400 hover:[&>button]:!bg-slate-800" />
        <MiniMap
          nodeStrokeWidth={3}
          zoomable
          pannable
          className="!bg-slate-950/90 !border-slate-800 !rounded-xl overflow-hidden"
          nodeColor={(node) => {
            const data = node.data as unknown as CustomNodeData;
            if (data.walletType === 'Suspect') return '#EF4444';
            if (data.walletType === 'Victim') return '#38BDF8';
            if (data.walletType === 'Exchange / VASP') return '#10B981';
            if (data.walletType === 'Bridge / Protocol') return '#A855F7';
            return '#F59E0B';
          }}
        />
      </ReactFlow>

      {/* Node Detail Drawer */}
      <NodeDetailDrawer
        nodeData={selectedNodeData}
        onClose={() => setSelectedNodeData(null)}
        onAnalyzeWallet={(addr) => {
          if (onSelectWallet) onSelectWallet(addr);
          setSelectedNodeData(null);
        }}
      />

      {/* Edge Detail Drawer */}
      <EdgeDetailDrawer
        transaction={selectedTxData}
        onClose={() => setSelectedTxData(null)}
      />
    </div>
  );
};
