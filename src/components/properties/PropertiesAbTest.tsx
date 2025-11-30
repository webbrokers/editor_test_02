import type { ChangeEvent } from 'react'
import type { AbTestData } from '../../types/nodes'

type Props = {
    data: AbTestData
    onChange: (data: AbTestData) => void
}

export function PropertiesAbTest({ data, onChange }: Props) {
    const splitA = Math.min(100, Math.max(0, Number(data.splitA ?? 50)))
    const splitB = 100 - splitA

    return (
        <div className="stack">
            <div className="field">
                <label>Название теста</label>
                <input
                    className="input"
                    value={data.title ?? ''}
                    onChange={(e) => onChange({ ...data, title: e.target.value })}
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
                        value={splitA}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            onChange({ ...data, splitA: Number(e.target.value) })
                        }
                    />
                    <div className="slider-row__values">
                        <span>A: {splitA}%</span>
                        <span>B: {splitB}%</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
