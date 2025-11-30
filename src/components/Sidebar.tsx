import './Sidebar.css'
import type { ReactNode } from 'react'

type SidebarProps = {
  title: string
  children?: ReactNode
}

function Sidebar({ title, children }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>{title}</h2>
      </div>
      <div className="sidebar-content">{children}</div>
    </aside>
  )
}

export default Sidebar
