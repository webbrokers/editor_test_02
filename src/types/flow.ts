import type { NodeData } from './nodes'

export type NodeType =
  | 'campaignStart'
  | 'campaignMeta'
  | 'campaignType'
  | 'audienceSegment'
  | 'filter'
  | 'funnelSplit'
  | 'abTest'
  | 'action'
  | 'llmText'

export interface NodeConfig<TData = any> {
  id: string
  type: NodeType
  position: {
    x: number
    y: number
  }
  data: TData
}

export type NodeWithData = NodeConfig<NodeData>

export interface EdgeConfig {
  id: string
  source: string
  sourceHandle?: string
  target: string
  targetHandle?: string
}

export interface CampaignFlow {
  id: string
  name: string
  nodes: NodeConfig[]
  edges: EdgeConfig[]
}
