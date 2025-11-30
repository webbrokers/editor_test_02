import type { CampaignTypeData } from '../../types/nodes'

type Props = {
    data: CampaignTypeData
    onChange: (data: CampaignTypeData) => void
}

const placementTypes = [
    { value: 'email', label: 'Email' },
    { value: 'push', label: 'Push' },
    { value: 'sms', label: 'SMS' },
    { value: 'inapp', label: 'In-App' },
]

export function PropertiesCampaignType({ data, onChange }: Props) {
    const placementOptions = Array.isArray(data.placementOptions) ? data.placementOptions : []

    const updateOptions = (nextOptions: { key: string; value: string }[]) => {
        onChange({ ...data, placementOptions: nextOptions })
    }

    return (
        <div className="stack">
            <div className="field">
                <label>Тип размещения</label>
                <select
                    className="input"
                    value={data.placementType ?? 'email'}
                    onChange={(e) => onChange({ ...data, placementType: e.target.value })}
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
                <div className="stack">
                    {placementOptions.map((option, index) => (
                        <div key={`${option.key}-${index}`} className="field-row field-row--placement">
                            <input
                                className="input"
                                placeholder="Ключ"
                                value={option.key}
                                onChange={(e) => {
                                    const next = [...placementOptions]
                                    next[index] = { ...option, key: e.target.value }
                                    updateOptions(next)
                                }}
                            />
                            <input
                                className="input"
                                placeholder="Значение"
                                value={option.value}
                                onChange={(e) => {
                                    const next = [...placementOptions]
                                    next[index] = { ...option, value: e.target.value }
                                    updateOptions(next)
                                }}
                            />
                            <button
                                type="button"
                                className="icon-button"
                                onClick={() => updateOptions(placementOptions.filter((_, idx) => idx !== index))}
                                aria-label="Удалить опцию"
                            >
                                x
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="ghost-button"
                        onClick={() => updateOptions([...placementOptions, { key: '', value: '' }])}
                    >
                        Добавить настройку
                    </button>
                </div>
            </div>
        </div>
    )
}
