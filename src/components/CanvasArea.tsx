import './CanvasArea.css'

function CanvasArea() {
  return (
    <section className="canvas-area">
      <div className="canvas-surface">
        <div className="canvas-grid" aria-hidden />
        <div className="canvas-placeholder">
          This placeholder component was replaced by FlowCanvas that renders the React Flow surface.
          <span className="canvas-subtitle">FlowCanvas owns the grid and interactions; keep this file unused or remove it.</span>
        </div>
      </div>
    </section>
  )
}

export default CanvasArea
