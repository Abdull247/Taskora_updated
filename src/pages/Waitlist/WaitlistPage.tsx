import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import FaqAccordion from '../../components/FaqAccordion/FaqAccordion'
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
  HiOutlineClipboardDocumentList,
  HiOutlineMegaphone,
  HiOutlineMapPin,
  HiOutlineChatBubbleLeftRight,
  HiOutlineComputerDesktop,
  HiOutlineCamera,
  HiOutlineClipboardDocumentCheck,
  HiOutlineTruck,
  HiOutlineUserCircle,
  HiOutlineBuildingOffice2,
  HiOutlineBuildingOffice,
  HiOutlineDocumentText,
  HiOutlineCurrencyDollar,
  HiOutlineEye,
  HiOutlineIdentification,
} from 'react-icons/hi2'
import './WaitlistPage.css'

const taskerFaqs = [
  {
    question: 'What is TaskBridge?',
    answer:
      'TaskBridge is a platform where people can discover tasks, complete useful work and earn rewards.',
  },
  {
    question: 'How do I become a Tasker?',
    answer:
      "Join the waitlist and create your account when TaskBridge becomes available. You'll be able to explore available tasks and choose opportunities that fit you.",
  },
  {
    question: 'How do Taskers earn rewards?',
    answer:
      'Taskers earn the reward associated with eligible tasks they successfully complete and have approved.',
  },
  {
    question: 'Can I choose which tasks I complete?',
    answer:
      'TaskBridge is designed to let Taskers discover opportunities and choose tasks that fit their interests, skills and availability.',
  },
]

const advertiserFaqs = [
  {
    question: 'What is an Advertiser?',
    answer: 'An Advertiser is someone who creates a task on TaskBridge because they need something done by another person.',
  },
  {
    question: 'What can I post as an Advertiser?',
    answer:
      'Advertisers can create tasks for a variety of digital, local, research, feedback, assistance and other practical needs, depending on what TaskBridge supports at launch.',
  },
  {
    question: 'How do Advertisers create a task?',
    answer:
      'Advertisers provide the task details, instructions, requirements and reward so Taskers know exactly what needs to be done.',
  },
  {
    question: 'Do Advertisers choose who completes their task?',
    answer:
      'TaskBridge can help Advertisers reach relevant Taskers. The exact matching and selection experience will depend on the task and platform features available at launch.',
  },
]

