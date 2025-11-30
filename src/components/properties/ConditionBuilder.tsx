import type { Condition } from '../../types/nodes'

type Props = {
    conditions: Condition[]
    onChange: (conditions: Condition[]) => void
    addLabel?: string
}

const conditionOperators = ['equals', 'contains', 'starts_with', 'gt', 'lt', 'exists']

export function ConditionBuilder({ conditions, onChange, addLabel = 'Добавить условие' }: Props) {
    const safeConditions = Array.isArray(conditions) ? conditions : []

    return (
        <div className="stack" data-section="conditions">
            <div className="stack__items">
                {safeConditions.map((condition, index) => (
                    <div key={`${condition.field}-${index}`} className="field-row">
                        <input
                            className="input"
                            placeholder="Поле"
                            value={condition.field}
                            onChange={(e) => {
                                const next = [...safeConditions]
                                next[index] = { ...condition, field: e.target.value }
                                onChange(next)
                            }}
                        />
                        <select
                            className="input"
                            value={condition.operator}
                            onChange={(e) => {
                                const next = [...safeConditions]
                                next[index] = { ...condition, operator: e.target.value }
                                onChange(next)
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
                            onChange={(e) => {
                                const next = [...safeConditions]
                                next[index] = { ...condition, value: e.target.value }
                                onChange(next)
                            }}
                        />
                        <button
                            type="button"
                            className="icon-button"
                            onClick={() => onChange(safeConditions.filter((_, idx) => idx !== index))}
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
                onClick={() => onChange([...safeConditions, { field: '', operator: 'equals', value: '' }])}
            >
                {addLabel}
            </button>
        </div>
    )
}
