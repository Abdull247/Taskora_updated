import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { HiOutlineFaceFrown } from 'react-icons/hi2'
import './NotFoundPage.css'

function NotFoundPage() {
  const cardRef = useScrollReveal<HTMLDivElement>({ threshold: 0 })

  return (
    <div className="not-found-page">
      <Navbar />

      <main className="not-found-main">
        <div ref={cardRef} className="not-found-card reveal reveal-up-scale">
          <div className="not-found-icon">
            <HiOutlineFaceFrown />
          </div>
          <span className="not-found-code">404</span>
          <h1>Page not found</h1>
          <p>The page you're looking for doesn't exist or may have moved.</p>
          <Link to="/" className="btn btn-primary btn-block">
            Back to Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default NotFoundPage
