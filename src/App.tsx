import CanvasArea from './components/CanvasArea'
import Sidebar from './components/Sidebar'
import Toolbar from './components/Toolbar'
import './styles/layout.css'

function App() {
  return (
    <div className="app">
      <Toolbar />
      <main className="workspace">
        <Sidebar title="Панель элементов">
          <p>Добавляйте новые ноды, определяйте типы событий и создавайте ветки сценария.</p>
          <div className="info-card">
            <div className="section-title">Быстрый старт</div>
            <ul>
              <li>Выберите тип ноды и перетащите её на канвас.</li>
              <li>Соедините ноды связями для построения логики.</li>
              <li>Настройте параметры и сохраните кампанию.</li>
            </ul>
          </div>
        </Sidebar>

        <CanvasArea />

        <Sidebar title="Свойства нод">
          <div className="placeholder">Выберите ноду, чтобы отредактировать параметры.</div>
        </Sidebar>
      </main>
    </div>
  )
}

export default App
