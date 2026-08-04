import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  HiBars3,
  HiXMark,
  HiOutlineHome,
  HiOutlineQuestionMarkCircle,
  HiOutlineMagnifyingGlass,
  HiOutlineMegaphone,
  HiChevronRight,
} from 'react-icons/hi2'
import './Navbar.css'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header className="navbar">
        <nav className="navbar-container">
          <Link to="/" className="logo">
            <img src="/logo.png" alt="Taskora logo" className="logo-icon" />
            <span>TaskBridge</span>
          </Link>

          <div className="nav-menu-desktop">
            <a href="/waitlist#how-it-works">How It Works</a>
            <Link to="/waitlist/for-taskers">For Taskers</Link>
            <Link to="/waitlist/for-advertisers">For Advertisers</Link>
            <a href="/waitlist#faq">FAQ</a>
          </div>

          <button
            className="hamburger"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <HiBars3 />
          </button>
        </nav>
      </header>

      {/* Overlay */}
      <div
        className={`nav-overlay ${menuOpen ? 'nav-overlay-open' : ''}`}
        onClick={closeMenu}
      />

      {/* Slide-in drawer */}
      <aside className={`nav-drawer ${menuOpen ? 'nav-drawer-open' : ''}`}>
        <div className="nav-drawer-header">
          <Link to="/" className="logo" onClick={closeMenu}>
            <img src="/logo.png" alt="Taskora logo" className="logo-icon" />
            <span>Taskora</span>
          </Link>
          <button
            className="nav-drawer-close"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <HiXMark />
          </button>
        </div>

        <nav className="nav-drawer-links">
          <a href="/waitlist#how-it-works" onClick={closeMenu} className="nav-drawer-link">
            <span className="nav-drawer-link-icon">
              <HiOutlineHome />
            </span>
            <span className="nav-drawer-link-text">How It Works</span>
            <HiChevronRight className="nav-drawer-link-arrow" />
          </a>

          <Link to="/waitlist/for-taskers" onClick={closeMenu} className="nav-drawer-link">
            <span className="nav-drawer-link-icon">
              <HiOutlineMagnifyingGlass />
            </span>
            <span className="nav-drawer-link-text">For Taskers</span>
            <HiChevronRight className="nav-drawer-link-arrow" />
          </Link>

          <Link to="/waitlist/for-advertisers" onClick={closeMenu} className="nav-drawer-link">
            <span className="nav-drawer-link-icon">
              <HiOutlineMegaphone />
            </span>
            <span className="nav-drawer-link-text">For Advertisers</span>
            <HiChevronRight className="nav-drawer-link-arrow" />
          </Link>

          <a href="/waitlist#faq" onClick={closeMenu} className="nav-drawer-link">
            <span className="nav-drawer-link-icon">
              <HiOutlineQuestionMarkCircle />
            </span>
            <span className="nav-drawer-link-text">FAQ</span>
            <HiChevronRight className="nav-drawer-link-arrow" />
          </a>
        </nav>
      </aside>
    </>
  )
}

export default Navbar
