import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="navbar">
      <nav className="navbar-container">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="Taskora logo" className="logo-icon" />
          <span>Taskora</span>
        </Link>

        <div className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          <a href="/waitlist#how-it-works">How It Works</a>
          <Link to="/waitlist/for-taskers">For Taskers</Link>
          <Link to="/waitlist/for-advertisers">For Advertisers</Link>
          <a href="/waitlist#faq">FAQ</a>
        </div>

        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </nav>
    </header>
  )
}

export default Navbar
