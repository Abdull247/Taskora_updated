import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { HiOutlineClock } from 'react-icons/hi2'
import './ComingSoonPage.css'

interface ComingSoonPageProps {
  title?: string
  description?: string
}

function ComingSoonPage({
  title = 'Coming Soon',
  description = "We're still building this part of Taskora. Check back soon — or join the waitlist to be first in line.",
}: ComingSoonPageProps) {
  const cardRef = useScrollReveal<HTMLDivElement>({ threshold: 0 })

  return (
    <div className="coming-soon-page">
      <Navbar />

      <main className="coming-soon-main">
        <div ref={cardRef} className="coming-soon-card reveal reveal-up-scale">
          <div className="coming-soon-icon">
            <HiOutlineClock />
          </div>
          <span className="coming-soon-badge">In Progress</span>
          <h1>{title}</h1>
          <p>{description}</p>
          <div className="coming-soon-actions">
            <Link to="/signup" className="btn btn-primary btn-block">
              Join the Waitlist
            </Link>
            <Link to="/" className="btn btn-tint btn-block">
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ComingSoonPage
