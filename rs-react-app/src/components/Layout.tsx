import { NavLink, Outlet } from 'react-router-dom'
import { Flyout } from './Flyout'
import { useTheme } from '../context/useTheme'
import './Layout.css'

export function Layout() {
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      <header className="app-header">
        <div className="app-header-inner">
          <NavLink to="/" className="app-logo" end>
            <span className="app-logo-icon">🌀</span>
            <span className="app-logo-text">Rick &amp; Morty</span>
          </NavLink>
          <nav className="app-nav">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Home
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              About
            </NavLink>
            <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </nav>
        </div>
      </header>
      <Outlet />
      <Flyout />
    </>
  )
}
