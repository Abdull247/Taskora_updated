import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import FaqAccordion from '../../components/FaqAccordion/FaqAccordion'
import AnimatedCounter from '../../components/AnimatedCounter/AnimatedCounter'
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
  HiOutlineBolt,
  HiOutlineGlobeAlt,
  HiOutlineSparkles,
  HiStar,
} from 'react-icons/hi2'
import './LandingPage.css'

const taskerFaqs = [
  {
    question: 'What is TaskBridge?',
    answer: 'TaskBridge is a platform where people can discover tasks, complete useful work and earn rewards.',
  },
  {
    question: 'How do I become a Tasker?',
    answer:
      "Join the waitlist and create your account when TaskBridge becomes available. You'll be able to explore available tasks and choose opportunities that fit you.",
  },
  {
    question: 'How do Taskers earn rewards?',
    answer: 'Taskers earn the reward associated with eligible tasks they successfully complete and have approved.',
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
    answer: 'Joining the waitlist is free. Pricing and fees for using specific TaskBridge features will be communicated before launch.',
  },
  {
    question: 'Where will TaskBridge be available?',
    answer: 'TaskBridge is being built with accessibility in mind, with availability and supported regions expanding over time.',
  },
  {
    question: 'Can businesses use TaskBridge?',
    answer: 'Yes. Businesses and organizations can use TaskBridge to create tasks and connect with people who can help get them done.',
  },
]

