import type { LlmTextNodeData } from '../../types/nodes'

type Props = {
    data: LlmTextNodeData
    onChange: (data: LlmTextNodeData) => void
}

const clampNumber = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const safeNumber = (value: number, fallback: number) => (Number.isFinite(value) ? value : fallback)

export function PropertiesLlmText({ data, onChange }: Props) {
    const variables = Array.isArray(data.variables) ? data.variables : []

    const updateField = (field: keyof LlmTextNodeData, value: LlmTextNodeData[keyof LlmTextNodeData]) => {
        onChange({ ...data, [field]: value })
    }

    const updateVariables = (nextVariables: string[]) => {
        updateField('variables', nextVariables)
    }

    return (
        <div className="stack">
            <div className="field">
                <label>Название</label>
                <input
                    className="input"
                    value={data.title ?? ''}
                    onChange={(e) => updateField('title', e.target.value)}
                />
            </div>
            <div className="field">
                <label>Промпт</label>
                <textarea
                    className="input input--textarea"
                    rows={4}
                    value={data.prompt ?? ''}
                    onChange={(e) => updateField('prompt', e.target.value)}
                />
            </div>
            <div className="field-row">
                <div className="field">
                    <label>Режим</label>
                    <select
                        className="input"
                        value={data.mode === 'transform' ? 'transform' : 'generate'}
                        onChange={(e) => updateField('mode', e.target.value)}
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
                        value={data.model ?? 'gpt-4.1'}
                        onChange={(e) => updateField('model', e.target.value)}
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
                        value={data.temperature ?? 0.7}
                        onChange={(e) =>
                            updateField(
                                'temperature',
                                clampNumber(safeNumber(Number(e.target.value), 0.7), 0, 1.5),
                            )
                        }
                    />
                </div>
                <div className="field">
                    <label>Максимум токенов</label>
                    <input
                        className="input"
                        type="number"
                        min="1"
                        value={data.maxTokens ?? 512}
                        onChange={(e) =>
                            updateField('maxTokens', Math.max(1, safeNumber(Number(e.target.value), 512)))
                        }
                    />
                </div>
            </div>
            <div className="field">
                <label>Переменные</label>
                <div className="stack">
                    {variables.map((variable, index) => (
                        <div key={`${variable}-${index}`} className="field-row field-row--compact">
                            <input
                                className="input"
                                value={variable}
                                placeholder="Имя переменной"
                                onChange={(e) => {
                                    const next = [...variables]
                                    next[index] = e.target.value
                                    updateVariables(next)
                                }}
                            />
                            <button
                                type="button"
                                className="icon-button"
                                onClick={() => updateVariables(variables.filter((_, idx) => idx !== index))}
                                aria-label="Удалить переменную"
                            >
                                x
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="ghost-button"
                        onClick={() => updateVariables([...variables, ''])}
                    >
                        Добавить переменную
                    </button>
                </div>
            </div>
            <label className="checkbox">
                <input
                    type="checkbox"
                    checked={Boolean(data.autoReplaceInput)}
                    onChange={(e) => updateField('autoReplaceInput', e.target.checked)}
                />
                Автозамена плейсхолдеров
            </label>
        </div>
    )
}
