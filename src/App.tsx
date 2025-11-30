import { useCallback, useState } from 'react'
import BuilderLayout from './components/BuilderLayout'
import CampaignList from './components/CampaignList'
import type { CampaignFlow } from './types/flow'
import { getCampaigns, deleteCampaign, renameCampaign } from './utils/storage'
import './styles/layout.css'

type ViewMode = 'landing' | 'builder' | 'campaigns'

function App() {
  const [view, setView] = useState<ViewMode>('landing')
  const [currentCampaignId, setCurrentCampaignId] = useState<string | undefined>(undefined)
  const [savedCampaigns, setSavedCampaigns] = useState<CampaignFlow[]>(() => getCampaigns())

  const handleNavigate = useCallback((nextView: ViewMode) => {
    setView(nextView)
  }, [])

  const handleLoadCampaign = useCallback((id: string) => {
    setCurrentCampaignId(id)
    setView('builder')
  }, [])

  const handleCreateCampaign = useCallback(() => {
    setCurrentCampaignId(undefined)
    setView('builder')
  }, [])

  const handleDeleteCampaign = useCallback((id: string) => {
    deleteCampaign(id)
    setSavedCampaigns(getCampaigns())
  }, [])

  const handleRenameCampaign = useCallback((id: string, nextName: string) => {
    renameCampaign(id, nextName)
    setSavedCampaigns(getCampaigns())
  }, [])

  const handleCampaignSaved = useCallback(() => {
    setSavedCampaigns(getCampaigns())
  }, [])

  if (view === 'landing') {
    return (
      <div className="landing">
        <div className="landing__card landing__card--focus">
          <div className="landing__badge">Обновление</div>
          <h1>Campaign Flow Builder</h1>
          <p>Визуальный конструктор маркетинговых кампаний.</p>
          <ul className="landing__list">
            <li>Создавайте сложные сценарии с помощью визуального редактора</li>
            <li>Используйте готовые блоки для сегментации и действий</li>
            <li>Сохраняйте и экспортируйте свои кампании</li>
          </ul>
          <div className="landing__actions">
            <button className="primary" type="button" onClick={handleCreateCampaign}>
              Создать кампанию
            </button>
            <button className="ghost" type="button" onClick={() => setView('campaigns')}>
              Мои кампании
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app app--v2">
      {view === 'campaigns' ? (
        <main className="workspace workspace--v2">
          <aside className="nav-rail">
            <div className="nav-rail__brand">⧉</div>
            <button
              type="button"
              className="nav-rail__item"
              onClick={() => setView('builder')}
              aria-label="Конструктор"
            >
              ⚙️
            </button>
            <button
              type="button"
              className="nav-rail__item is-active"
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
          <div className="panel panel--wide">
            <CampaignList
              campaigns={savedCampaigns}
              onOpen={handleLoadCampaign}
              onDelete={handleDeleteCampaign}
              onRename={handleRenameCampaign}
              onCreate={handleCreateCampaign}
            />
          </div>
        </main>
      ) : (
        <BuilderLayout
          initialCampaignId={currentCampaignId}
          onNavigate={(v) => setView(v)}
          onCampaignSaved={handleCampaignSaved}
        />
      )}
    </div>
  )
}

export default App
