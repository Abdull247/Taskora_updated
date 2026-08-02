import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import {
  HiOutlineMagnifyingGlass,
  HiOutlineCheckCircle,
  HiOutlineBanknotes,
  HiOutlineRocketLaunch,
  HiOutlineTag,
  HiOutlineUsers,
  HiOutlineShieldCheck,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineChartBar,
} from 'react-icons/hi2'
import './WaitlistPage.css'

function WaitlistPage() {
  const heroBadgeRef = useScrollReveal<HTMLSpanElement>({ threshold: 0 })
  const heroTitleRef = useScrollReveal<HTMLHeadingElement>({ threshold: 0 })
  const heroDescRef = useScrollReveal<HTMLParagraphElement>({ threshold: 0 })
  const heroActionsRef = useScrollReveal<HTMLDivElement>({ threshold: 0 })
  const heroImageRef = useScrollReveal<HTMLDivElement>({ threshold: 0.1 })

  const momentumRef = useScrollReveal<HTMLDivElement>()

  const howHeadingRef = useScrollReveal<HTMLDivElement>()
  const step1Ref = useScrollReveal<HTMLDivElement>()
  const step2Ref = useScrollReveal<HTMLDivElement>()
  const step3Ref = useScrollReveal<HTMLDivElement>()

  const whyHeadingRef = useScrollReveal<HTMLDivElement>()
  const feature1Ref = useScrollReveal<HTMLDivElement>()
  const feature2Ref = useScrollReveal<HTMLDivElement>()
  const feature3Ref = useScrollReveal<HTMLDivElement>()
  const feature4Ref = useScrollReveal<HTMLDivElement>()

  const previewCopyRef = useScrollReveal<HTMLDivElement>()
  const previewImageRef = useScrollReveal<HTMLDivElement>()

  const ctaRef = useScrollReveal<HTMLDivElement>()

  return (
    <div className="waitlist-page">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-container">
            <div className="hero-copy">
              <span ref={heroBadgeRef} className="hero-badge reveal reveal-up-scale">
                Coming Early 2026
              </span>
              <h1 ref={heroTitleRef} className="hero-title reveal reveal-fade-blur reveal-delay-1">
                Get things done.
                <br />
                Get <span className="hero-title-accent">rewarded.</span>
              </h1>
              <p
                ref={heroDescRef}
                className="hero-description reveal reveal-up reveal-delay-2"
              >
                Taskora connects people with useful tasks and opportunities to earn rewards.
                Join the waitlist and be among the first to experience a simpler way to get
                things done.
              </p>
              <div
                ref={heroActionsRef}
                className="hero-actions reveal reveal-up reveal-delay-3"
              >
                <Link to="/signup" className="btn btn-primary btn-block">
                  Join the Waitlist
                </Link>
                <a href="#how-it-works" className="btn btn-tint btn-block">
                  How It Works
                </a>
              </div>
            </div>

            <div ref={heroImageRef} className="hero-image-wrap reveal reveal-scale reveal-delay-2">
              <div className="hero-image-frame">
                <img
                  className="hero-image"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaEDNUPnWUKJ71bQ9p2Hej_hk8BdQX43d1BsiFDP5WD3mgNRyR3uX-Du-KqlXMQst27fbMuURNbuNLm34bUvX89XIOJuJWz2hpSiikeI4XNt3FAxjjZKxE-461LPSuTFaRzh9POzJ7R7m1NQuMj416menB7zyMPgQZDHI_8AUXkoVcaHcwRMc_ZcmwiOyBTW4omN2-YcvLKHu0mUu3n0x4MtZNuaeChDGaM6I7VmzvUQ11zMaO8uWi"
                  alt="Taskora app dashboard mockup"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Waitlist Momentum */}
        <section className="momentum" id="waitlist">
          <div ref={momentumRef} className="momentum-container reveal reveal-up">
            <div className="momentum-avatars-row">
              <span className="momentum-avatars">
                <div className="avatar avatar-1"></div>
                <div className="avatar avatar-2"></div>
                <div className="avatar avatar-3"></div>
              </span>
              <p className="momentum-count">1,284 people are already waiting</p>
            </div>
            <p className="momentum-sub">
              Secure your spot for early beta access and exclusive rewards.
            </p>

            <Link to="/signup" className="btn btn-primary btn-block">
              Join Waitlist
            </Link>
          </div>
        </section>

        {/* How Taskora Works */}
        <section className="how-it-works" id="how-it-works">
          <div className="section-container">
            <div ref={howHeadingRef} className="section-heading reveal reveal-up">
              <h2>A simple process for real rewards</h2>
              <p>
                Getting started with Taskora is designed to be effortless. No complex
                onboarding, just clarity.
              </p>
            </div>

            <div className="steps-stack">
              <div ref={step1Ref} className="step-card reveal reveal-left">
                <div className="step-icon">
                  <HiOutlineMagnifyingGlass />
                </div>
                <span className="step-label">STEP 01</span>
                <h3>Discover</h3>
                <p>
                  Find tasks that match what you can do. From simple digital checks to local
                  physical assistance.
                </p>
              </div>

              <div ref={step2Ref} className="step-card reveal reveal-up reveal-delay-1">
                <div className="step-icon">
                  <HiOutlineCheckCircle />
                </div>
                <span className="step-label">STEP 02</span>
                <h3>Complete</h3>
                <p>
                  Follow clear instructions to get the task done and submit your work directly
                  through our intuitive interface.
                </p>
              </div>

              <div ref={step3Ref} className="step-card reveal reveal-right reveal-delay-2">
                <div className="step-icon">
                  <HiOutlineBanknotes />
                </div>
                <span className="step-label">STEP 03</span>
                <h3>Get Rewarded</h3>
                <p>
                  Earn your reward instantly when your work is approved. Transfer balance
                  easily to your preferred account.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Taskora */}
        <section className="why-taskora" id="why-taskora">
          <div className="section-container">
            <div ref={whyHeadingRef} className="section-heading reveal reveal-up">
              <h2>Why choose Taskora?</h2>
              <p>
                We're building the most reliable platform for the next generation of flexible
                earning.
              </p>
            </div>

            <div className="features-stack">
              <div ref={feature1Ref} className="feature-card reveal reveal-up-scale">
                <span className="feature-icon">
                  <HiOutlineRocketLaunch />
                </span>
                <h4>Find Opportunities</h4>
                <p>Access a curated feed of verified tasks relevant to your skills and location.</p>
              </div>
              <div
                ref={feature2Ref}
                className="feature-card reveal reveal-up-scale reveal-delay-1"
              >
                <span className="feature-icon">
                  <HiOutlineTag />
                </span>
                <h4>Earn Rewards</h4>
                <p>Get paid fairly and quickly. No hidden fees or complex point systems.</p>
              </div>
              <div
                ref={feature3Ref}
                className="feature-card reveal reveal-up-scale reveal-delay-2"
              >
                <span className="feature-icon">
                  <HiOutlineUsers />
                </span>
                <h4>Simple &amp; Accessible</h4>
                <p>An interface built for real people. No technical jargon, just momentum.</p>
              </div>
              <div
                ref={feature4Ref}
                className="feature-card reveal reveal-up-scale reveal-delay-3"
              >
                <span className="feature-icon">
                  <HiOutlineShieldCheck />
                </span>
                <h4>Built Around Trust</h4>
                <p>Secure payments and verified task providers ensure you're always protected.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Preview */}
        <section className="product-preview">
          <div className="section-container preview-container">
            <div ref={previewCopyRef} className="preview-copy reveal reveal-left">
              <h2>Designed for clarity and speed.</h2>
              <p>
                Take a look at how we've reimagined task management. The Taskora platform is
                designed to stay out of your way so you can focus on completion.
              </p>
              <ul className="preview-list">
                <li>
                  <div className="preview-icon">
                    <HiOutlineAdjustmentsHorizontal />
                  </div>
                  <div>
                    <h5>Smart Filters</h5>
                    <p>Quickly sort by category, distance, or reward value.</p>
                  </div>
                </li>
                <li>
                  <div className="preview-icon">
                    <HiOutlineChartBar />
                  </div>
                  <div>
                    <h5>Reward Summary</h5>
                    <p>A real-time overview of your earnings and pending approvals.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div
              ref={previewImageRef}
              className="preview-image-wrap reveal reveal-scale reveal-delay-1"
            >
              <img
                className="preview-image"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzFfBX5QhZfnG_u4Ou9H_jL6r8HTJpm_K3FBauJ5HXY8qCZHr3xZYF6YXAgAXIPSSA-Zwb4-fbX2yY5Ss8HRT9Zsx_1L28H64l65njbQJ8HswBKwIhGHrKlmxpuMnXEyc44mW-knJMH9-6c6dsOoJoelNlw2f1irrzPGBYXFZZTPai4F58T3Lm2XChhlwUqZ-GAok4vu2V-1Zc3x3lQwHb4gga84YaS9FvC8EuQILxHqK3-PL1OHN7"
                alt="Taskora desktop dashboard"
              />
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="final-cta">
          <div ref={ctaRef} className="final-cta-container reveal reveal-up-scale">
            <h2>Ready to get things done?</h2>
            <p>
              Be the first in line when we launch. Join thousands of early adopters and start
              earning rewards for your skills.
            </p>

            <Link to="/signup" className="btn btn-light btn-block">
              Join the Waitlist
            </Link>

            <p className="final-cta-note">No spam, ever. Only important product updates.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default WaitlistPage
