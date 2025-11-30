import type { AudienceSegmentData } from '../../types/nodes'
import { ConditionBuilder } from './ConditionBuilder'

type Props = {
    data: AudienceSegmentData
    onChange: (data: AudienceSegmentData) => void
}

export function PropertiesAudienceSegment({ data, onChange }: Props) {
    return (
        <div className="stack">
            <label>Условия сегмента</label>
            <ConditionBuilder
                conditions={data.conditions}
                onChange={(conditions) => onChange({ ...data, conditions })}
            />
        </div>
    )
}
