import { Link } from 'react-router-dom'
import FlowCenterShell from '../../components/FlowCenterShell/FlowCenterShell'
import { useSignupFlow } from '../../context/SignupFlowContext'
import './SignupFlow.css'

function SignupDoneStep() {
  const { data } = useSignupFlow()

  return (
    <FlowCenterShell
      heading={`You're all set, ${data.fullName.split(' ')[0] || 'there'}!`}
      subheading="This is a placeholder — the dashboard isn't built yet."
    >
      <Link to="/" className="btn btn-primary btn-block">
        Back to Home
      </Link>
    </FlowCenterShell>
  )
}

export default SignupDoneStep
