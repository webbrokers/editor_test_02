import './CanvasArea.css'

function CanvasArea() {
  return (
    <section className="canvas-area">
      <div className="canvas-surface">
        <div className="canvas-grid" aria-hidden />
        <div className="canvas-placeholder">
          Поле для визуального редактора сценариев
          <span className="canvas-subtitle">Используйте React Flow для работы с нодами и связями</span>
        </div>
      </div>
    </section>
  )
}

export default CanvasArea
