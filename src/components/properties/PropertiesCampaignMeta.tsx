import type { CampaignMetaData } from '../../types/nodes'

type Props = {
    data: CampaignMetaData
    onChange: (data: CampaignMetaData) => void
}

export function PropertiesCampaignMeta({ data, onChange }: Props) {
    const handleChange = (field: keyof CampaignMetaData, value: string | number) => {
        onChange({ ...data, [field]: value })
    }

    return (
        <div className="stack">
            <div className="field">
                <label>ID кампании</label>
                <input
                    className="input"
                    value={data.campaignId ?? ''}
                    onChange={(e) => handleChange('campaignId', e.target.value)}
                />
            </div>
            <div className="field">
                <label>Бюджет</label>
                <input
                    className="input"
                    type="number"
                    min={0}
                    value={data.budget ?? 0}
                    onChange={(e) => handleChange('budget', Number(e.target.value))}
                />
            </div>
            <div className="field-row">
                <div className="field">
                    <label>Старт</label>
                    <input
                        className="input"
                        type="date"
                        value={data.startDate ?? ''}
                        onChange={(e) => handleChange('startDate', e.target.value)}
                    />
                </div>
                <div className="field">
                    <label>Финиш</label>
                    <input
                        className="input"
                        type="date"
                        value={data.endDate ?? ''}
                        onChange={(e) => handleChange('endDate', e.target.value)}
                    />
                </div>
            </div>
        </div>
    )
}
