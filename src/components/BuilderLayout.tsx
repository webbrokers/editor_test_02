import {
    ReactFlowProvider,
    addEdge,
    type Connection,
    type Edge,
    type Node,
    useEdgesState,
    useNodesState,
} from 'reactflow'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import FlowCanvas from './FlowCanvas'
import NodePropertiesPanel from './NodePropertiesPanel'
import Toolbar from './Toolbar'
import NodePalette from './NodePalette'
import type { CampaignFlow, NodeConfig, NodeType } from '../types/flow'
import type { NodeData } from '../types/nodes'
import { getCampaignById, saveCampaign } from '../utils/storage'
import { validateCampaign, type ValidationResult } from '../utils/validation'
import { buildNode } from '../utils/nodeFactory'
import '../styles/layout.css'

const initialNodes: Node<NodeData, NodeType>[] = []
const initialEdges: Edge[] = []

type BuilderLayoutProps = {
    initialCampaignId?: string
    onNavigate: (view: 'landing' | 'builder' | 'campaigns') => void
    onCampaignSaved: () => void
}

export default function BuilderLayout({ initialCampaignId, onNavigate, onCampaignSaved }: BuilderLayoutProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
    const [campaignName, setCampaignName] = useState('Новая кампания')
    const [currentFlowId, setCurrentFlowId] = useState(
        () => initialCampaignId ?? crypto.randomUUID?.() ?? `flow-${Date.now()}`,
    )
    const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)

    // Load initial campaign if provided
    useEffect(() => {
        if (initialCampaignId) {
            const flow = getCampaignById(initialCampaignId)
            if (flow) {
                setNodes(flow.nodes as Node<NodeData, NodeType>[])
                setEdges(flow.edges as Edge[])
                setCampaignName(flow.name)
                setCurrentFlowId(flow.id)
            }
        }
    }, [initialCampaignId, setNodes, setEdges])

    const handleConnect = useCallback(
        (connection: Connection) => setEdges((current) => addEdge(connection, current)),
        [setEdges],
    )

    const handleSelectNode = useCallback((node: Node<NodeData, NodeType> | null) => {
        setSelectedNodeId(node?.id ?? null)
    }, [])

    const handleAddNode = useCallback(
        (type: NodeType, position?: { x: number; y: number }) => {
            setNodes((current) => {
                const fallbackPosition = { x: 200 + current.length * 18, y: 140 + current.length * 18 }
                return [...current, buildNode(type, position ?? fallbackPosition)]
            })
        },
        [setNodes],
    )

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
        setCampaignName('Новая кампания')
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
        onCampaignSaved()
    }, [buildFlow, onCampaignSaved])

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
            onLoad: () => { }, // Load is handled by parent via navigation
            onExport: handleExport,
            onValidate: handleValidate,
            savedCampaigns: [], // Not needed in builder view for now, or could be passed if we want a dropdown
            validationResult,
            designVersion: 'v2' as const,
            view: 'builder' as const,
            onNavigate: (nextView: 'builder' | 'campaigns') => onNavigate(nextView),
            onBackToLanding: () => onNavigate('landing'),
        }),
        [
            campaignName,
            handleExport,
            handleNew,
            handleSave,
            handleValidate,
            onNavigate,
            validationResult,
        ],
    )



    return (
        <div className="builder-layout">
            <ReactFlowProvider>
                <aside className="app-sidebar">
                    <div className="app-sidebar__brand">⧉</div>
                    <nav className="app-sidebar__nav">
                        <button
                            type="button"
                            className="app-sidebar__item is-active"
                            aria-label="Конструктор"
                        >
                            ⚙️
                        </button>
                        <button
                            type="button"
                            className="app-sidebar__item"
                            onClick={() => onNavigate('campaigns')}
                            aria-label="Кампании"
                        >
                            📄
                        </button>
                        <button type="button" className="app-sidebar__item" aria-label="Статистика">
                            📈
                        </button>
                    </nav>
                    <div className="app-sidebar__footer">
                        <button type="button" className="app-sidebar__item" aria-label="Профиль">
                            🙂
                        </button>
                    </div>
                </aside>

                <div className="app-main">
                    <div className="app-header">
                        <Toolbar {...toolbarProps} />
                        <NodePalette />
                    </div>

                    <div className="app-canvas">
                        <FlowCanvas
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={handleConnect}
                            onSelectNode={handleSelectNode}
                            onAddNode={handleAddNode}
                        />

                        <div className={`properties-panel-overlay ${selectedNode ? 'is-open' : ''}`}>
                            <NodePropertiesPanel
                                selectedNode={selectedNode}
                                onChangeData={handleChangeData}
                                onClose={() => setSelectedNodeId(null)}
                            />
                        </div>
                    </div>
                </div>
            </ReactFlowProvider>
        </div>
    )
}
