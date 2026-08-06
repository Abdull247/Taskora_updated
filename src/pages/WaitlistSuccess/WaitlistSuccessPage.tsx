import { Link, Navigate, useLocation } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import {
  HiCheck,
  HiOutlineBell,
  HiOutlinePaperAirplane,
  HiOutlineEnvelope,
  HiOutlineRocketLaunch,
  HiOutlineUsers,
} from 'react-icons/hi2'
import './WaitlistSuccessPage.css'

const TELEGRAM_URL = 'https://t.me/+Oyl3Hlt2wXdkOTFk'
const WHATSAPP_URL = 'https://chat.whatsapp.com/CZMTBeQmnG51DHuNTsLzTV'

interface LocationState {
  waitlistJoined?: boolean
  firstName?: string
}

function WaitlistSuccessPage() {
  const location = useLocation()
  const state = (location.state as LocationState) || {}

  const badgeRef = useScrollReveal<HTMLDivElement>({ threshold: 0 })
  const titleRef = useScrollReveal<HTMLDivElement>({ threshold: 0 })
  const updatesRef = useScrollReveal<HTMLDivElement>({ threshold: 0 })
  const nextRef = useScrollReveal<HTMLDivElement>({ threshold: 0 })
  const homeRef = useScrollReveal<HTMLDivElement>({ threshold: 0 })

  // Guard against direct/refresh navigation without having actually joined
  if (!state.waitlistJoined) {
    return <Navigate to="/signup" replace />
  }

  return (
    <div className="waitlist-success-page">
      <Navbar />

      <main className="waitlist-success-main">
        <div className="waitlist-success-container">
          <div ref={badgeRef} className="success-badge-wrap reveal reveal-scale">
            <span className="success-badge-dot success-badge-dot-1" />
            <span className="success-badge-dot success-badge-dot-2" />
            <span className="success-badge-dot success-badge-dot-3" />
            <span className="success-badge-diamond success-badge-diamond-1" />
            <span className="success-badge-diamond success-badge-diamond-2" />
            <span className="success-badge-ring">
              <span className="success-badge-circle">
                <HiCheck />
              </span>
            </span>
          </div>

          <div ref={titleRef} className="success-title-wrap reveal reveal-up reveal-delay-1">
            <h1>
              Successfully joined the <span className="success-title-accent">waitlist</span>!
            </h1>
            <p>
              {state.firstName ? `Thanks, ${state.firstName}! ` : 'Thanks for joining TaskBridge. '}
              You'll be the first to know when we launch.
            </p>
          </div>

          <div ref={updatesRef} className="success-updates-card reveal reveal-up reveal-delay-2">
            <div className="success-updates-icon">
              <HiOutlineBell />
            </div>
            <h3>Stay updated</h3>
            <p>
              Join our community channels to get the latest updates, sneak peeks, and be part
              of the journey.
            </p>

            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="success-channel-btn success-channel-btn-telegram"
            >
              <HiOutlinePaperAirplane className="success-channel-btn-icon" />
              Join our Telegram
            </a>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="success-channel-btn success-channel-btn-whatsapp"
            >
              <svg
                className="success-channel-btn-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12.001 2C6.478 2 2 6.478 2 12c0 1.802.474 3.55 1.373 5.084L2.05 21.95l4.951-1.298A9.953 9.953 0 0 0 12.001 22C17.523 22 22 17.522 22 12S17.523 2 12.001 2zm0 18.145a8.09 8.09 0 0 1-4.126-1.128l-.296-.176-3.116.817.833-3.037-.193-.312A8.09 8.09 0 0 1 3.855 12c0-4.494 3.653-8.146 8.146-8.146S20.147 7.506 20.147 12s-3.653 8.145-8.146 8.145z" />
              </svg>
              Join our WhatsApp
            </a>
          </div>

          <div ref={nextRef} className="success-next-section reveal reveal-up reveal-delay-3">
            <h3 className="success-next-heading">What happens next?</h3>

            <div className="success-next-row">
              <div className="success-next-icon">
                <HiOutlineEnvelope />
              </div>
              <div>
                <h4>We'll keep you updated</h4>
                <p>Important updates and launch news will be sent straight to your inbox.</p>
              </div>
            </div>

            <div className="success-next-row">
              <div className="success-next-icon">
                <HiOutlineRocketLaunch />
              </div>
              <div>
                <h4>Be the first to access</h4>
                <p>Get early access to TaskBridge before anyone else.</p>
              </div>
            </div>

            <div className="success-next-row">
              <div className="success-next-icon">
                <HiOutlineUsers />
              </div>
              <div>
                <h4>Help shape TaskBridge</h4>
                <p>Share feedback and help us build the best platform for you.</p>
              </div>
            </div>
          </div>

          <div ref={homeRef} className="reveal reveal-up reveal-delay-4">
            <Link to="/" className="success-home-btn">
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default WaitlistSuccessPage
