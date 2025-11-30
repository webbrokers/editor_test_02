import React, { useCallback } from 'react'
import { useReactFlow } from 'reactflow'
import type { NodeType } from '../types/flow'
import type { NodeData } from '../types/nodes'
import { createDefaultData, nodeIcons, nodeTypeLabels } from '../utils/nodeFactory'
import './NodePalette.css'

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

export default function NodePalette() {
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

    const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType)
        event.dataTransfer.effectAllowed = 'move'
    }

    return (
        <div className="node-palette">
            {nodeTypes.map((type) => (
                <div
                    key={type}
                    className="node-palette__item"
                    draggable
                    onDragStart={(event) => onDragStart(event, type)}
                    onClick={() => handleAddNode(type)}
                    title={nodeTypeLabels[type]}
                >
                    <span className="node-palette__icon" aria-hidden>
                        {nodeIcons[type]}
                    </span>
                    <span className="node-palette__label">{nodeTypeLabels[type]}</span>
                </div>
            ))}
        </div>
    )
}
