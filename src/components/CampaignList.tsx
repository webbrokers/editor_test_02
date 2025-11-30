import type { CampaignFlow } from '../types/flow'
import './CampaignList.css'

type CampaignListProps = {
  campaigns: CampaignFlow[]
  onOpen: (id: string) => void
  onDelete: (id: string) => void
  onRename: (id: string, name: string) => void
  onCreate: () => void
}

const fallbackRows: CampaignFlow[] = [
  { id: 'cmp-demo-01', name: 'Приветствие новых клиентов', nodes: [], edges: [] },
  { id: 'cmp-demo-02', name: 'Повторный заказ', nodes: [], edges: [] },
  { id: 'cmp-demo-03', name: 'Брошенная корзина', nodes: [], edges: [] },
]

function CampaignList({ campaigns, onOpen, onDelete, onRename, onCreate }: CampaignListProps) {
  const rows = campaigns.length ? campaigns : fallbackRows

  const handleRename = (id: string, currentName: string) => {
    const next = window.prompt('Новое имя кампании', currentName)
    if (!next) return
    onRename(id, next)
  }

  return (
    <section className="campaigns-card">
      <header className="campaigns-card__header">
        <div>
          <div className="campaigns-card__eyebrow">Рекламные кампании</div>
          <h2 className="campaigns-card__title">Список кампаний</h2>
        </div>
        <div className="campaigns-card__actions">
          <button className="ghost" type="button">
            Импорт
          </button>
          <button className="ghost" type="button">
            Экспорт
          </button>
          <button className="primary" type="button" onClick={onCreate}>
            Создать кампанию
          </button>
        </div>
      </header>

      <div className="campaigns-toolbar">
        <button className="link-button" type="button">
          Добавить фильтры
        </button>
        <button className="link-button" type="button">
          ИЛИ
        </button>
      </div>

      <div className="campaigns-table">
        <div className="campaigns-table__head">
          <div>Действие</div>
          <div>Название</div>
          <div>Последнее сохранение</div>
          <div className="text-right">Действия</div>
        </div>
        <div className="campaigns-table__body">
          {rows.map((campaign) => (
            <div key={campaign.id} className="campaigns-table__row">
              <div className="campaigns-table__cell">
                <span className="pill pill--green">Активно</span>
              </div>
              <div className="campaigns-table__cell">
                <div className="campaigns-table__name">{campaign.name}</div>
                <div className="campaigns-table__meta">{campaign.id}</div>
              </div>
              <div className="campaigns-table__cell">
                <div className="campaigns-table__meta">Сегодня · 14:15</div>
              </div>
              <div className="campaigns-table__cell campaigns-table__cell--actions">
                <button className="link-button" type="button" onClick={() => onOpen(campaign.id)}>
                  Открыть
                </button>
                <button className="link-button" type="button" onClick={() => handleRename(campaign.id, campaign.name)}>
                  Переименовать
                </button>
                <button className="link-button link-button--danger" type="button" onClick={() => onDelete(campaign.id)}>
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="campaigns-footer">
        <span>По 50 на странице</span>
        <button className="link-button" type="button">
          Показать больше
        </button>
      </footer>
    </section>
  )
}

export default CampaignList
