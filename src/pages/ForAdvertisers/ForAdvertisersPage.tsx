import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { SEO } from '../../components/SEO/SEO'
import {
  HiOutlineClipboardDocumentList,
  HiOutlineCurrencyDollar,
  HiOutlineDocumentText,
  HiOutlineClipboardDocumentCheck,
} from 'react-icons/hi2'
import '../Waitlist/WaitlistPage.css'
import '../ForTaskers/ForTaskersPage.css'

function ForAdvertisersPage() {
  const heroRef = useScrollReveal<HTMLDivElement>({ threshold: 0 })
  const step1Ref = useScrollReveal<HTMLDivElement>()
  const step2Ref = useScrollReveal<HTMLDivElement>()
  const step3Ref = useScrollReveal<HTMLDivElement>()
  const step4Ref = useScrollReveal<HTMLDivElement>()
  const ctaRef = useScrollReveal<HTMLDivElement>()

  return (
    <div className="waitlist-page">
      <SEO
        title="Get Tasks Done Efficiently with TaskBridge: For Advertisers"
        description="Need help with local or digital tasks? TaskBridge connects you with qualified Taskers ready to get your work done. Join now to start creating tasks."
      />
      <Navbar />

      <main>
        <section className="hero">
          <div className="hero-container hero-container-single">
            <div ref={heroRef} className="hero-copy reveal reveal-up">
              <span className="hero-badge">For Advertisers</span>
              <h1 className="hero-title">
                Need something done? <span className="hero-title-accent">Put it in front of the right people.</span>
              </h1>
              <p className="hero-description">
                Create a task, define what you need, set your reward and let Taskora connect
                you with people ready to get it done.
              </p>
              <div className="hero-actions">
                <Link to="/signup?role=advertiser" className="btn btn-primary btn-block">
                  Join as an Advertiser
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="advertiser-flow">
          <div className="section-container">
            <div className="section-heading">
              <h2>Turn things you need done into simple tasks.</h2>
              <p>
                From getting local help to collecting information or completing digital work,
                Taskora helps you turn real-world needs into clear, actionable tasks.
              </p>
            </div>

            <div className="steps-stack steps-stack-4">
              <div ref={step1Ref} className="step-card reveal reveal-left">
                <div className="step-icon">
                  <HiOutlineClipboardDocumentList />
                </div>
                <span className="step-label">01</span>
                <h3>Create a Task</h3>
                <p>Describe what needs to be done, add instructions and define who you're looking for.</p>
              </div>

              <div ref={step2Ref} className="step-card reveal reveal-up reveal-delay-1">
                <div className="step-icon">
                  <HiOutlineCurrencyDollar />
                </div>
                <span className="step-label">02</span>
                <h3>Set the Reward</h3>
                <p>Choose a reward and provide the details Taskers need before they get started.</p>
              </div>

              <div ref={step3Ref} className="step-card reveal reveal-up reveal-delay-2">
                <div className="step-icon">
                  <HiOutlineDocumentText />
                </div>
                <span className="step-label">03</span>
                <h3>Get Submissions</h3>
                <p>People interested in your task complete the work and submit their results.</p>
              </div>

              <div ref={step4Ref} className="step-card reveal reveal-right reveal-delay-3">
                <div className="step-icon">
                  <HiOutlineClipboardDocumentCheck />
                </div>
                <span className="step-label">04</span>
                <h3>Review &amp; Approve</h3>
                <p>Review submissions and approve completed work that meets your requirements.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="final-cta">
          <div ref={ctaRef} className="final-cta-container reveal reveal-up-scale">
            <h2>Ready to get things done?</h2>
            <p>Join the waitlist and be first in line when Taskora opens up to Advertisers.</p>
            <Link to="/signup?role=advertiser" className="btn btn-light btn-block">
              Join as an Advertiser
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default ForAdvertisersPage
