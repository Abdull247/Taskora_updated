import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { SignupFlowProvider } from './context/SignupFlowContext'
import LandingPage from './pages/Landing/LandingPage'
import WaitlistPage from './pages/Waitlist/WaitlistPage'
import ForTaskersPage from './pages/ForTaskers/ForTaskersPage'
import ForAdvertisersPage from './pages/ForAdvertisers/ForAdvertisersPage'
import LoginPage from './pages/Login/LoginPage'
import DashboardPage from './pages/Dashboard/DashboardPage'
import BrowseTasksPage from './pages/BrowseTasks/BrowseTasksPage'
import TaskDetailsPage from './pages/TaskDetails/TaskDetailsPage'
import CreateTaskPage from './pages/CreateTask/CreateTaskPage'
import TaskSubmissionsPage from './pages/TaskSubmissions/TaskSubmissionsPage'
import MySubmissionsPage from './pages/MySubmissions/MySubmissionsPage'
import ReviewSubmissionsPage from './pages/ReviewSubmissions/ReviewSubmissionsPage'
import WalletPage from './pages/Wallet/WalletPage'
import NotificationsPage from './pages/Notifications/NotificationsPage'
import ReferralPage from './pages/Referral/ReferralPage'
import { isAuthenticated } from './lib/authStatus'
import CreateAccountStep from './pages/SignupFlow/CreateAccountStep'
import CheckEmailStep from './pages/SignupFlow/CheckEmailStep'
import OtpStep from './pages/SignupFlow/OtpStep'
import CreatePasswordStep from './pages/SignupFlow/CreatePasswordStep'
import RoleStep from './pages/SignupFlow/RoleStep'
import BusinessInfoStep from './pages/SignupFlow/BusinessInfoStep'
import SignupDoneStep from './pages/SignupFlow/SignupDoneStep'
import WaitlistSuccessPage from './pages/WaitlistSuccess/WaitlistSuccessPage'
import NotFoundPage from './pages/NotFound/NotFoundPage'
import ComingSoonDashboardPage from './pages/ComingSoonDashboard/ComingSoonDashboardPage'
import AppNav from './components/AppNav/AppNav'
import './App.css'

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4500,
          style: {
            background: '#ffffff',
            color: '#131b2e',
            fontFamily: '"Hanken Grotesk", sans-serif',
            fontSize: '14px',
            padding: '14px 16px',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.15)',
            maxWidth: 'min(420px, calc(100vw - 32px))',
          },
          success: {
            iconTheme: { primary: '#16A34A', secondary: '#ffffff' },
            style: { border: '1px solid #bbf7d0' },
          },
          error: {
            iconTheme: { primary: '#ba1a1a', secondary: '#ffffff' },
            style: { border: '1px solid #fecaca' },
          },
        }}
      />
      <SignupFlowProvider>
        <AppNav />
        <Routes>
          <Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/waitlist" element={<WaitlistPage />} />
          <Route path="/waitlist/for-taskers" element={<ForTaskersPage />} />
          <Route path="/waitlist/for-advertisers" element={<ForAdvertisersPage />} />

          <Route path="/signup" element={<CreateAccountStep />} />
          <Route path="/signup/verify-email" element={<CheckEmailStep />} />
          <Route path="/signup/otp" element={<OtpStep />} />
          <Route path="/signup/password" element={<CreatePasswordStep />} />
          <Route path="/signup/role" element={<RoleStep />} />
          <Route path="/signup/business" element={<BusinessInfoStep />} />
          <Route path="/signup/done" element={<SignupDoneStep />} />

          <Route path="/waitlist/success" element={<WaitlistSuccessPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/tasks" element={<BrowseTasksPage />} />
          <Route path="/dashboard/tasks/:id" element={<TaskDetailsPage />} />
          <Route path="/dashboard/tasks/create" element={<CreateTaskPage />} />
          <Route path="/dashboard/tasks/:id/submissions" element={<TaskSubmissionsPage />} />
          <Route path="/dashboard/submissions" element={<MySubmissionsPage />} />
          <Route path="/dashboard/review" element={<ReviewSubmissionsPage />} />
          <Route path="/dashboard/wallet" element={<WalletPage />} />
          <Route path="/dashboard/notifications" element={<NotificationsPage />} />
          <Route path="/dashboard/referral" element={<ReferralPage />} />
          <Route path="/dashboard/verify" element={<ComingSoonDashboardPage title="ID Verification" description="Self-serve identity verification is on the way. In the meantime your account already benefits from our verification checks." />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </SignupFlowProvider>
    </>
  )
}

export default App
