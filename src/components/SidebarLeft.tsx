import { useCallback } from 'react'
import { useReactFlow } from 'reactflow'
import Sidebar from './Sidebar'
import type { NodeType } from '../types/flow'
import type { NodeData } from '../types/nodes'
import './SidebarLeft.css'

const nodeTypes: NodeType[] = [
  'campaignStart',
  'campaignMeta',
  'campaignType',
  'audienceSegment',
  'filter',
  'funnelSplit',
  'abTest',
  'action',
  'llmText',
]

const nodeLabels: Record<NodeType, string> = {
  campaignStart: 'Start',
  campaignMeta: 'Meta',
  campaignType: 'Type',
  audienceSegment: 'Audience',
  filter: 'Filter',
  funnelSplit: 'Funnel Split',
  abTest: 'A/B Test',
  action: 'Action',
  llmText: 'LLM Text',
}

function createDefaultData(type: NodeType): NodeData {
  switch (type) {
    case 'campaignStart':
      return { name: 'Campaign start', description: 'Entry trigger', triggerType: 'immediate' }
    case 'campaignMeta':
      return {
        campaignId: 'cmp-001',
        budget: 10000,
        startDate: new Date().toISOString().slice(0, 10),
        endDate: '',
      }
    case 'campaignType':
      return {
        placementType: 'email',
        placementOptions: [
          { key: 'cadence', value: 'weekly' },
          { key: 'time', value: '09:00' },
        ],
      }
    case 'audienceSegment':
      return { conditions: [{ field: 'country', operator: 'equals', value: 'US' }] }
    case 'filter':
      return { conditions: [{ field: 'status', operator: 'equals', value: 'active' }] }
    case 'funnelSplit':
      return {
        attribute: 'device',
        branches: [
          { id: 'branch-a', label: 'Mobile', condition: 'device = mobile' },
          { id: 'branch-b', label: 'Desktop', condition: 'device = desktop' },
        ],
      }
    case 'abTest':
      return {
        title: 'Subject line test',
        splitA: 50,
      }
    case 'action':
      return { actionType: 'sendEmail', payload: '{"templateId":"tmpl-001"}' }
    case 'llmText':
      return {
        title: 'Welcome email copy',
        prompt: 'Write an onboarding email.',
        mode: 'generate',
        model: 'gpt-4.1',
        temperature: 0.7,
        maxTokens: 512,
        variables: ['product_name', 'cta_url'],
        autoReplaceInput: true,
      }
    default:
      return { name: 'Node', description: '', triggerType: 'immediate' }
  }
}

function SidebarLeft() {
  const { addNodes, getNodes } = useReactFlow<NodeData>()

  const getNextPosition = useCallback(() => {
    const current = getNodes().length
    const column = current % 3
    const row = Math.floor(current / 3)
    return {
      x: 120 + column * 180,
      y: 120 + row * 140,
    }
  }, [getNodes])

  const handleAddNode = useCallback(
    (type: NodeType) => {
      const nodeId = crypto.randomUUID?.() ?? `node-${Date.now()}-${Math.floor(Math.random() * 10_000)}`
      const position = getNextPosition()
      const data = createDefaultData(type)

      addNodes([{ id: nodeId, type, position, data }])
    },
    [addNodes, getNextPosition],
  )

  return (
    <Sidebar title="Node Palette">
      <p className="palette-intro">Click a block to drop it on the canvas.</p>
      <div className="node-grid">
        {nodeTypes.map((type) => (
          <button key={type} type="button" className="node-button" onClick={() => handleAddNode(type)}>
            <span className="node-button__title">{nodeLabels[type]}</span>
            <span className="node-button__type">{type}</span>
          </button>
        ))}
      </div>
    </Sidebar>
  )
}

export default SidebarLeft
