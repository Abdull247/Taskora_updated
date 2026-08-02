import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import {
  HiOutlineMagnifyingGlass,
  HiOutlineCheckCircle,
  HiOutlineBanknotes,
} from 'react-icons/hi2'
import '../Waitlist/WaitlistPage.css'
import './ForTaskersPage.css'

function ForTaskersPage() {
  const heroRef = useScrollReveal<HTMLDivElement>({ threshold: 0 })
  const step1Ref = useScrollReveal<HTMLDivElement>()
  const step2Ref = useScrollReveal<HTMLDivElement>()
  const step3Ref = useScrollReveal<HTMLDivElement>()
  const ctaRef = useScrollReveal<HTMLDivElement>()

  return (
    <div className="waitlist-page">
      <Navbar />

      <main>
        <section className="hero">
          <div className="hero-container hero-container-single">
            <div ref={heroRef} className="hero-copy reveal reveal-up">
              <span className="hero-badge">For Taskers</span>
              <h1 className="hero-title">
                Find tasks. Do the work. <span className="hero-title-accent">Get rewarded.</span>
              </h1>
              <p className="hero-description">
                Discover tasks that match your skills, interests and location. Complete them,
                submit your work and earn rewards when your work is approved.
              </p>
              <div className="hero-actions">
                <Link to="/signup?role=worker" className="btn btn-primary btn-block">
                  Join as a Tasker
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="how-it-works">
          <div className="section-container">
            <div className="section-heading">
              <h2>How it works for Taskers</h2>
            </div>

            <div className="steps-stack">
              <div ref={step1Ref} className="step-card reveal reveal-left">
                <div className="step-icon">
                  <HiOutlineMagnifyingGlass />
                </div>
                <span className="step-label">STEP 01</span>
                <h3>Discover</h3>
                <p>Find tasks that match what you can do, from digital checks to local physical assistance.</p>
              </div>

              <div ref={step2Ref} className="step-card reveal reveal-up reveal-delay-1">
                <div className="step-icon">
                  <HiOutlineCheckCircle />
                </div>
                <span className="step-label">STEP 02</span>
                <h3>Complete</h3>
                <p>Follow clear instructions and submit your work directly through the app.</p>
              </div>

              <div ref={step3Ref} className="step-card reveal reveal-right reveal-delay-2">
                <div className="step-icon">
                  <HiOutlineBanknotes />
                </div>
                <span className="step-label">STEP 03</span>
                <h3>Get Rewarded</h3>
                <p>Earn your reward once your work is approved by the Advertiser.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="final-cta">
          <div ref={ctaRef} className="final-cta-container reveal reveal-up-scale">
            <h2>Ready to start earning?</h2>
            <p>Join the waitlist and be first in line when Taskora opens up to Taskers.</p>
            <Link to="/signup?role=worker" className="btn btn-light btn-block">
              Join as a Tasker
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default ForTaskersPage
