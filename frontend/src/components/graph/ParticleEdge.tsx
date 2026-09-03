import React, { memo } from 'react';
import { BaseEdge, EdgeProps, getBezierPath, EdgeLabelRenderer } from '@xyflow/react';

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
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
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
            className={`px-2 py-0.5 rounded border text-xs font-mono font-semibold transition-all duration-200 bg-white ${
              selected
                ? 'text-blue-700 border-blue-400 shadow-md scale-110'
                : 'text-slate-800 border-slate-200 shadow-sm hover:border-blue-300'
            }`}
          >
            ${amountUsd ? amountUsd.toLocaleString() : '0'} {token}
            {isCrossChain && <span className="ml-1 text-purple-600">🔗</span>}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default memo(ParticleEdge);
