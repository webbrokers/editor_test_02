import './Toolbar.css'

type ToolbarAction = {
  label: string
  title: string
}

const actions: ToolbarAction[] = [
  { label: 'New Node', title: 'Добавить новую ноду' },
  { label: 'Save', title: 'Сохранить кампанию' },
  { label: 'Load', title: 'Загрузить кампанию' },
  { label: 'Export JSON', title: 'Экспорт в JSON' },
]

function Toolbar() {
  return (
    <header className="toolbar">
      <div className="brand">
        <span className="brand-accent" aria-hidden>
          ●
        </span>
        <span className="brand-title">Campaign Studio</span>
      </div>
      <nav className="toolbar-actions" aria-label="Основные действия">
        {actions.map((action) => (
          <button key={action.label} className="toolbar-button" type="button" title={action.title}>
            {action.label}
          </button>
        ))}
      </nav>
    </header>
  )
}

export default Toolbar
