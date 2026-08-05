import "./Success.css";
import { HiCheck } from "react-icons/hi2";
import { FaTelegramPlane } from "react-icons/fa";
import Navbar from "../../../components/Navbar/Navbar";
import { HiOutlineBell } from "react-icons/hi2";
import {
      HiOutlineEnvelope,
      HiOutlineRocketLaunch,
      HiOutlineUsers,
          } from "react-icons/hi2";
          import { useLocation } from "react-router-dom";


function Success(){
    const location = useLocation();
      const role = location.state?.role;

        const telegramLink =
            role === "advertiser"
                  ? "https://t.me/YourAdvertiserGroup"
                        : "https://t.me/YourTaskerGroup";
    const steps = [
          {
            icon: HiOutlineEnvelope,
            title: "We'll keep you updated",
            description: "Important updates and launch news will be sent straight to your inbox."
            },
        {
            icon: HiOutlineRocketLaunch,
            title: "Be the first to access",
            description: "Get early access to TaskBridge bfore anyone else."
            },
        {
            icon: HiOutlineUsers,
            title: "Help shape TaskBridge",
            description: "Share feedback and help us build the best platform for you."
            }
                          ];
    return(
        <section className="success-page">
            <Navbar />

           <main className="success-container">
            {/*success animation*/}
            <div className="success-animation">
                {/* Sparkles */}
                    <span className="spark spark-1"></span>
                    <span className="spark spark-2"></span>
                    <span className="spark spark-3"></span>
                    <span className="spark spark-4"></span>

                    {/* Circle */}
                        <div className="success-circle">
                        <HiCheck className="check-icon" />
                        </div>
            </div>
            {/*Headings*/}
            <div className="headings">
                <h1>You're on the <span className="blue-txt">waitlist</span>!</h1>
                <p className="success-description">
                    Thanks for joining TaskBridge. You'll be the first to know 
                    when we launch.
                </p>
            </div>
            <div className="telegram-card">
                {/* Top section */}

                    <div className="telegram-header">

                    <div className="icon-circle">

                        <HiOutlineBell />

                         </div>

                        <div className="telegram-content">

                        <h3>Stay updated</h3>

                        <p>  Join our Telegram community to get  updates, sneak peeks and launch news. </p>

                     </div>

                </div>
                <div>
                    <button className="telegram-button" onClick={() => window.open(telegramLink, "_blank")}>
                          <FaTelegramPlane className="telegram-icon" />
                            <span>Join our Telegram</span>
                            </button>
                </div>
                <div className="steps">
                    <h1>What happenes next?</h1>

                </div>
            </div>
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
             <button to="/" className="back-home">
                Back to Home
             </button>
           </main>
        </section>
    );
}
export default Success;