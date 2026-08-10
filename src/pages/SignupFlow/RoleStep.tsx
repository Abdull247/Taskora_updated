import { useNavigate } from 'react-router-dom'
import FlowCenterShell from '../../components/FlowCenterShell/FlowCenterShell'
import RoleSelect from '../../components/RoleSelect/RoleSelect'
import { useSignupFlow } from '../../context/SignupFlowContext'
import type { UserRole } from '../../types/api'
import './SignupFlow.css'

function RoleStep() {
  const navigate = useNavigate()
  const { data, updateData } = useSignupFlow()
  const role = data.role ?? 'worker'

  const handleChange = (newRole: UserRole) => {
    updateData({ role: newRole })
  }

  const handleContinue = () => {
    if (role === 'advertiser') {
      navigate('/signup/business')
    } else {
      navigate('/signup/done')
    }
  }

  return (
    <FlowCenterShell
      heading="How will you use TaskBridge?"
      subheading="This choice is permanent and cannot be changed later"
    >
      <RoleSelect value={role} onChange={handleChange} />

      <button type="button" className="btn btn-primary btn-block" onClick={handleContinue}>
        Continue
      </button>
    </FlowCenterShell>
  )
}

export default RoleStep
