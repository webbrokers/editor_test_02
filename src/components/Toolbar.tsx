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
}: ToolbarProps) {
  const [showLoadList, setShowLoadList] = useState(false)
  const [showValidation, setShowValidation] = useState(false)

  const handleValidate = () => {
    onValidate()
    setShowValidation(true)
  }

  const hasErrors = validationResult && !validationResult.valid
  const validationSummary = useMemo(() => {
    if (!validationResult) return 'Not validated yet'
    return validationResult.valid
      ? 'Flow is valid'
      : `${validationResult.errors.length} issue${validationResult.errors.length === 1 ? '' : 's'}`
  }, [validationResult])

  return (
    <header className="toolbar">
      <div className="brand">
        <span className="brand-accent" aria-hidden>
          *
        </span>
        <span className="brand-title">Campaign Builder</span>
      </div>

      <div className="toolbar-name">
        <label className="sr-only" htmlFor="campaign-name">
          Campaign name
        </label>
        <input
          id="campaign-name"
          className="name-input"
          value={campaignName}
          onChange={(event) => onCampaignNameChange(event.target.value)}
          placeholder="Untitled campaign"
        />
      </div>

      <nav className="toolbar-actions" aria-label="Toolbar actions">
        <button className="toolbar-button" type="button" onClick={onNew}>
          New
        </button>
        <button className="toolbar-button" type="button" onClick={onSave}>
          Save
        </button>
        <div className="toolbar-dropdown">
          <button
            className="toolbar-button"
            type="button"
            aria-expanded={showLoadList}
            onClick={() => setShowLoadList((open) => !open)}
          >
            Load
          </button>
          {showLoadList && (
            <div className="toolbar-panel">
              {savedCampaigns.length === 0 ? (
                <div className="toolbar-panel__empty">No saved campaigns</div>
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
          Export JSON
        </button>
        <div className="toolbar-dropdown">
          <button className="toolbar-button" type="button" onClick={handleValidate}>
            Validate
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
                      {error.nodeId ? <span className="validation-node">Node: {error.nodeId}</span> : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="toolbar-panel__empty">No validation errors</div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Toolbar
