import type { CampaignFlow, NodeConfig } from '../types/flow'
import type { FunnelSplitData } from '../types/nodes'

export type ValidationError = { message: string; nodeId?: string }
export type ValidationResult = { valid: boolean; errors: ValidationError[] }

function getOutgoingEdges(edges: CampaignFlow['edges'], nodeId: string) {
  return edges.filter((edge) => edge.source === nodeId)
}

function getIncomingEdges(edges: CampaignFlow['edges'], nodeId: string) {
  return edges.filter((edge) => edge.target === nodeId)
}

export function validateCampaign(flow: CampaignFlow): ValidationResult {
  const errors: ValidationError[] = []
  const { nodes, edges } = flow

  const startNodes = nodes.filter((node) => node.type === 'campaignStart')
  if (startNodes.length === 0) {
    errors.push({ message: 'Campaign must have exactly one start node.' })
  } else if (startNodes.length > 1) {
    startNodes.forEach((node) =>
      errors.push({ message: 'Only one campaignStart node is allowed.', nodeId: node.id }),
    )
  }

  nodes.forEach((node: NodeConfig) => {
    const incoming = getIncomingEdges(edges, node.id)
    const outgoing = getOutgoingEdges(edges, node.id)

    if (
      ['campaignMeta', 'campaignType', 'filter', 'funnelSplit', 'abTest', 'action'].includes(node.type)
    ) {
      if (incoming.length === 0) {
        errors.push({ message: `${node.type} node must have an incoming edge.`, nodeId: node.id })
      }
    }

    if (node.type === 'action') {
      if (outgoing.length > 0) {
        errors.push({ message: 'Action node cannot have outgoing edges.', nodeId: node.id })
      }
    }

    if (node.type === 'abTest') {
      if (outgoing.length !== 2) {
        errors.push({ message: 'A/B Test node must have exactly two outgoing edges.', nodeId: node.id })
      }
    }

    if (node.type === 'funnelSplit') {
      const data = node.data as FunnelSplitData
      const branchCount = Array.isArray(data?.branches) ? data.branches.length : 0
      if (branchCount < 2) {
        errors.push({ message: 'Funnel Split must define at least two branches.', nodeId: node.id })
      }
      if (outgoing.length < 2) {
        errors.push({ message: 'Funnel Split must have at least two outgoing edges.', nodeId: node.id })
      }
      if (branchCount > 0 && outgoing.length < branchCount) {
        errors.push({
          message: 'Funnel Split must have outgoing edges for every branch.',
          nodeId: node.id,
        })
      }
    }
  })

  edges.forEach((edge) => {
    if (edge.source === edge.target) {
      errors.push({ message: 'Self-loops are not allowed.', nodeId: edge.source })
    }
  })

  return { valid: errors.length === 0, errors }
}
