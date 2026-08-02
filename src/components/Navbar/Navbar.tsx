import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <header className="navbar">
      <nav className="navbar-container">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="Taskora logo" className="logo-icon" />
          <span>Taskora</span>
        </Link>
      </nav>
    </header>
  )
}

export default Navbar
