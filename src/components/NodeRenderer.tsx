import { memo } from 'react'
import type { ComponentType } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import type { NodeType } from '../types/flow'
import type { LlmTextNodeData, NodeData } from '../types/nodes'
import './NodeRenderer.css'

type PaletteEntry = {
  title: string
  color: string
  tag: string
  subtitle: (data: NodeData) => string
  description: (data: NodeData) => string
}

const palette: Record<NodeType, PaletteEntry> = {
  campaignStart: {
    title: 'Start',
    color: '#0ea5e9',
    tag: 'Trigger',
    subtitle: (data) => ('name' in data ? data.name : 'Entry point'),
    description: (data) =>
      'description' in data && data.description
        ? data.description
        : 'Kick off the automation when the condition is met.',
  },
  campaignMeta: {
    title: 'Campaign Meta',
    color: '#a855f7',
    tag: 'Overview',
    subtitle: (data) => ('campaignId' in data ? data.campaignId : 'Campaign ID'),
    description: (data) =>
      'budget' in data
        ? `Budget $${Number(data.budget ?? 0).toLocaleString()}`
        : 'Owner and key context for this journey.',
  },
  campaignType: {
    title: 'Campaign Type',
    color: '#6366f1',
    tag: 'Mode',
    subtitle: (data) => ('placementType' in data ? data.placementType : 'Type selection'),
    description: (data) =>
      'placementOptions' in data && Array.isArray(data.placementOptions)
        ? data.placementOptions
            .filter((opt) => opt.key && opt.value)
            .slice(0, 2)
            .map((opt) => `${opt.key}: ${opt.value}`)
            .join(' | ')
        : 'Choose the delivery channel and cadence.',
  },
  audienceSegment: {
    title: 'Audience Segment',
    color: '#10b981',
    tag: 'Segment',
    subtitle: (data) =>
      'conditions' in data && Array.isArray(data.conditions)
        ? `${data.conditions.length} condition${data.conditions.length === 1 ? '' : 's'}`
        : 'Segment target',
    description: (data) => {
      if ('conditions' in data && Array.isArray(data.conditions) && data.conditions.length > 0) {
        const first = data.conditions[0]
        return `${first.field} ${first.operator} ${first.value}`
      }
      return 'Dynamic cohort'
    },
  },
  filter: {
    title: 'Filter',
    color: '#f59e0b',
    tag: 'Rules',
    subtitle: (data) =>
      'conditions' in data && Array.isArray(data.conditions)
        ? `${data.conditions.length} condition${data.conditions.length === 1 ? '' : 's'}`
        : 'Filter audience',
    description: (data) =>
      'conditions' in data && Array.isArray(data.conditions) && data.conditions.length > 0
        ? `${data.conditions[0].field} ${data.conditions[0].operator} ${data.conditions[0].value}`
        : 'Combine rules to refine the path.',
  },
  funnelSplit: {
    title: 'Funnel Split',
    color: '#ec4899',
    tag: 'Routing',
    subtitle: (data) =>
      'branches' in data && Array.isArray(data.branches) ? `${data.branches.length} branches` : 'Split traffic',
    description: (data) =>
      'branches' in data && Array.isArray(data.branches)
        ? data.branches
            .slice(0, 3)
            .map((branch) => `${branch.label}: ${branch.condition || 'rule'}`)
            .join(' | ')
        : 'Distribute flow by percentage.',
  },
  abTest: {
    title: 'A/B Test',
    color: '#06b6d4',
    tag: 'Experiment',
    subtitle: (data) => ('title' in data ? data.title : 'Primary metric'),
    description: (data) =>
      'splitA' in data
        ? `Split: ${data.splitA}% / ${Math.max(0, 100 - Number(data.splitA ?? 0))}%`
        : 'Test variations and measure uplift.',
  },
  action: {
    title: 'Action',
    color: '#334155',
    tag: 'Step',
    subtitle: (data) => ('actionType' in data ? data.actionType : 'Execute an action'),
    description: (data) => ('payload' in data ? String(data.payload) : 'Send, update or enrich data at this step.'),
  },
  llmText: {
    title: 'LLM Text',
    color: '#22c55e',
    tag: 'AI',
    subtitle: (data) => ('title' in data ? data.title : 'LLM prompt'),
    description: (data) => ('prompt' in data ? data.prompt : 'Generate text with LLM.'),
  },
}

type NodeCardProps = NodeProps<NodeData>

const NodeCard = memo(function NodeCard({ data, type }: NodeCardProps) {
  const resolvedType = palette[type as NodeType] ? (type as NodeType) : 'campaignStart'
  const config = palette[resolvedType]
  const subtitle = config.subtitle(data)
  const description = config.description(data)

  return (
    <div className="node-card">
      <Handle type="target" position={Position.Top} className="node-card__handle" />
      <div className="node-card__header" style={{ backgroundColor: config.color, color: '#0b1120' }}>
        <span className="node-card__title">{config.title}</span>
        <span className="node-card__tag">{config.tag}</span>
      </div>
      <div className="node-card__body">
        <div className="node-card__subtitle">{subtitle}</div>
        <div className="node-card__description">{description}</div>
        <div className="node-card__meta">
          <span className="node-card__dot" />
          {resolvedType}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="node-card__handle node-card__handle--source" />
    </div>
  )
})

export const nodeTypes: Record<NodeType, ComponentType<NodeProps<NodeData>>> = {
  campaignStart: NodeCard,
  campaignMeta: NodeCard,
  campaignType: NodeCard,
  audienceSegment: NodeCard,
  filter: NodeCard,
  funnelSplit: NodeCard,
  abTest: NodeCard,
  action: NodeCard,
  llmText: memo(function LlmTextCard({ data }: NodeProps<NodeData>) {
    const llmData = data as Partial<LlmTextNodeData>
    const title = llmData.title?.trim() || 'LLM Text'
    const prompt = llmData.prompt?.trim() ?? ''
    const promptPreview = prompt ? prompt.split(/\r?\n/)[0].slice(0, 120) : 'No prompt added yet.'
    const mode = llmData.mode || 'generate'
    const model = llmData.model || 'custom'
    const variableCount = Array.isArray(llmData.variables) ? llmData.variables.length : 0

    return (
      <div className="llm-card">
        <Handle type="target" position={Position.Top} className="llm-card__handle" />
        <div className="llm-card__header">
          <div>
            <div className="llm-card__eyebrow">LLM Text</div>
            <div className="llm-card__title">{title}</div>
          </div>
          <div className="llm-card__badge">{mode}</div>
        </div>
        <div className="llm-card__body">
          <div className="llm-card__label">Prompt</div>
          <div className="llm-card__preview">{promptPreview}</div>
          <div className="llm-card__meta">
            <span className="llm-card__pill">Model: {model}</span>
            <span className="llm-card__pill">{variableCount} variables</span>
          </div>
        </div>
        <Handle type="source" position={Position.Bottom} className="llm-card__handle llm-card__handle--source" />
      </div>
    )
  }),
}

export default nodeTypes
