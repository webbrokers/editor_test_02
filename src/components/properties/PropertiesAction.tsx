import type { ActionNodeData } from '../../types/nodes'

type Props = {
    data: ActionNodeData
    onChange: (data: ActionNodeData) => void
}

export function PropertiesAction({ data, onChange }: Props) {
    return (
        <div className="stack">
            <div className="field">
                <label>Тип действия</label>
                <input
                    className="input"
                    value={data.actionType ?? ''}
                    onChange={(e) => onChange({ ...data, actionType: e.target.value })}
                />
            </div>
            <div className="field">
                <label>Payload / тело</label>
                <textarea
                    className="input input--textarea"
                    rows={4}
                    value={data.payload ?? ''}
                    onChange={(e) => onChange({ ...data, payload: e.target.value })}
                />
            </div>
        </div>
    )
}
