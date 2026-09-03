import React, { memo } from 'react';
import { BaseEdge, EdgeProps, getSmoothStepPath, EdgeLabelRenderer } from '@xyflow/react';

export interface ParticleEdgeData {
  amountUsd?: number;
  token?: string;
  isCrossChain?: boolean;
  bridgeName?: string;
  riskFlag?: string;
  txHash?: string;
  [key: string]: unknown;
}

const ParticleEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  selected
}) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 16
  });

  const edgeData = data as unknown as ParticleEdgeData;
  const isCrossChain = edgeData?.isCrossChain;
  const amountUsd = edgeData?.amountUsd || 0;
  const token = edgeData?.token || 'USDT';

  // Dynamic edge color
  const strokeColor = isCrossChain
    ? '#A855F7' // Purple for cross chain
    : amountUsd > 30000
    ? '#EF4444' // Red for large suspect movement
    : '#0EA5E9'; // Cyan/Blue default

  const pathId = `path-${id}`;

  return (
    <>
      {/* Underlying smooth path */}
      <path
        id={pathId}
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={selected ? 3 : 2}
        strokeOpacity={0.65}
        className="transition-all duration-200"
      />

      {/* Animated Moving Particle 1 */}
      <circle r="3.5" fill={strokeColor} filter={`drop-shadow(0 0 6px ${strokeColor})`}>
        <animateMotion dur="2.4s" repeatCount="indefinite" path={edgePath} />
      </circle>

      {/* Animated Moving Particle 2 (delayed) */}
      <circle r="2.5" fill="#FFFFFF" opacity="0.9">
        <animateMotion dur="2.4s" begin="1.2s" repeatCount="indefinite" path={edgePath} />
      </circle>

      {/* Interactive Midpoint Label */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="cursor-pointer"
        >
          <div
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold backdrop-blur-md border transition-all duration-200 ${
              selected
                ? 'bg-cyan-950 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.5)] scale-110'
                : 'bg-slate-900/90 text-slate-300 border-slate-700/80 hover:border-cyan-500/50'
            }`}
          >
            ${amountUsd ? amountUsd.toLocaleString() : '0'} {token}
            {isCrossChain && <span className="ml-1 text-purple-400">🔗</span>}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default memo(ParticleEdge);
