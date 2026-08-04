import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <span className="footer-logo">TaskBridge</span>
        </div>

        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
          <a href="#">Careers</a>
        </div>

        <p className="footer-copy">© 2026 TaskBridge Inc. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
