import type { Node, XYPosition } from 'reactflow'
import type { NodeType } from '../types/flow'
import type { NodeData } from '../types/nodes'

const fallbackId = () => crypto.randomUUID?.() ?? `node-${Date.now()}-${Math.floor(Math.random() * 10_000)}`

export const nodeTypeLabels: Record<NodeType, string> = {
  campaignStart: 'Событие',
  campaignMeta: 'Мета',
  campaignType: 'Тип кампании',
  audienceSegment: 'Сегмент',
  filter: 'Фильтр',
  funnelSplit: 'Разветвление',
  abTest: 'A/B тест',
  action: 'Действие',
  llmText: 'AI текст',
}

export const nodeIcons: Record<NodeType, string> = {
  campaignStart: '🔔',
  campaignMeta: '🗂️',
  campaignType: '🛰️',
  audienceSegment: '👥',
  filter: '⛩️',
  funnelSplit: '🔀',
  abTest: '🧪',
  action: '⚡',
  llmText: '✨',
}

export function createDefaultData(type: NodeType): NodeData {
  switch (type) {
    case 'campaignStart':
      return { name: 'Событие', description: 'Точка входа', triggerType: 'immediate' }
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
          { key: 'Канал', value: 'Email' },
          { key: 'Каденция', value: 'Еженедельно' },
        ],
      }
    case 'audienceSegment':
      return { conditions: [{ field: 'country', operator: 'equals', value: 'RU' }] }
    case 'filter':
      return { conditions: [{ field: 'status', operator: 'equals', value: 'active' }] }
    case 'funnelSplit':
      return {
        attribute: 'device',
        branches: [
          { id: 'ветка-a', label: 'Мобайл', condition: 'device = mobile' },
          { id: 'ветка-b', label: 'Десктоп', condition: 'device = desktop' },
        ],
      }
    case 'abTest':
      return {
        title: 'Тест заголовка',
        splitA: 50,
      }
    case 'action':
      return { actionType: 'sendEmail', payload: '{"templateId":"tmpl-001"}' }
    case 'llmText':
      return {
        title: 'Текст AI',
        prompt: 'Сгенерируй приветствие для кампании.',
        mode: 'generate',
        model: 'gpt-4.1',
        temperature: 0.7,
        maxTokens: 512,
        variables: ['product_name', 'cta_url'],
        autoReplaceInput: true,
      }
    default:
      return { name: 'Нода', description: '', triggerType: 'immediate' }
  }
}

export function buildNode(type: NodeType, position: XYPosition): Node<NodeData, NodeType> {
  return {
    id: fallbackId(),
    type,
    position,
    data: createDefaultData(type),
  }
}
