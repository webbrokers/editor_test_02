import type { FilterNodeData } from '../../types/nodes'
import { ConditionBuilder } from './ConditionBuilder'

type Props = {
    data: FilterNodeData
    onChange: (data: FilterNodeData) => void
}

export function PropertiesFilter({ data, onChange }: Props) {
    return (
        <div className="stack">
            <label>Условия фильтрации</label>
            <ConditionBuilder
                conditions={data.conditions}
                onChange={(conditions) => onChange({ ...data, conditions })}
            />
        </div>
    )
}
