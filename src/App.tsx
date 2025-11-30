import {
  ReactFlowProvider,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  useEdgesState,
  useNodesState,
} from 'reactflow'
import { useCallback, useEffect, useMemo, useState } from 'react'
import FlowCanvas from './components/FlowCanvas'
import NodePropertiesPanel from './components/NodePropertiesPanel'
import SidebarLeft from './components/SidebarLeft'
import Toolbar from './components/Toolbar'
import type { CampaignFlow, NodeConfig, NodeType } from './types/flow'
import type { NodeData } from './types/nodes'
import { getCampaignById, getCampaigns, saveCampaign } from './utils/storage'
import { validateCampaign, type ValidationResult } from './utils/validation'
import './styles/layout.css'

const initialNodes: Node<NodeData, NodeType>[] = []
const initialEdges: Edge[] = []

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [campaignName, setCampaignName] = useState('Untitled campaign')
  const [currentFlowId, setCurrentFlowId] = useState(
    () => crypto.randomUUID?.() ?? `flow-${Date.now()}`,
  )
  const [savedCampaigns, setSavedCampaigns] = useState<CampaignFlow[]>(() => getCampaigns())
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)

  const handleConnect = useCallback(
    (connection: Connection) => setEdges((current) => addEdge(connection, current)),
    [setEdges],
  )

  const handleSelectNode = useCallback((node: Node<NodeData, NodeType> | null) => {
    setSelectedNodeId(node?.id ?? null)
  }, [])

  const selectedNode = useMemo<NodeConfig<NodeData> | null>(() => {
    const match = nodes.find((node) => node.id === selectedNodeId)
    if (!match) return null
    const { id, type, position, data } = match
    return { id, type: type as NodeType, position, data }
  }, [nodes, selectedNodeId])

  useEffect(() => {
    if (selectedNodeId && !nodes.some((node) => node.id === selectedNodeId)) {
      setSelectedNodeId(null)
    }
  }, [nodes, selectedNodeId])

  const handleChangeData = useCallback(
    (nodeId: string, newData: NodeData) => {
      setNodes((current) => current.map((node) => (node.id === nodeId ? { ...node, data: newData } : node)))
    },
    [setNodes],
  )

  const handleNew = useCallback(() => {
    setNodes([])
    setEdges([])
    setSelectedNodeId(null)
    setCampaignName('Untitled campaign')
    setCurrentFlowId(crypto.randomUUID?.() ?? `flow-${Date.now()}`)
    setValidationResult(null)
  }, [setEdges, setNodes])

  const buildFlow = useCallback((): CampaignFlow => {
    const name = campaignName.trim() || 'Untitled campaign'
    return { id: currentFlowId, name, nodes, edges }
  }, [campaignName, currentFlowId, nodes, edges])

  const handleSave = useCallback(() => {
    const flow = buildFlow()
    saveCampaign(flow)
    setCampaignName(flow.name)
    setSavedCampaigns(getCampaigns())
  }, [buildFlow])

  const handleLoad = useCallback(
    (id: string) => {
      const flow = getCampaignById(id)
      if (!flow) return
      setNodes(flow.nodes as Node<NodeData, NodeType>[])
      setEdges(flow.edges as Edge[])
      setSelectedNodeId(null)
      setCampaignName(flow.name)
      setCurrentFlowId(flow.id)
      setValidationResult(null)
    },
    [setEdges, setNodes, setSelectedNodeId],
  )

  const handleExport = useCallback(() => {
    const flow = buildFlow()
    const blob = new Blob([JSON.stringify(flow, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const slug = flow.name.toLowerCase().replace(/\s+/g, '-')
    link.href = url
    link.download = `${slug || 'campaign-flow'}-${flow.id}.json`
    link.click()
    URL.revokeObjectURL(url)
  }, [buildFlow])

  const handleValidate = useCallback(() => {
    const flow = buildFlow()
    const result = validateCampaign(flow)
    setValidationResult(result)
    return result
  }, [buildFlow])

  const toolbarProps = useMemo(
    () => ({
      campaignName,
      onCampaignNameChange: setCampaignName,
      onNew: handleNew,
      onSave: handleSave,
      onLoad: handleLoad,
      onExport: handleExport,
      onValidate: handleValidate,
      savedCampaigns,
      validationResult,
    }),
    [
      campaignName,
      handleExport,
      handleLoad,
      handleNew,
      handleSave,
      handleValidate,
      savedCampaigns,
      validationResult,
    ],
  )

  return (
    <div className="app">
      <Toolbar {...toolbarProps} />
      <ReactFlowProvider>
        <main className="workspace">
          <SidebarLeft />

          <FlowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={handleConnect}
            onSelectNode={handleSelectNode}
          />

          <NodePropertiesPanel selectedNode={selectedNode} onChangeData={handleChangeData} />
        </main>
      </ReactFlowProvider>
    </div>
  )
}

export default App
