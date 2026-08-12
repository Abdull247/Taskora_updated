import { Link, Navigate } from 'react-router-dom'
import { HiCheck, HiOutlineBell, HiOutlineEnvelope, HiOutlineRocketLaunch, HiOutlineUsers } from 'react-icons/hi2'
import { FaTelegramPlane, FaWhatsapp } from 'react-icons/fa'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { useSignupFlow } from '../../context/SignupFlowContext'
import '../WaitlistSuccess/WaitlistSuccessPage.css'

const TELEGRAM_URL = 'https://t.me/+Oyl3Hlt2wXdkOTFk'
const WHATSAPP_URL = 'https://chat.whatsapp.com/CZMTBeQmnG51DHuNTsLzTV'

const steps = [
  {
    icon: HiOutlineEnvelope,
    title: "We'll keep you updated",
    description: 'Important updates and product news will be sent straight to your inbox.',
  },
  {
    icon: HiOutlineRocketLaunch,
    title: 'Start exploring',
    description: 'Your dashboard is ready — jump in and see what TaskBridge has for you.',
  },
  {
    icon: HiOutlineUsers,
    title: 'Help shape TaskBridge',
    description: 'Share feedback and help us build the best platform for you.',
  },
]

function SignupDoneStep() {
  const { data } = useSignupFlow()

  // Guard against direct/refresh navigation without having actually completed signup.
  if (!data.emailVerified) {
    return <Navigate to="/signup" replace />
  }

  return (
    <section className="success-page">
      <Navbar />

      <main className="success-container">
        {/* Success animation */}
        <div className="success-animation">
          <span className="spark spark-1" />
          <span className="spark spark-2" />
          <span className="spark spark-3" />
          <span className="spark spark-4" />

          <div className="success-circle">
            <HiCheck className="check-icon" />
          </div>
        </div>

        {/* Headings */}
        <div className="headings">
          <h1>
            Welcome to <span className="blue-txt">TaskBridge</span>!
          </h1>
          <p className="success-description">
            {data.firstName ? `You're all set, ${data.firstName}. ` : "You're all set. "}
            Your account is ready to go.
          </p>
        </div>

        {/* Community card */}
        <div className="telegram-card">
          <div className="telegram-header">
            <div className="icon-circle">
              <HiOutlineBell />
            </div>

            <div className="telegram-content">
              <h3>Stay updated</h3>
              <p>Join our community channels to get updates, sneak peeks and product news.</p>
            </div>
          </div>

          <div className="channel-buttons">
            <button
              type="button"
              className="telegram-button"
              onClick={() => window.open(TELEGRAM_URL, '_blank', 'noopener,noreferrer')}
            >
              <FaTelegramPlane className="telegram-icon" />
              <span>Join our Telegram</span>
            </button>

            <button
              type="button"
              className="whatsapp-button"
              onClick={() => window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer')}
            >
              <FaWhatsapp className="telegram-icon" />
              <span>Join our WhatsApp</span>
            </button>
          </div>
        </div>

        {/* What happens next */}
        <div className="steps">
          <h1>What happens next?</h1>

          {steps.map((step) => (
            <div className="step" key={step.title}>
              <div className="step-icon">
                <step.icon />
              </div>

              <div className="step-content">
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <Link to="/dashboard" className="back-home">
          Open Dashboard
        </Link>
      </main>

      <Footer />
    </section>
  )
}

export default SignupDoneStep
