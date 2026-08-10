import { Link } from 'react-router-dom'
import { HiOutlineEnvelope } from 'react-icons/hi2'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand-block">
            <div className="footer-logo-row">
              <img src="/logo.png" alt="TaskBridge logo" className="footer-logo-icon" />
              <span className="footer-logo">TaskBridge</span>
            </div>
            <p className="footer-tagline">Get things done. Get rewarded.</p>
          </div>

          <div className="footer-links-grid">
            <div className="footer-links-col">
              <span className="footer-links-heading">Platform</span>
              <a href="/waitlist#how-it-works">How It Works</a>
              <Link to="/waitlist/for-taskers">For Taskers</Link>
              <Link to="/waitlist/for-advertisers">For Advertisers</Link>
            </div>
            <div className="footer-links-col">
              <span className="footer-links-heading">Company</span>
              <a href="/terms">Terms of Service</a>
              <a href="/privacy">Privacy Policy</a>
              <a href="mailto:hello@taskbridge.dev">Contact Us</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">© 2026 TaskBridge Inc. All rights reserved.</p>
          <a href="mailto:hello@taskbridge.dev" className="footer-email">
            <HiOutlineEnvelope /> hello@taskbridge.dev
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
