import { useMemo, useState } from 'react'
import type { CampaignFlow } from '../types/flow'
import type { ValidationResult } from '../utils/validation'
import './Toolbar.css'

type ToolbarProps = {
  campaignName: string
  savedCampaigns: CampaignFlow[]
  validationResult: ValidationResult | null
  onCampaignNameChange: (name: string) => void
  onNew: () => void
  onSave: () => void
  onLoad: (id: string) => void
  onExport: () => void
  onValidate: () => ValidationResult
  designVersion?: 'v1' | 'v2'
  view?: 'builder' | 'campaigns'
  onNavigate?: (view: 'builder' | 'campaigns') => void
  onBackToLanding?: () => void
}

function Toolbar({
  campaignName,
  savedCampaigns,
  validationResult,
  onCampaignNameChange,
  onNew,
  onSave,
  onLoad,
  onExport,
  onValidate,
  designVersion = 'v2',
  view = 'builder',
  onNavigate,
  onBackToLanding,
}: ToolbarProps) {
  const [showLoadList, setShowLoadList] = useState(false)
  const [showValidation, setShowValidation] = useState(false)

  const handleValidate = () => {
    onValidate()
    setShowValidation(true)
  }

  const hasErrors = validationResult && !validationResult.valid
  const validationSummary = useMemo(() => {
    if (!validationResult) return 'Проверка еще не запускалась'
    return validationResult.valid ? 'Проверка пройдена' : `${validationResult.errors.length} проблем`
  }, [validationResult])

  return (
    <header className={`toolbar ${designVersion === 'v2' ? 'toolbar--v2' : ''}`}>
      <div className="brand">
        <button className="brand-back" type="button" aria-label="К выбору дизайна" onClick={onBackToLanding}>
          ←
        </button>
        <span className="brand-accent" aria-hidden>
          *
        </span>
        <span className="brand-title">Конструктор кампаний</span>
        <div className="view-switch">
          <button
            className={`view-switch__item ${view === 'builder' ? 'is-active' : ''}`}
            type="button"
            onClick={() => onNavigate?.('builder')}
          >
            Конструктор
          </button>
          <button
            className={`view-switch__item ${view === 'campaigns' ? 'is-active' : ''}`}
            type="button"
            onClick={() => onNavigate?.('campaigns')}
          >
            Кампании
          </button>
        </div>
      </div>

      <div className="toolbar-name">
        <label className="sr-only" htmlFor="campaign-name">
          Название кампании
        </label>
        <input
          id="campaign-name"
          className="name-input"
          value={campaignName}
          onChange={(event) => onCampaignNameChange(event.target.value)}
          placeholder="Новая кампания"
        />
        <span className="status-pill">В разработке</span>
      </div>

      <nav className="toolbar-actions" aria-label="Действия">
        <button className="toolbar-button" type="button" onClick={onNew}>
          Новый
        </button>
        <button className="toolbar-button" type="button" onClick={onSave}>
          Сохранить
        </button>
        <div className="toolbar-dropdown">
          <button
            className="toolbar-button"
            type="button"
            aria-expanded={showLoadList}
            onClick={() => setShowLoadList((open) => !open)}
          >
            Загрузить
          </button>
          {showLoadList && (
            <div className="toolbar-panel">
              {savedCampaigns.length === 0 ? (
                <div className="toolbar-panel__empty">Нет сохранений</div>
              ) : (
                savedCampaigns.map((campaign) => (
                  <button
                    key={campaign.id}
                    type="button"
                    className="toolbar-panel__item"
                    onClick={() => {
                      onLoad(campaign.id)
                      setShowLoadList(false)
                    }}
                  >
                    <span className="toolbar-panel__title">{campaign.name}</span>
                    <span className="toolbar-panel__subtitle">{campaign.id}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
        <button className="toolbar-button" type="button" onClick={onExport}>
          Экспорт JSON
        </button>
        <div className="toolbar-dropdown">
          <button className="toolbar-button" type="button" onClick={handleValidate}>
            Проверить
          </button>
          {showValidation && (
            <div className="toolbar-panel toolbar-panel--wide">
              <div className="toolbar-panel__title-row">
                <div className={hasErrors ? 'text-error' : 'text-success'}>{validationSummary}</div>
                <button
                  className="toolbar-close"
                  type="button"
                  aria-label="Close validation results"
                  onClick={() => setShowValidation(false)}
                >
                  x
                </button>
              </div>
              {validationResult?.errors.length ? (
                <ul className="validation-list">
                  {validationResult.errors.map((error, index) => (
                    <li key={`${error.nodeId ?? 'error'}-${index}`}>
                      <span className="validation-message">{error.message}</span>
                      {error.nodeId ? <span className="validation-node">Нода: {error.nodeId}</span> : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="toolbar-panel__empty">Ошибок не найдено</div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Toolbar
