import type { ChangeEvent } from 'react'
import Sidebar from './Sidebar'
import type { NodeConfig, NodeType } from '../types/flow'
import type {
  AbTestData,
  ActionNodeData,
  AudienceSegmentData,
  CampaignMetaData,
  CampaignStartData,
  CampaignTypeData,
  Condition,
  FilterNodeData,
  FunnelSplitData,
  LlmTextNodeData,
  NodeData,
} from '../types/nodes'
import './NodePropertiesPanel.css'

type NodePropertiesPanelProps = {
  selectedNode: NodeConfig<NodeData> | null
  onChangeData: (nodeId: string, newData: NodeData) => void
}

const placementTypes = [
  { value: 'email', label: 'Email' },
  { value: 'push', label: 'Push' },
  { value: 'sms', label: 'SMS' },
  { value: 'inapp', label: 'In-App' },
]

const conditionOperators = ['equals', 'contains', 'starts_with', 'gt', 'lt', 'exists']

function renderHeader(type: NodeType, nodeId: string) {
  return (
    <div className="properties__meta">
      <div className="properties__type">{type}</div>
      <div className="properties__id">#{nodeId}</div>
    </div>
  )
}

function NodePropertiesPanel({ selectedNode, onChangeData }: NodePropertiesPanelProps) {
  if (!selectedNode) {
    return (
      <Sidebar title="Параметры ноды">
        <div className="placeholder">Выберите ноду на холсте, чтобы настроить её параметры.</div>
        <div className="properties__hint">Дважды кликните на холст или перетащите блок сверху, чтобы создать новую ноду.</div>
      </Sidebar>
    )
  }

  const { id, type, data } = selectedNode
  const updateData = (nextData: NodeData) => onChangeData(id, nextData)

  const renderConditions = (
    conditions: Condition[],
    onUpdate: (next: Condition[]) => void,
    addLabel = 'Добавить условие',
  ) => (
    <div className="stack" data-section="conditions">
      <div className="stack__items">
        {conditions.map((condition, index) => (
          <div key={`${condition.field}-${index}`} className="field-row">
            <input
              className="input"
              placeholder="Поле"
              value={condition.field}
              onChange={(event) => {
                const next = [...conditions]
                next[index] = { ...condition, field: event.target.value }
                onUpdate(next)
              }}
            />
            <select
              className="input"
              value={condition.operator}
              onChange={(event) => {
                const next = [...conditions]
                next[index] = { ...condition, operator: event.target.value }
                onUpdate(next)
              }}
            >
              {conditionOperators.map((operator) => (
                <option key={operator} value={operator}>
                  {operator}
                </option>
              ))}
            </select>
            <input
              className="input"
              placeholder="Значение"
              value={condition.value}
              onChange={(event) => {
                const next = [...conditions]
                next[index] = { ...condition, value: event.target.value }
                onUpdate(next)
              }}
            />
            <button
              type="button"
              className="icon-button"
              onClick={() => onUpdate(conditions.filter((_, idx) => idx !== index))}
              aria-label="Удалить условие"
            >
              x
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="ghost-button"
        onClick={() => onUpdate([...conditions, { field: '', operator: 'equals', value: '' }])}
      >
        {addLabel}
      </button>
    </div>
  )

  const renderPlacementOptions = (options: { key: string; value: string }[], onUpdate: (next: { key: string; value: string }[]) => void) => (
    <div className="stack">
      {options.map((option, index) => (
        <div key={`${option.key}-${index}`} className="field-row field-row--placement">
          <input
              className="input"
              placeholder="Ключ"
              value={option.key}
              onChange={(event) => {
                const next = [...options]
                next[index] = { ...option, key: event.target.value }
              onUpdate(next)
            }}
          />
          <input
              className="input"
              placeholder="Значение"
              value={option.value}
              onChange={(event) => {
                const next = [...options]
                next[index] = { ...option, value: event.target.value }
              onUpdate(next)
            }}
          />
          <button
            type="button"
            className="icon-button"
            onClick={() => onUpdate(options.filter((_, idx) => idx !== index))}
            aria-label="Удалить опцию"
          >
            x
          </button>
        </div>
      ))}
      <button
        type="button"
        className="ghost-button"
        onClick={() => onUpdate([...options, { key: '', value: '' }])}
      >
        Добавить настройку
      </button>
    </div>
  )

  const renderBranches = (branches: FunnelSplitData['branches'], onUpdate: (next: FunnelSplitData['branches']) => void) => (
    <div className="stack">
      {branches.map((branch, index) => (
          <div key={branch.id || index} className="stack stack--border">
            <div className="field">
              <label>ID ветки</label>
              <input
                className="input"
                value={branch.id}
                onChange={(event) => {
                const next = [...branches]
                next[index] = { ...branch, id: event.target.value }
                onUpdate(next)
              }}
            />
            </div>
            <div className="field">
              <label>Название</label>
              <input
                className="input"
                value={branch.label}
              onChange={(event) => {
                const next = [...branches]
                next[index] = { ...branch, label: event.target.value }
                onUpdate(next)
              }}
            />
            </div>
            <div className="field">
              <label>Условие</label>
              <input
                className="input"
                value={branch.condition}
              onChange={(event) => {
                const next = [...branches]
                next[index] = { ...branch, condition: event.target.value }
                onUpdate(next)
              }}
            />
          </div>
          <button
            type="button"
            className="ghost-button ghost-button--danger"
            onClick={() => onUpdate(branches.filter((_, idx) => idx !== index))}
          >
            Удалить ветку
          </button>
        </div>
      ))}
      <button
        type="button"
        className="ghost-button"
        onClick={() =>
          onUpdate([
            ...branches,
            { id: `branch-${branches.length + 1}`, label: `Ветка ${branches.length + 1}`, condition: '' },
          ])
        }
      >
        Добавить ветку
      </button>
    </div>
  )

  const renderVariables = (variables: string[], onUpdate: (next: string[]) => void) => (
    <div className="stack">
      {variables.map((variable, index) => (
        <div key={`${variable}-${index}`} className="field-row field-row--compact">
          <input
            className="input"
            value={variable}
            placeholder="Имя переменной"
            onChange={(event) => {
              const next = [...variables]
              next[index] = event.target.value
              onUpdate(next)
            }}
          />
          <button
            type="button"
            className="icon-button"
            onClick={() => onUpdate(variables.filter((_, idx) => idx !== index))}
            aria-label="Удалить переменную"
          >
            x
          </button>
        </div>
      ))}
      <button type="button" className="ghost-button" onClick={() => onUpdate([...variables, ''])}>
        Добавить переменную
      </button>
    </div>
  )

  const renderByType = () => {
    switch (type) {
      case 'campaignStart': {
        const current: CampaignStartData = {
          name: (data as CampaignStartData).name ?? '',
          description: (data as CampaignStartData).description ?? '',
          triggerType: (data as CampaignStartData).triggerType ?? 'immediate',
        }
        const updateField = (field: keyof CampaignStartData, value: string) =>
          updateData({ ...current, [field]: value })

        return (
          <div className="stack">
            <div className="field">
              <label>Название</label>
              <input className="input" value={current.name} onChange={(event) => updateField('name', event.target.value)} />
            </div>
            <div className="field">
              <label>Описание</label>
              <textarea
                className="input input--textarea"
                rows={3}
                value={current.description}
                onChange={(event) => updateField('description', event.target.value)}
              />
            </div>
            <div className="field">
              <label>Триггер</label>
              <input
                className="input"
                value={current.triggerType}
                onChange={(event) => updateField('triggerType', event.target.value)}
              />
            </div>
          </div>
        )
      }
      case 'campaignMeta': {
        const current: CampaignMetaData = {
          campaignId: (data as CampaignMetaData).campaignId ?? '',
          budget: Number((data as CampaignMetaData).budget ?? 0),
          startDate: (data as CampaignMetaData).startDate ?? '',
          endDate: (data as CampaignMetaData).endDate ?? '',
        }
        const updateField = (field: keyof CampaignMetaData, value: string | number) =>
          updateData({ ...current, [field]: value })

        return (
          <div className="stack">
            <div className="field">
              <label>ID кампании</label>
              <input
                className="input"
                value={current.campaignId}
                onChange={(event) => updateField('campaignId', event.target.value)}
              />
            </div>
            <div className="field">
              <label>Бюджет</label>
              <input
                className="input"
                type="number"
                min={0}
                value={current.budget}
                onChange={(event) => updateField('budget', Number(event.target.value))}
              />
            </div>
          <div className="field-row">
            <div className="field">
              <label>Старт</label>
              <input
                className="input"
                type="date"
                  value={current.startDate || ''}
                  onChange={(event) => updateField('startDate', event.target.value)}
                />
              </div>
            <div className="field">
              <label>Финиш</label>
              <input
                className="input"
                type="date"
                  value={current.endDate || ''}
                  onChange={(event) => updateField('endDate', event.target.value)}
                />
              </div>
            </div>
          </div>
        )
      }
      case 'campaignType': {
        const current: CampaignTypeData = {
          placementType: (data as CampaignTypeData).placementType ?? 'email',
          placementOptions: Array.isArray((data as CampaignTypeData).placementOptions)
            ? (data as CampaignTypeData).placementOptions
            : [],
        }
        const updateField = (field: keyof CampaignTypeData, value: CampaignTypeData[keyof CampaignTypeData]) =>
          updateData({ ...current, [field]: value })

        return (
          <div className="stack">
            <div className="field">
              <label>Тип размещения</label>
              <select
                className="input"
                value={current.placementType}
                onChange={(event) => updateField('placementType', event.target.value)}
              >
                {placementTypes.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Настройки канала</label>
              {renderPlacementOptions(current.placementOptions, (next) => updateField('placementOptions', next))}
            </div>
          </div>
        )
      }
      case 'audienceSegment': {
        const current: AudienceSegmentData = {
          conditions: Array.isArray((data as AudienceSegmentData).conditions)
            ? (data as AudienceSegmentData).conditions
            : [],
        }
        return (
          <div className="stack">
            <label>Условия сегмента</label>
            {renderConditions(current.conditions, (next) => updateData({ ...current, conditions: next }))}
          </div>
        )
      }
      case 'filter': {
        const current: FilterNodeData = {
          conditions: Array.isArray((data as FilterNodeData).conditions)
            ? (data as FilterNodeData).conditions
            : [],
        }
        return (
          <div className="stack">
            <label>Условия фильтрации</label>
            {renderConditions(current.conditions, (next) => updateData({ ...current, conditions: next }))}
          </div>
        )
      }
      case 'funnelSplit': {
        const current: FunnelSplitData = {
          attribute: (data as FunnelSplitData).attribute ?? '',
          branches: Array.isArray((data as FunnelSplitData).branches)
            ? (data as FunnelSplitData).branches
            : [],
        }

        const updateField = (field: keyof FunnelSplitData, value: FunnelSplitData[keyof FunnelSplitData]) =>
          updateData({ ...current, [field]: value })

        return (
          <div className="stack">
            <div className="field">
              <label>Атрибут разветвления</label>
              <input
                className="input"
                value={current.attribute}
                onChange={(event) => updateField('attribute', event.target.value)}
              />
            </div>
            <div className="field">
              <label>Ветки</label>
              {renderBranches(current.branches, (next) => updateField('branches', next))}
            </div>
          </div>
        )
      }
      case 'abTest': {
        const current: AbTestData = {
          title: (data as AbTestData).title ?? '',
          splitA: Math.min(100, Math.max(0, Number((data as AbTestData).splitA ?? 50))),
        }
        const splitB = 100 - current.splitA
        const updateField = (value: number) => updateData({ ...current, splitA: value })

        return (
          <div className="stack">
            <div className="field">
              <label>Название теста</label>
              <input
                className="input"
                value={current.title}
                onChange={(event) => updateData({ ...current, title: event.target.value })}
              />
            </div>
            <div className="field">
              <label>Соотношение A / B</label>
              <div className="slider-row">
                <input
                  className="input input--range"
                  type="range"
                  min={0}
                  max={100}
                  value={current.splitA}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => updateField(Number(event.target.value))}
                />
                <div className="slider-row__values">
                  <span>A: {current.splitA}%</span>
                  <span>B: {splitB}%</span>
                </div>
              </div>
            </div>
          </div>
        )
      }
      case 'action': {
        const current: ActionNodeData = {
          actionType: (data as ActionNodeData).actionType ?? '',
          payload: (data as ActionNodeData).payload ?? '',
        }

        return (
          <div className="stack">
            <div className="field">
              <label>Тип действия</label>
              <input
                className="input"
                value={current.actionType}
                onChange={(event) => updateData({ ...current, actionType: event.target.value })}
              />
            </div>
            <div className="field">
              <label>Payload / тело</label>
              <textarea
                className="input input--textarea"
                rows={4}
                value={current.payload}
                onChange={(event) => updateData({ ...current, payload: event.target.value })}
              />
            </div>
          </div>
        )
      }
      case 'llmText': {
        const clampNumber = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
        const safeNumber = (value: number, fallback: number) => (Number.isFinite(value) ? value : fallback)

        const current: LlmTextNodeData = {
          title: (data as LlmTextNodeData).title ?? '',
          prompt: (data as LlmTextNodeData).prompt ?? '',
          mode: (data as LlmTextNodeData).mode === 'transform' ? 'transform' : 'generate',
          model: (data as LlmTextNodeData).model ?? 'gpt-4.1',
          temperature: clampNumber(
            safeNumber(Number((data as LlmTextNodeData).temperature ?? 0.7), 0.7),
            0,
            1.5,
          ),
          maxTokens: Math.max(1, safeNumber(Number((data as LlmTextNodeData).maxTokens ?? 512), 512)),
          variables: Array.isArray((data as LlmTextNodeData).variables)
            ? (data as LlmTextNodeData).variables
            : [],
          autoReplaceInput: Boolean((data as LlmTextNodeData).autoReplaceInput),
        }

        const updateField = (field: keyof LlmTextNodeData, value: LlmTextNodeData[keyof LlmTextNodeData]) =>
          updateData({ ...current, [field]: value })

        return (
          <div className="stack">
            <div className="field">
              <label>Название</label>
              <input className="input" value={current.title} onChange={(event) => updateField('title', event.target.value)} />
            </div>
            <div className="field">
              <label>Промпт</label>
              <textarea
                className="input input--textarea"
                rows={4}
                value={current.prompt}
                onChange={(event) => updateField('prompt', event.target.value)}
              />
            </div>
            <div className="field-row">
              <div className="field">
                <label>Режим</label>
                <select
                  className="input"
                  value={current.mode}
                  onChange={(event) => updateField('mode', event.target.value)}
                >
                  <option value="generate">Generate</option>
                  <option value="transform">Transform</option>
                </select>
              </div>
              <div className="field">
                <label>Модель</label>
                <input
                  className="input"
                  list="llm-models"
                  value={current.model}
                  onChange={(event) => updateField('model', event.target.value)}
                  placeholder="gpt-4.1"
                />
                <datalist id="llm-models">
                  <option value="gpt-4.1" />
                  <option value="o3-mini" />
                  <option value="llama3" />
                </datalist>
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Температура</label>
                <input
                  className="input"
                  type="number"
                  step="0.05"
                  min="0"
                  max="1.5"
                  value={current.temperature}
                  onChange={(event) =>
                    updateField('temperature', clampNumber(safeNumber(Number(event.target.value), current.temperature), 0, 1.5))
                  }
                />
              </div>
              <div className="field">
                <label>Максимум токенов</label>
                <input
                  className="input"
                  type="number"
                  min="1"
                  value={current.maxTokens}
                  onChange={(event) =>
                    updateField('maxTokens', Math.max(1, safeNumber(Number(event.target.value), current.maxTokens)))
                  }
                />
              </div>
            </div>
            <div className="field">
              <label>Переменные</label>
              {renderVariables(current.variables, (next) => updateField('variables', next))}
            </div>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={current.autoReplaceInput}
                onChange={(event) => updateField('autoReplaceInput', event.target.checked)}
              />
              Автозамена плейсхолдеров
            </label>
          </div>
        )
      }
      default:
        return <div className="placeholder">Нет редактора для выбранного типа ноды.</div>
    }
  }

  return (
    <Sidebar title="Параметры ноды">
      {renderHeader(type, id)}
      {renderByType()}
    </Sidebar>
  )
}

export default NodePropertiesPanel



