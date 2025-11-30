import { useCallback, useMemo, useRef, useState } from 'react'
import type { DragEvent, MouseEvent } from 'react'
import ReactFlow, {
  Background,
  Connection,
  ConnectionMode,
  Controls,
  Edge,
  Node,
  OnEdgesChange,
  OnNodesChange,
  OnSelectionChangeParams,
} from 'reactflow'
import type { XYPosition } from 'reactflow'
import type { NodeType } from '../types/flow'
import type { NodeData } from '../types/nodes'
import { nodeIcons, nodeTypeLabels } from '../utils/nodeFactory'
import { useReactFlow } from 'reactflow'
import nodeTypes from './NodeRenderer'
import 'reactflow/dist/style.css'
import './FlowCanvas.css'

type FlowCanvasProps = {
  nodes: Node<NodeData, NodeType>[]
  edges: Edge[]
  onNodesChange: OnNodesChange<NodeData>
  onEdgesChange: OnEdgesChange
  onConnect: (connection: Connection) => void
  onSelectNode: (node: Node<NodeData, NodeType> | null) => void
  onAddNode: (type: NodeType, position: XYPosition) => void
}

function FlowCanvas({ nodes, edges, onNodesChange, onEdgesChange, onConnect, onSelectNode, onAddNode }: FlowCanvasProps) {
  const { project } = useReactFlow<NodeData>()
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [menu, setMenu] = useState<{ x: number; y: number; flow: XYPosition } | null>(null)

  const handleSelectionChange = useCallback(
    (params: OnSelectionChangeParams) => {
      const selectedNodes = (params?.nodes as Node<NodeData, NodeType>[]) || []
      onSelectNode(selectedNodes[0] ?? null)
    },
    [onSelectNode],
  )

  const handleNodeClick = useCallback(
    (_event: MouseEvent, node: Node<NodeData, NodeType>) => {
      onSelectNode(node)
    },
    [onSelectNode],
  )

  const handlePaneDoubleClick = useCallback(
    (event: MouseEvent) => {
      event.preventDefault()
      const flow = project({ x: event.clientX, y: event.clientY })
      const bounds = wrapperRef.current?.getBoundingClientRect()
      if (!bounds) return
      setMenu({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
        flow,
      })
    },
    [project],
  )

  const handleAddFromMenu = useCallback(
    (type: NodeType) => {
      if (!menu) return
      onAddNode(type, menu.flow)
      setMenu(null)
    },
    [menu, onAddNode],
  )

  const handleDragOver = useCallback((event: DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
  }, [])

  const handleDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault()
      const type = event.dataTransfer?.getData('application/reactflow') as NodeType
      if (!type) return
      const flow = project({ x: event.clientX, y: event.clientY })
      onAddNode(type, flow)
      setMenu(null)
    },
    [onAddNode, project, setMenu],
  )

  const nodeOptions = useMemo(() => Object.keys(nodeTypeLabels) as NodeType[], [])

  return (
    <section className="flow-canvas" ref={wrapperRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={handleSelectionChange}
        onNodeClick={handleNodeClick}
        onPaneDoubleClick={handlePaneDoubleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        connectionMode={ConnectionMode.Loose}
        panOnDrag
        fitView
        className="flow-canvas__surface"
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#d9dfe8" gap={22} variant="dots" />
        <Controls position="bottom-right" />
      </ReactFlow>

      {menu ? (
        <div className="context-menu" style={{ top: menu.y, left: menu.x }}>
          <div className="context-menu__title">Добавить ноду</div>
          <div className="context-menu__grid">
            {nodeOptions.map((type) => (
              <button key={type} type="button" className="context-menu__item" onClick={() => handleAddFromMenu(type)}>
                <span className="context-menu__icon" aria-hidden>
                  {nodeIcons[type]}
                </span>
                <div className="context-menu__labels">
                  <span className="context-menu__name">{nodeTypeLabels[type]}</span>
                  <span className="context-menu__slug">{type}</span>
                </div>
              </button>
            ))}
          </div>
          <button className="context-menu__close" type="button" onClick={() => setMenu(null)}>
            Закрыть
          </button>
        </div>
      ) : null}
    </section>
  )
}

export default FlowCanvas
