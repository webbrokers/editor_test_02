export type Condition = {
  field: string
  operator: string
  value: string
}

export interface CampaignStartData {
  name: string
  description: string
  triggerType: string
}

export interface CampaignMetaData {
  campaignId: string
  budget: number
  startDate?: string
  endDate?: string
}

export interface CampaignTypeData {
  placementType: string
  placementOptions: { key: string; value: string }[]
}

export interface AudienceSegmentData {
  conditions: Condition[]
}

export interface FilterNodeData {
  conditions: Condition[]
}

export interface FunnelSplitData {
  attribute: string
  branches: {
    id: string
    label: string
    condition: string
  }[]
}

export interface AbTestData {
  title: string
  splitA: number
}

export interface ActionNodeData {
  actionType: string
  payload: string
}

export interface LlmTextNodeData {
  title: string
  prompt: string
  mode: string
  model: string
  temperature: number
  maxTokens: number
  variables: string[]
  autoReplaceInput: boolean
}

export type NodeData =
  | CampaignStartData
  | CampaignMetaData
  | CampaignTypeData
  | AudienceSegmentData
  | FilterNodeData
  | FunnelSplitData
  | AbTestData
  | ActionNodeData
  | LlmTextNodeData
