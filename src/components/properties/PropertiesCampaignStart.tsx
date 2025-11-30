import type { CampaignStartData } from '../../types/nodes'

type Props = {
    data: CampaignStartData
    onChange: (data: CampaignStartData) => void
}

export function PropertiesCampaignStart({ data, onChange }: Props) {
    const handleChange = (field: keyof CampaignStartData, value: string) => {
        onChange({ ...data, [field]: value })
    }

    return (
        <div className="stack">
            <div className="field">
                <label>Название</label>
                <input
                    className="input"
                    value={data.name ?? ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                />
            </div>
            <div className="field">
                <label>Описание</label>
                <textarea
                    className="input input--textarea"
                    rows={3}
                    value={data.description ?? ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                />
            </div>
            <div className="field">
                <label>Триггер</label>
                <input
                    className="input"
                    value={data.triggerType ?? 'immediate'}
                    onChange={(e) => handleChange('triggerType', e.target.value)}
                />
            </div>
        </div>
    )
}
