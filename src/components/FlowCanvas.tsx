import { useCallback } from 'react'
import type { MouseEvent } from 'react'
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
import type { NodeType } from '../types/flow'
import type { NodeData } from '../types/nodes'
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
}

function FlowCanvas({ nodes, edges, onNodesChange, onEdgesChange, onConnect, onSelectNode }: FlowCanvasProps) {
  const handleSelectionChange = useCallback((params: OnSelectionChangeParams) => {
    const selectedNodes = (params?.nodes as Node<NodeData, NodeType>[]) || []
    onSelectNode(selectedNodes[0] ?? null)
  }, [onSelectNode])

  const handleNodeClick = useCallback(
    (_event: MouseEvent, node: Node<NodeData, NodeType>) => {
      onSelectNode(node)
    },
    [onSelectNode],
  )

  return (
    <section className="flow-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={handleSelectionChange}
        onNodeClick={handleNodeClick}
        connectionMode={ConnectionMode.Loose}
        fitView
        className="flow-canvas__surface"
      >
        <Background color="#e2e8f0" gap={24} />
        <Controls />
      </ReactFlow>
    </section>
  )
}

export default FlowCanvas
