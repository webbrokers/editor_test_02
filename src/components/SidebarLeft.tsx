import { useCallback } from 'react'
import { useReactFlow } from 'reactflow'
import Sidebar from './Sidebar'
import type { NodeType } from '../types/flow'
import type { NodeData } from '../types/nodes'
import { createDefaultData, nodeIcons, nodeTypeLabels } from '../utils/nodeFactory'
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
    <Sidebar title="Панель блоков">
      <p className="palette-intro">Кликните на блок, чтобы добавить его на холст.</p>
      <div className="node-grid">
        {nodeTypes.map((type) => (
          <button key={type} type="button" className="node-button" onClick={() => handleAddNode(type)}>
            <span className="node-button__icon" aria-hidden>
              {nodeIcons[type]}
            </span>
            <span className="node-button__title">{nodeTypeLabels[type]}</span>
            <span className="node-button__type">{type}</span>
          </button>
        ))}
      </div>
    </Sidebar>
  )
}

export default SidebarLeft