const generalFaqs = [
  {
    question: 'When is TaskBridge launching?',
    answer: 'TaskBridge is currently preparing for launch. Join the waitlist to receive important launch updates and early-access information.',
  },
  {
    question: 'Is TaskBridge free to join?',
    answer:
      'Joining the waitlist is free. Pricing and fees for using specific TaskBridge features will be communicated before launch.',
  },
  {
    question: 'Where will Taskora be available?',
    answer:
      'TaskBridge is being built with accessibility in mind, with availability and supported regions expanding over time.',
  },
  {
    question: 'Can businesses use TaskBridge?',
    answer: 'Yes. Businesses and organizations can use TaskBridge to create tasks and connect with people who can help get them done.',
  },
]

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
  const step4Ref= useScrollReveal<HTMLDivElement>()
  const step5Ref= useScrollReveal<HTMLDivElement>()

  const twoSidedHeadingRef = useScrollReveal<HTMLDivElement>()
  const taskerCardRef = useScrollReveal<HTMLDivElement>()
  const advertiserCardRef = useScrollReveal<HTMLDivElement>()

  const advertiserFlowHeadingRef = useScrollReveal<HTMLDivElement>()
  const advStep1Ref = useScrollReveal<HTMLDivElement>()
  const advStep2Ref = useScrollReveal<HTMLDivElement>()
  const advStep3Ref = useScrollReveal<HTMLDivElement>()
  const advStep4Ref = useScrollReveal<HTMLDivElement>()

  const categoriesHeadingRef = useScrollReveal<HTMLDivElement>()
  const cat1Ref = useScrollReveal<HTMLDivElement>()
  const cat2Ref = useScrollReveal<HTMLDivElement>()
  const cat3Ref = useScrollReveal<HTMLDivElement>()
  const cat4Ref = useScrollReveal<HTMLDivElement>()
  const cat5Ref = useScrollReveal<HTMLDivElement>()
  const cat6Ref = useScrollReveal<HTMLDivElement>()

  const whoHeadingRef = useScrollReveal<HTMLDivElement>()
  const who1Ref = useScrollReveal<HTMLDivElement>()
  const who2Ref = useScrollReveal<HTMLDivElement>()
  const who3Ref = useScrollReveal<HTMLDivElement>()
  const who4Ref = useScrollReveal<HTMLDivElement>()

  const trustHeadingRef = useScrollReveal<HTMLDivElement>()
  const trust1Ref = useScrollReveal<HTMLDivElement>()
  const trust2Ref = useScrollReveal<HTMLDivElement>()
  const trust3Ref = useScrollReveal<HTMLDivElement>()
  const trust4Ref = useScrollReveal<HTMLDivElement>()

  const whyHeadingRef = useScrollReveal<HTMLDivElement>()
  const feature1Ref = useScrollReveal<HTMLDivElement>()
  const feature2Ref = useScrollReveal<HTMLDivElement>()
  const feature3Ref = useScrollReveal<HTMLDivElement>()
  const feature4Ref = useScrollReveal<HTMLDivElement>()

  const previewCopyRef = useScrollReveal<HTMLDivElement>()
  const previewImageRef = useScrollReveal<HTMLDivElement>()

  const faqHeadingRef = useScrollReveal<HTMLDivElement>()
  const faqBodyRef = useScrollReveal<HTMLDivElement>()

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
                Launching Soon
              </span>
              <h1 ref={heroTitleRef} className="hero-title reveal reveal-fade-blur reveal-delay-1">
                Get things done.
                <br />
                Get <span className="hero-title-accent">rewarded.</span>
              </h1>
              <p ref={heroDescRef} className="hero-description reveal reveal-up reveal-delay-2">
                TaskBridge is a marketplace connecting Taskers who complete tasks and earn rewards
                with Advertisers who need real work done. Join the waitlist to be first in line.
              </p>
              <div ref={heroActionsRef} className="hero-actions reveal reveal-up reveal-delay-3">
                <Link to="/signup?role=worker" className="btn btn-primary btn-block">
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
                  src="/dashboard_mockup.png"
                  alt="TaskBridge app dashboard mockup"
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
                <img src="/momentum_1.png" alt="User 1" className="avatar avatar-1" />
                <img src="/momentum_2.png" alt="User 2" className="avatar avatar-2" />
                <img src="/momentum_3.png" alt="User 3" className="avatar avatar-3" />
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
                Getting started with TaskBridge is designed to be effortless. No complex
                onboarding, just clarity.
              </p>
            </div>

            <div className="steps-stack">
              <div ref={step1Ref} className="step-card reveal reveal-left">
                <div className="step-icon">
                  <HiOutlineClipboardDocumentList />
                </div>
                <span className="step-label">STEP 01</span>
                <h3>post a Task</h3>
                <p>
                  Advertisers create a task in minutes by describing what they need done,adding clear,
                  instructions and defining the requirements for successful completion  
                </p>
              </div>

              <div ref={step2Ref} className="step-card reveal reveal-up reveal-delay-1">
                <div className="step-icon">
                  <HiOutlineBanknotes />
                </div>
                <span className="step-label">STEP 02</span>
                <h3>Set Your budget</h3>
                <p>
                  Advertisers choose how much to pay per completed task,set the number of participants
                  they need,fund their their campaigns to make it live
                </p>
              </div>

              <div ref={step3Ref} className="step-card reveal reveal-right reveal-delay-2">
                <div className="step-icon">
                  <HiOutlineMagnifyingGlass />
                </div>
                <span className="step-label">STEP 03</span>
                <h3>Discover</h3>
                <p>
                  Find tasks that match what you can do From simple digital checks to local physical assistance
                  . 
                </p>
              </div>
              <div ref={step4Ref} className="step-card reveal reveal-right reveal-delay-2">
                <div className="step-icon">
                  <HiOutlineCheckCircle />
                </div>
                <span className="step-label">STEP 04</span>
                <h3>Complete</h3>
                <p>
                  Follow clear instructions to get the task done and submit your work directly
                  through our intuitive interface.
                </p>
              </div>
              <div ref={step5Ref} className="step-card reveal reveal-right reveal-delay-2">
                <div className="step-icon">
                  <HiOutlineBanknotes />
                </div>
                <span className="step-label">STEP 05</span>
                <h3>Get rewarded</h3>
                <p>
                  Earn your reward instantly when your work is approved. Transfer balance easily to your preferred account.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Two-Sided Marketplace */}
        <section className="two-sided" id="for-taskers">
          <div className="section-container">
            <div ref={twoSidedHeadingRef} className="section-heading reveal reveal-up">
              <h2>One platform. Two ways to get things done.</h2>
              <p>
                Whether you're looking for opportunities or need something done, TaskBridge
                connects the right people to the right tasks.
              </p>
            </div>

            <div className="two-sided-grid">
              <div ref={taskerCardRef} className="side-card reveal reveal-left">
                <span className="side-label">For Taskers</span>
                <div className="side-icon">
                  <HiOutlineMagnifyingGlass />
                </div>
                <h3>Find tasks. Do the work. Get rewarded.</h3>
                <p>
                  Discover tasks that match your skills, interests and location. Complete them,
                  submit your work and earn rewards when your work is approved.
                </p>
                <ul className="side-benefits">
                  <li>Discover relevant tasks</li>
                  <li>Choose opportunities that fit you</li>
                  <li>Complete tasks on your terms</li>
                  <li>Earn rewards for approved work</li>
                </ul>
                <Link to="/signup?role=worker" className="btn btn-primary btn-block">
                  Join as a Tasker
                </Link>
              </div>

              <div
                id="for-advertisers"
                ref={advertiserCardRef}
                className="side-card reveal reveal-right"
              >
                <span className="side-label">For Advertisers</span>
                <div className="side-icon">
                  <HiOutlineMegaphone />
                </div>
                <h3>Need something done? Put it in front of the right people.</h3>
                <p>
                  Create a task, define what you need, set your reward and let Taskora connect
                  you with people ready to get it done.
                </p>
                <ul className="side-benefits">
                  <li>Create and publish tasks</li>
                  <li>Set your requirements and reward</li>
                  <li>Reach relevant Taskers</li>
                  <li>Review submissions and approve completed work</li>
                </ul>
                <Link to="/signup?role=advertiser" className="btn btn-primary btn-block">
                  Join as an Advertiser
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* For Advertisers process */}
        <section className="advertiser-flow">
          <div className="section-container">
            <div ref={advertiserFlowHeadingRef} className="section-heading reveal reveal-up">
              <h2>Turn things you need done into simple tasks.</h2>
              <p>
                From getting local help to collecting information or completing digital work,
                TaskBridge helps you turn real-world needs into clear, actionable tasks.
              </p>
            </div>

            <div className="steps-stack steps-stack-4">
              <div ref={advStep1Ref} className="step-card reveal reveal-left">
                <div className="step-icon">
                  <HiOutlineClipboardDocumentList />
                </div>
                <span className="step-label">01</span>
                <h3>Create a Task</h3>
                <p>Describe what needs to be done, add instructions and define who you're looking for.</p>
              </div>

              <div ref={advStep2Ref} className="step-card reveal reveal-up reveal-delay-1">
                <div className="step-icon">
                  <HiOutlineCurrencyDollar />
                </div>
                <span className="step-label">02</span>
                <h3>Set the Reward</h3>
                <p>Choose a reward and provide the details Taskers need before they get started.</p>
              </div>

              <div ref={advStep3Ref} className="step-card reveal reveal-up reveal-delay-2">
                <div className="step-icon">
                  <HiOutlineDocumentText />
                </div>
                <span className="step-label">03</span>
                <h3>Get Submissions</h3>
                <p>People interested in your task complete the work and submit their results.</p>
              </div>

              <div ref={advStep4Ref} className="step-card reveal reveal-right reveal-delay-3">
                <div className="step-icon">
                  <HiOutlineClipboardDocumentCheck />
                </div>
                <span className="step-label">04</span>
                <h3>Review &amp; Approve</h3>
                <p>Review submissions and approve completed work that meets your requirements.</p>
              </div>
            </div>

            <div className="advertiser-flow-actions">
              <Link to="/signup?role=advertiser" className="btn btn-primary btn-block">
                Become an Advertiser
              </Link>
              <a href="#how-it-works" className="btn btn-tint btn-block">
                See How It Works
              </a>
            </div>
          </div>
        </section>

        {/* What can you get done */}
        <section className="categories">
          <div className="section-container">
            <div ref={categoriesHeadingRef} className="section-heading reveal reveal-up">
              <h2>What can you get done with TaskBridge?</h2>
              <p>A few examples of the kinds of tasks Advertisers can create.</p>
            </div>

            <div className="categories-grid">
              <div ref={cat1Ref} className="category-card reveal reveal-up-scale">
                <span className="category-icon">
                  <HiOutlineMapPin />
                </span>
                <h4>Local Tasks</h4>
                <p>Need someone nearby to help with a simple physical task?</p>
              </div>
              <div ref={cat2Ref} className="category-card reveal reveal-up-scale reveal-delay-1">
                <span className="category-icon">
                  <HiOutlineChatBubbleLeftRight />
                </span>
                <h4>Research &amp; Feedback</h4>
                <p>Get opinions, responses or real-world information from people.</p>
              </div>
              <div ref={cat3Ref} className="category-card reveal reveal-up-scale reveal-delay-2">
                <span className="category-icon">
                  <HiOutlineComputerDesktop />
                </span>
                <h4>Digital Tasks</h4>
                <p>Delegate simple online work that can be completed remotely.</p>
              </div>
              <div ref={cat4Ref} className="category-card reveal reveal-up-scale">
                <span className="category-icon">
                  <HiOutlineCamera />
                </span>
                <h4>Content &amp; Media</h4>
                <p>Get help with simple content, photography, video or media-related tasks.</p>
              </div>
              <div ref={cat5Ref} className="category-card reveal reveal-up-scale reveal-delay-1">
                <span className="category-icon">
                  <HiOutlineEye />
                </span>
                <h4>Testing &amp; Feedback</h4>
                <p>Have people test an experience, product or process and share their feedback.</p>
              </div>
              <div ref={cat6Ref} className="category-card reveal reveal-up-scale reveal-delay-2">
                <span className="category-icon">
                  <HiOutlineTruck />
                </span>
                <h4>Errands &amp; Assistance</h4>
                <p>Get help with everyday tasks that require a real person.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Who is Taskora for */}
        <section className="who-for">
          <div className="section-container">
            <div ref={whoHeadingRef} className="section-heading reveal reveal-up">
              <h2>Built for people who need things done — and people ready to do them.</h2>
            </div>

            <div className="who-grid">
              <div ref={who1Ref} className="who-card reveal reveal-up-scale">
                <span className="who-icon">
                  <HiOutlineUserCircle />
                </span>
                <h4>Individuals</h4>
                <p>Get help with everyday tasks and small projects.</p>
              </div>
              <div ref={who2Ref} className="who-card reveal reveal-up-scale reveal-delay-1">
                <span className="who-icon">
                  <HiOutlineBuildingOffice2 />
                </span>
                <h4>Businesses</h4>
                <p>Delegate useful work and reach people who can help.</p>
              </div>
              <div ref={who3Ref} className="who-card reveal reveal-up-scale reveal-delay-2">
                <span className="who-icon">
                  <HiOutlineBuildingOffice />
                </span>
                <h4>Organizations</h4>
                <p>Create structured tasks and gather responses, feedback or assistance.</p>
              </div>
              <div ref={who4Ref} className="who-card reveal reveal-up-scale reveal-delay-3">
                <span className="who-icon">
                  <HiOutlineIdentification />
                </span>
                <h4>Taskers</h4>
                <p>Find opportunities and earn rewards by completing tasks.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust */}
        <section className="trust">
          <div className="section-container">
            <div ref={trustHeadingRef} className="section-heading reveal reveal-up">
              <h2>Built around clear expectations.</h2>
              <p>TaskBridge is designed to make interactions between Taskers and Advertisers straightforward.</p>
            </div>

            <div className="trust-grid">
              <div ref={trust1Ref} className="trust-card reveal reveal-up-scale">
                <span className="trust-icon">
                  <HiOutlineClipboardDocumentList />
                </span>
                <h4>Clear Task Details</h4>
                <p>Taskers should know what is expected before accepting a task.</p>
              </div>
              <div ref={trust2Ref} className="trust-card reveal reveal-up-scale reveal-delay-1">
                <span className="trust-icon">
                  <HiOutlineCurrencyDollar />
                </span>
                <h4>Transparent Rewards</h4>
                <p>Advertisers define the reward associated with a task.</p>
              </div>
              <div ref={trust3Ref} className="trust-card reveal reveal-up-scale reveal-delay-2">
                <span className="trust-icon">
                  <HiOutlineClipboardDocumentCheck />
                </span>
                <h4>Submission Review</h4>
                <p>Advertisers can review submitted work before approving completion.</p>
              </div>
              <div ref={trust4Ref} className="trust-card reveal reveal-up-scale reveal-delay-3">
                <span className="trust-icon">
                  <HiOutlineShieldCheck />
                </span>
                <h4>Useful Profiles &amp; Information</h4>
                <p>Give both sides enough context to make better decisions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Taskora */}
        <section className="why-taskora" id="why-taskora">
          <div className="section-container">
            <div ref={whyHeadingRef} className="section-heading reveal reveal-up">
              <h2>Why choose TaskBridge?</h2>
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
              <div ref={feature2Ref} className="feature-card reveal reveal-up-scale reveal-delay-1">
                <span className="feature-icon">
                  <HiOutlineTag />
                </span>
                <h4>Earn Rewards</h4>
                <p>Get paid fairly and quickly. No hidden fees or complex point systems.</p>
              </div>
              <div ref={feature3Ref} className="feature-card reveal reveal-up-scale reveal-delay-2">
                <span className="feature-icon">
                  <HiOutlineUsers />
                </span>
                <h4>Simple &amp; Accessible</h4>
                <p>An interface built for real people. No technical jargon, just momentum.</p>
              </div>
              <div ref={feature4Ref} className="feature-card reveal reveal-up-scale reveal-delay-3">
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
                Take a look at how we've reimagined task management. The TaskorBridge platform is
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

            <div ref={previewImageRef} className="preview-image-wrap reveal reveal-scale reveal-delay-1">
              <img
                className="preview-image"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzFfBX5QhZfnG_u4Ou9H_jL6r8HTJpm_K3FBauJ5HXY8qCZHr3xZYF6YXAgAXIPSSA-Zwb4-fbX2yY5Ss8HRT9Zsx_1L28H64l65njbQJ8HswBKwIhGHrKlmxpuMnXEyc44mW-knJMH9-6c6dsOoJoelNlw2f1irrzPGBYXFZZTPai4F58T3Lm2XChhlwUqZ-GAok4vu2V-1Zc3x3lQwHb4gga84YaS9FvC8EuQILxHqK3-PL1OHN7"
                alt="Taskora desktop dashboard"
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="faq-section" id="faq">
          <div className="section-container">
            <div ref={faqHeadingRef} className="section-heading reveal reveal-up">
              <h2>Frequently asked questions</h2>
            </div>

            <div ref={faqBodyRef} className="faq-body reveal reveal-up reveal-delay-1">
              <FaqAccordion groupLabel="For Taskers" items={taskerFaqs} />
              <FaqAccordion groupLabel="For Advertisers" items={advertiserFaqs} />
              <FaqAccordion groupLabel="General" items={generalFaqs} />
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="final-cta">
          <div ref={ctaRef} className="final-cta-container reveal reveal-up-scale">
            <h2>Ready to get things done?</h2>
            <p>
              Whether you're ready to earn by completing tasks or you have something that needs
              to get done, TaskBridge is coming soon.
            </p>

            <div className="final-cta-actions">
              <Link to="/signup?role=worker" className="btn btn-light btn-block">
                Join as a Tasker
              </Link>
              <Link to="/signup?role=advertiser" className="btn btn-outline-light btn-block">
                Join as an Advertiser
              </Link>
            </div>

            <p className="final-cta-note">No spam, ever. Only important product updates.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default WaitlistPage
