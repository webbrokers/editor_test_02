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
import CampaignList from './components/CampaignList'
import Toolbar from './components/Toolbar'
import type { CampaignFlow, NodeConfig, NodeType } from './types/flow'
import type { NodeData } from './types/nodes'
import { getCampaignById, getCampaigns, saveCampaign, deleteCampaign, renameCampaign } from './utils/storage'
import { validateCampaign, type ValidationResult } from './utils/validation'
import { buildNode, nodeIcons, nodeTypeLabels } from './utils/nodeFactory'
import './styles/layout.css'

const initialNodes: Node<NodeData, NodeType>[] = []
const initialEdges: Edge[] = []
type DesignVersion = 'v1' | 'v2'
type ViewMode = 'landing' | 'builder' | 'campaigns'
const nodeOrder: NodeType[] = [
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

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [campaignName, setCampaignName] = useState('Новая кампания')
  const [designVersion, setDesignVersion] = useState<DesignVersion | null>(null)
  const [view, setView] = useState<ViewMode>('landing')
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

  const handleDelete = useCallback(
    (id: string) => {
      deleteCampaign(id)
      setSavedCampaigns(getCampaigns())
      if (currentFlowId === id) {
        handleNew()
      }
    },
    [currentFlowId, handleNew],
  )

  const handleRename = useCallback(
    (id: string, nextName: string) => {
      renameCampaign(id, nextName)
      setSavedCampaigns(getCampaigns())
      if (id === currentFlowId) {
        setCampaignName(nextName)
      }
    },
    [currentFlowId],
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

  const handleSelectDesign = (version: DesignVersion) => {
    setDesignVersion(version)
    setView('builder')
  }

  const handleBackToLanding = () => {
    setView('landing')
  }

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
      designVersion: designVersion ?? 'v2',
      view: view === 'campaigns' ? 'campaigns' : 'builder',
      onNavigate: (nextView: 'builder' | 'campaigns') => setView(nextView),
      onBackToLanding: handleBackToLanding,
    }),
    [
      campaignName,
      designVersion,
      handleExport,
      handleLoad,
      handleNew,
      handleSave,
      handleValidate,
      handleBackToLanding,
      savedCampaigns,
      validationResult,
      view,
    ],
  )

  if (view === 'landing') {
    return (
      <div className="landing">
        <div className="landing__card landing__card--focus">
          <div className="landing__badge">Новый</div>
          <h1>Дизайн версия 2</h1>
          <p>Темный фон, аккуратные квадраты-нод, русская локализация, контекстное меню по двойному клику и панель параметров справа.</p>
          <ul className="landing__list">
            <li>Добавляйте ноды из верхней панели, двойным кликом или перетягивая связь</li>
            <li>Редактируйте свойства в боковой панели, все подписи на русском</li>
            <li>Сохраняйте кампании и управляйте ими в списке</li>
          </ul>
          <div className="landing__actions">
            <button className="primary" type="button" onClick={() => handleSelectDesign('v2')}>
              Перейти в дизайн v2
            </button>
            <button className="ghost" type="button" onClick={() => handleSelectDesign('v1')}>
              Оставаться в v1
            </button>
          </div>
        </div>
        <div className="landing__card">
          <h2>Дизайн версия 1</h2>
          <p>Текущий интерфейс без новых элементов. Можно переключиться позже.</p>
          <button className="ghost" type="button" onClick={() => handleSelectDesign('v1')}>
            Открыть дизайн v1
          </button>
        </div>
      </div>
    )
  }

  const isModern = designVersion === 'v2'

  return (
    <div className={`app ${isModern ? 'app--v2' : ''}`}>
      <Toolbar {...toolbarProps} />
      <ReactFlowProvider>
        <main className={`workspace ${isModern ? 'workspace--v2' : ''}`}>
          <aside className="nav-rail">
            <div className="nav-rail__brand">⧉</div>
            <button
              type="button"
              className={`nav-rail__item ${view === 'builder' ? 'is-active' : ''}`}
              onClick={() => setView('builder')}
              aria-label="Конструктор"
            >
              ⚙️
            </button>
            <button
              type="button"
              className={`nav-rail__item ${view === 'campaigns' ? 'is-active' : ''}`}
              onClick={() => setView('campaigns')}
              aria-label="Кампании"
            >
              📄
            </button>
            <button type="button" className="nav-rail__item" aria-label="Статистика">
              📈
            </button>
            <div className="nav-rail__footer">
              <button type="button" className="nav-rail__item" aria-label="Профиль">
                🙂
              </button>
            </div>
          </aside>

          {view === 'campaigns' ? (
            <div className="panel panel--wide">
              <CampaignList
                campaigns={savedCampaigns}
                onOpen={(id) => {
                  handleLoad(id)
                  setView('builder')
                }}
                onDelete={handleDelete}
                onRename={handleRename}
                onCreate={() => {
                  handleNew()
                  setView('builder')
                }}
              />
            </div>
          ) : (
            <div className="builder-shell">
              <div className="node-toolbar">
                {nodeOrder.map((type) => (
                  <button
                    key={type}
                    type="button"
                    className="node-toolbar__item"
                    draggable
                    onDragStart={(event) => event.dataTransfer.setData('application/reactflow', type)}
                    onClick={() => handleAddNode(type)}
                  >
                    <span className="node-toolbar__icon" aria-hidden>
                      {nodeIcons[type]}
                    </span>
                    <span className="node-toolbar__label">{nodeTypeLabels[type]}</span>
                  </button>
                ))}
              </div>

              <section className="builder-grid">
                <FlowCanvas
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={handleConnect}
                  onSelectNode={handleSelectNode}
                  onAddNode={handleAddNode}
                />

                <NodePropertiesPanel selectedNode={selectedNode} onChangeData={handleChangeData} />
              </section>
            </div>
          )}
        </main>
      </ReactFlowProvider>
    </div>
  )
}

export default App
