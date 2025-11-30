import { memo } from 'react'
import type { ComponentType } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import type { NodeType } from '../types/flow'
import type { NodeData } from '../types/nodes'
import { nodeIcons, nodeTypeLabels } from '../utils/nodeFactory'
import './NodeRenderer.css'

type NodeChipProps = NodeProps<NodeData>

const nodePalette: Record<NodeType, { accent: string }> = {
  campaignStart: { accent: '#6bcf7c' },
  campaignMeta: { accent: '#7f8ea3' },
  campaignType: { accent: '#6dbcfb' },
  audienceSegment: { accent: '#79d1a7' },
  filter: { accent: '#f6c064' },
  funnelSplit: { accent: '#f59dc2' },
  abTest: { accent: '#7ac8e8' },
  action: { accent: '#9aa4b5' },
  llmText: { accent: '#8bd4b0' },
}

function getLabel(type: NodeType, data: NodeData) {
  if ('name' in data && data.name) return data.name
  if ('title' in data && data.title) return data.title
  if ('campaignId' in data && data.campaignId) return data.campaignId
  if ('actionType' in data && data.actionType) return data.actionType
  return nodeTypeLabels[type] || type
}

const NodeChip = memo(function NodeChip({ data, type, selected }: NodeChipProps) {
  const resolvedType = nodePalette[type as NodeType] ? (type as NodeType) : 'campaignStart'
  const accent = nodePalette[resolvedType].accent
  const label = getLabel(resolvedType, data)

  return (
    <div className={`node-chip ${selected ? 'node-chip--selected' : ''}`}>
      <Handle type="target" position={Position.Left} className="node-chip__handle" />
      <Handle type="target" position={Position.Top} className="node-chip__handle" />
      <div className="node-chip__body" style={{ borderColor: accent }}>
        <div className="node-chip__icon" style={{ backgroundColor: `${accent}22`, color: '#111827' }}>
          {nodeIcons[resolvedType]}
        </div>
      </div>
      <div className="node-chip__label">
        <span className="node-chip__title">{label}</span>
        <span className="node-chip__subtitle">{nodeTypeLabels[resolvedType]}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="node-chip__handle node-chip__handle--source" />
      <Handle type="source" position={Position.Right} className="node-chip__handle node-chip__handle--source" />
    </div>
  )
})

export const nodeTypes: Record<NodeType, ComponentType<NodeProps<NodeData>>> = {
  campaignStart: NodeChip,
  campaignMeta: NodeChip,
  campaignType: NodeChip,
  audienceSegment: NodeChip,
  filter: NodeChip,
  funnelSplit: NodeChip,
  abTest: NodeChip,
  action: NodeChip,
  llmText: NodeChip,
}

export default nodeTypes
