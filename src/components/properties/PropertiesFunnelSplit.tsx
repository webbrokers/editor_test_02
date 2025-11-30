import type { FunnelSplitData } from '../../types/nodes'

type Props = {
    data: FunnelSplitData
    onChange: (data: FunnelSplitData) => void
}

export function PropertiesFunnelSplit({ data, onChange }: Props) {
    const branches = Array.isArray(data.branches) ? data.branches : []

    const updateBranches = (nextBranches: FunnelSplitData['branches']) => {
        onChange({ ...data, branches: nextBranches })
    }

    return (
        <div className="stack">
            <div className="field">
                <label>Атрибут разветвления</label>
                <input
                    className="input"
                    value={data.attribute ?? ''}
                    onChange={(e) => onChange({ ...data, attribute: e.target.value })}
                />
            </div>
            <div className="field">
                <label>Ветки</label>
                <div className="stack">
                    {branches.map((branch, index) => (
                        <div key={branch.id || index} className="stack stack--border">
                            <div className="field">
                                <label>ID ветки</label>
                                <input
                                    className="input"
                                    value={branch.id}
                                    onChange={(e) => {
                                        const next = [...branches]
                                        next[index] = { ...branch, id: e.target.value }
                                        updateBranches(next)
                                    }}
                                />
                            </div>
                            <div className="field">
                                <label>Название</label>
                                <input
                                    className="input"
                                    value={branch.label}
                                    onChange={(e) => {
                                        const next = [...branches]
                                        next[index] = { ...branch, label: e.target.value }
                                        updateBranches(next)
                                    }}
                                />
                            </div>
                            <div className="field">
                                <label>Условие</label>
                                <input
                                    className="input"
                                    value={branch.condition}
                                    onChange={(e) => {
                                        const next = [...branches]
                                        next[index] = { ...branch, condition: e.target.value }
                                        updateBranches(next)
                                    }}
                                />
                            </div>
                            <button
                                type="button"
                                className="ghost-button ghost-button--danger"
                                onClick={() => updateBranches(branches.filter((_, idx) => idx !== index))}
                            >
                                Удалить ветку
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="ghost-button"
                        onClick={() =>
                            updateBranches([
                                ...branches,
                                { id: `branch-${branches.length + 1}`, label: `Ветка ${branches.length + 1}`, condition: '' },
                            ])
                        }
                    >
                        Добавить ветку
                    </button>
                </div>
            </div>
        </div>
    )
}