function LandingPage() {
  const heroTitleRef = useScrollReveal<HTMLHeadingElement>({ threshold: 0 })
  const heroDescRef = useScrollReveal<HTMLParagraphElement>({ threshold: 0 })
  const heroActionsRef = useScrollReveal<HTMLDivElement>({ threshold: 0 })
  const heroImageRef = useScrollReveal<HTMLDivElement>({ threshold: 0.1 })

  const statsRef = useScrollReveal<HTMLDivElement>()

  const howHeadingRef = useScrollReveal<HTMLDivElement>()
  const step1Ref = useScrollReveal<HTMLDivElement>()
  const step2Ref = useScrollReveal<HTMLDivElement>()
  const step3Ref = useScrollReveal<HTMLDivElement>()
  const step4Ref = useScrollReveal<HTMLDivElement>()
  const step5Ref = useScrollReveal<HTMLDivElement>()

  const showcaseHeadingRef = useScrollReveal<HTMLDivElement>()
  const showcaseCard1Ref = useScrollReveal<HTMLDivElement>()
  const showcaseCard2Ref = useScrollReveal<HTMLDivElement>()
  const showcaseCard3Ref = useScrollReveal<HTMLDivElement>()

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

  const spotlightHeadingRef = useScrollReveal<HTMLDivElement>()
  const spotlightRef = useScrollReveal<HTMLDivElement>()

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
    <div className="waitlist-page landing-page">
      <Navbar />

      <main>
        {/* Hero Section — no "Launching Soon" badge */}
        <section className="hero">
          <div className="hero-container">
            <div className="hero-copy">
              <h1 ref={heroTitleRef} className="hero-title reveal reveal-fade-blur">
                Get things done.
                <br />
                Get <span className="hero-title-accent">rewarded.</span>
              </h1>
              <p ref={heroDescRef} className="hero-description reveal reveal-up reveal-delay-1">
                TaskBridge is a marketplace connecting Taskers who complete tasks and earn
                rewards with Advertisers who need real work done.
              </p>
              <div ref={heroActionsRef} className="hero-actions reveal reveal-up reveal-delay-2">
                <Link to="/signup?role=worker" className="btn btn-primary btn-block">
                  Get Started
                </Link>
                <a href="#how-it-works" className="btn btn-tint btn-block">
                  How It Works
                </a>
              </div>
            </div>

            <div ref={heroImageRef} className="hero-image-wrap reveal reveal-scale reveal-delay-1">
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

        {/* ============ UNIQUE SECTION 1: Live Stats Band ============ */}
        <section className="stats-band">
          <div ref={statsRef} className="stats-band-container reveal reveal-up">
            <div className="stat-item">
              <span className="stat-value">
                <AnimatedCounter end={1284} suffix="+" />
              </span>
              <span className="stat-label">People waiting</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">
                <AnimatedCounter end={9} />
              </span>
              <span className="stat-label">Task categories</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">
                <AnimatedCounter end={2} />
              </span>
              <span className="stat-label">Ways to join</span>
            </div>
          </div>
        </section>

        {/* How TaskBridge Works */}
        <section className="how-it-works" id="how-it-works">
          <div className="section-container">
            <div ref={howHeadingRef} className="section-heading reveal reveal-up">
              <h2>From idea to done, in five simple steps</h2>
              <p>TaskBridge makes it effortless for tasks to get posted, discovered, and completed.</p>
            </div>

            <div className="steps-stack">
              <div ref={step1Ref} className="step-card reveal reveal-left">
                <div className="step-icon">
                  <HiOutlineClipboardDocumentList />
                </div>
                <span className="step-label">STEP 01</span>
                <h3>Post a Task</h3>
                <p>Advertisers create a task in minutes by describing what they need done, adding clear instructions and defining requirements.</p>
              </div>

              <div ref={step2Ref} className="step-card reveal reveal-up reveal-delay-1">
                <div className="step-icon">
                  <HiOutlineBanknotes />
                </div>
                <span className="step-label">STEP 02</span>
                <h3>Set Your Budget</h3>
                <p>Advertisers choose how much to pay per completed task, set the number of participants and fund their campaign to make it live.</p>
              </div>

              <div ref={step3Ref} className="step-card reveal reveal-right reveal-delay-2">
                <div className="step-icon">
                  <HiOutlineMagnifyingGlass />
                </div>
                <span className="step-label">STEP 03</span>
                <h3>Discover</h3>
                <p>Taskers find tasks that match what they can do, from simple digital checks to local physical assistance.</p>
              </div>

              <div ref={step4Ref} className="step-card reveal reveal-left reveal-delay-1">
                <div className="step-icon">
                  <HiOutlineCheckCircle />
                </div>
                <span className="step-label">STEP 04</span>
                <h3>Complete</h3>
                <p>Follow clear instructions to get the task done and submit your work directly through the app.</p>
              </div>

              <div ref={step5Ref} className="step-card reveal reveal-right reveal-delay-2">
                <div className="step-icon">
                  <HiOutlineBanknotes />
                </div>
                <span className="step-label">STEP 05</span>
                <h3>Get Rewarded</h3>
                <p>Earn your reward instantly when your work is approved, and transfer your balance easily.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ UNIQUE SECTION 2: Visual "How It Feels" Showcase ============ */}
        <section className="feel-showcase">
          <div className="section-container">
            <div ref={showcaseHeadingRef} className="section-heading reveal reveal-up">
              <h2>What using TaskBridge actually feels like</h2>
              <p>No clutter, no confusion — just a clear path from posting to getting paid.</p>
            </div>

            <div className="showcase-grid">
              <div ref={showcaseCard1Ref} className="showcase-card showcase-card-tall reveal reveal-left">
                <div className="showcase-icon">
                  <HiOutlineBolt />
                </div>
                <h3>Instant clarity</h3>
                <p>Every task shows exactly what's expected, what it pays, and how long it takes — before you commit to anything.</p>
              </div>

              <div ref={showcaseCard2Ref} className="showcase-card reveal reveal-up reveal-delay-1">
                <div className="showcase-icon">
                  <HiOutlineGlobeAlt />
                </div>
                <h3>Work from anywhere</h3>
                <p>Digital tasks travel with you. Local tasks connect you to opportunities nearby.</p>
              </div>

              <div ref={showcaseCard3Ref} className="showcase-card reveal reveal-right reveal-delay-2">
                <div className="showcase-icon">
                  <HiOutlineSparkles />
                </div>
                <h3>Momentum that compounds</h3>
                <p>Completed tasks build your track record, making it easier to access better opportunities over time.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Two-Sided Marketplace */}
        <section className="two-sided" id="for-taskers">
          <div className="section-container">
            <div ref={twoSidedHeadingRef} className="section-heading reveal reveal-up">
              <h2>One platform. Two ways to get things done.</h2>
              <p>Whether you're looking for opportunities or need something done, TaskBridge connects the right people to the right tasks.</p>
            </div>

            <div className="two-sided-grid">
              <div ref={taskerCardRef} className="side-card reveal reveal-left">
                <div className='side-card-header side-card-child'>
                  <span className="side-label">For Taskers</span>
                  <div className="side-icon">
                    <HiOutlineMagnifyingGlass />
                  </div>
                </div>
                <div className='side-card-body side-card-child'>
                  <h3>Find tasks. Do the work. Get rewarded.</h3>
                  <p>Discover tasks that match your skills, interests and location. Complete them, submit your work and earn rewards when your work is approved.</p>
                  <ul className="side-benefits">
                    <li>Discover relevant tasks</li>
                    <li>Choose opportunities that fit you</li>
                    <li>Complete tasks on your terms</li>
                    <li>Earn rewards for approved work</li>
                  </ul>
                </div>
                <div className='side-card-footer side-card-child'>
                  <Link to="/signup?role=worker" className="btn btn-primary btn-block">
                    Get Started as a Tasker
                  </Link>
                </div>
              </div>

              <div id="for-advertisers" ref={advertiserCardRef} className="side-card reveal reveal-right">
                <div className='side-card-header side-card-child'>
                  <span className="side-label">For Advertisers</span>
                  <div className="side-icon">
                    <HiOutlineMegaphone />
                  </div>
                </div>
                <div className='side-card-body side-card-child'>
                  <h3>Need something done? Put it in front of the right people.</h3>
                  <p>Create a task, define what you need, set your reward and let TaskBridge connect you with people ready to get it done.</p>
                  <ul className="side-benefits">
                    <li>Create and publish tasks</li>
                    <li>Set your requirements and reward</li>
                    <li>Reach relevant Taskers</li>
                    <li>Review submissions and approve completed work</li>
                  </ul>
                </div>
                <div className='side-card-footer side-card-child'>
                  <Link to="/signup?role=advertiser" className="btn btn-primary btn-block">
                    Get Started as an Advertiser
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* For Advertisers process */}
        <section className="advertiser-flow">
          <div className="section-container">
            <div ref={advertiserFlowHeadingRef} className="section-heading reveal reveal-up">
              <h2>Turn things you need done into simple tasks.</h2>
              <p>From getting local help to collecting information or completing digital work, TaskBridge helps you turn real-world needs into clear, actionable tasks.</p>
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
                Get Started as an Advertiser
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
                <span className="category-icon"><HiOutlineMapPin /></span>
                <h4>Local Tasks</h4>
                <p>Need someone nearby to help with a simple physical task?</p>
              </div>
              <div ref={cat2Ref} className="category-card reveal reveal-up-scale reveal-delay-1">
                <span className="category-icon"><HiOutlineChatBubbleLeftRight /></span>
                <h4>Research &amp; Feedback</h4>
                <p>Get opinions, responses or real-world information from people.</p>
              </div>
              <div ref={cat3Ref} className="category-card reveal reveal-up-scale reveal-delay-2">
                <span className="category-icon"><HiOutlineComputerDesktop /></span>
                <h4>Digital Tasks</h4>
                <p>Delegate simple online work that can be completed remotely.</p>
              </div>
              <div ref={cat4Ref} className="category-card reveal reveal-up-scale">
                <span className="category-icon"><HiOutlineCamera /></span>
                <h4>Content &amp; Media</h4>
                <p>Get help with simple content, photography, video or media-related tasks.</p>
              </div>
              <div ref={cat5Ref} className="category-card reveal reveal-up-scale reveal-delay-1">
                <span className="category-icon"><HiOutlineEye /></span>
                <h4>Testing &amp; Feedback</h4>
                <p>Have people test an experience, product or process and share their feedback.</p>
              </div>
              <div ref={cat6Ref} className="category-card reveal reveal-up-scale reveal-delay-2">
                <span className="category-icon"><HiOutlineTruck /></span>
                <h4>Errands &amp; Assistance</h4>
                <p>Get help with everyday tasks that require a real person.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ UNIQUE SECTION 3: Founding Member Spotlight ============ */}
        <section className="spotlight">
          <div className="section-container">
            <div ref={spotlightHeadingRef} className="section-heading reveal reveal-up">
              <h2>Be part of the first wave</h2>
              <p>Early members shape what TaskBridge becomes — and get recognized for it.</p>
            </div>

            <div ref={spotlightRef} className="spotlight-card reveal reveal-up-scale">
              <div className="spotlight-stars">
                <HiStar /><HiStar /><HiStar /><HiStar /><HiStar />
              </div>
              <p className="spotlight-quote">
                "Everyone who joins before launch gets a First Access code — a permanent
                marker of being here from day one."
              </p>
              <div className="spotlight-footer">
                <span className="spotlight-badge">FA-XXXXXXXX</span>
                <span className="spotlight-caption">Your unique founding member code</span>
              </div>
            </div>
          </div>
        </section>

        {/* Who is TaskBridge for */}
        <section className="who-for">
          <div className="section-container">
            <div ref={whoHeadingRef} className="section-heading reveal reveal-up">
              <h2>Built for people who need things done — and people ready to do them.</h2>
            </div>

            <div className="who-grid">
              <div ref={who1Ref} className="who-card reveal reveal-up-scale">
                <span className="who-icon"><HiOutlineUserCircle /></span>
                <h4>Individuals</h4>
                <p>Get help with everyday tasks and small projects.</p>
              </div>
              <div ref={who2Ref} className="who-card reveal reveal-up-scale reveal-delay-1">
                <span className="who-icon"><HiOutlineBuildingOffice2 /></span>
                <h4>Businesses</h4>
                <p>Delegate useful work and reach people who can help.</p>
              </div>
              <div ref={who3Ref} className="who-card reveal reveal-up-scale reveal-delay-2">
                <span className="who-icon"><HiOutlineBuildingOffice /></span>
                <h4>Organizations</h4>
                <p>Create structured tasks and gather responses, feedback or assistance.</p>
              </div>
              <div ref={who4Ref} className="who-card reveal reveal-up-scale reveal-delay-3">
                <span className="who-icon"><HiOutlineIdentification /></span>
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
                <span className="trust-icon"><HiOutlineClipboardDocumentList /></span>
                <h4>Clear Task Details</h4>
                <p>Taskers should know what is expected before accepting a task.</p>
              </div>
              <div ref={trust2Ref} className="trust-card reveal reveal-up-scale reveal-delay-1">
                <span className="trust-icon"><HiOutlineCurrencyDollar /></span>
                <h4>Transparent Rewards</h4>
                <p>Advertisers define the reward associated with a task.</p>
              </div>
              <div ref={trust3Ref} className="trust-card reveal reveal-up-scale reveal-delay-2">
                <span className="trust-icon"><HiOutlineClipboardDocumentCheck /></span>
                <h4>Submission Review</h4>
                <p>Advertisers can review submitted work before approving completion.</p>
              </div>
              <div ref={trust4Ref} className="trust-card reveal reveal-up-scale reveal-delay-3">
                <span className="trust-icon"><HiOutlineShieldCheck /></span>
                <h4>Useful Profiles &amp; Information</h4>
                <p>Give both sides enough context to make better decisions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why TaskBridge */}
        <section className="why-taskora" id="why-taskora">
          <div className="section-container">
            <div ref={whyHeadingRef} className="section-heading reveal reveal-up">
              <h2>Why choose TaskBridge?</h2>
              <p>We're building the most reliable platform for the next generation of flexible earning.</p>
            </div>

            <div className="features-stack">
              <div ref={feature1Ref} className="feature-card reveal reveal-up-scale">
                <span className="feature-icon"><HiOutlineRocketLaunch /></span>
                <h4>Find Opportunities</h4>
                <p>Access a curated feed of verified tasks relevant to your skills and location.</p>
              </div>
              <div ref={feature2Ref} className="feature-card reveal reveal-up-scale reveal-delay-1">
                <span className="feature-icon"><HiOutlineTag /></span>
                <h4>Earn Rewards</h4>
                <p>Get paid fairly and quickly. No hidden fees or complex point systems.</p>
              </div>
              <div ref={feature3Ref} className="feature-card reveal reveal-up-scale reveal-delay-2">
                <span className="feature-icon"><HiOutlineUsers /></span>
                <h4>Simple &amp; Accessible</h4>
                <p>An interface built for real people. No technical jargon, just momentum.</p>
              </div>
              <div ref={feature4Ref} className="feature-card reveal reveal-up-scale reveal-delay-3">
                <span className="feature-icon"><HiOutlineShieldCheck /></span>
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
              <p>Take a look at how we've reimagined task management. The TaskBridge platform is designed to stay out of your way so you can focus on completion.</p>
              <ul className="preview-list">
                <li>
                  <div className="preview-icon"><HiOutlineAdjustmentsHorizontal /></div>
                  <div>
                    <h5>Smart Filters</h5>
                    <p>Quickly sort by category, distance, or reward value.</p>
                  </div>
                </li>
                <li>
                  <div className="preview-icon"><HiOutlineChartBar /></div>
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
                src="/dashboard_mockup.png"
                alt="TaskBridge desktop dashboard"
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
            <p>Whether you're ready to earn by completing tasks or you have something that needs to get done, TaskBridge is here.</p>

            <div className="final-cta-actions">
              <Link to="/signup?role=worker" className="btn btn-light btn-block">
                Get Started as a Tasker
              </Link>
              <Link to="/signup?role=advertiser" className="btn btn-outline-light btn-block">
                Get Started as an Advertiser
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

export default LandingPage
