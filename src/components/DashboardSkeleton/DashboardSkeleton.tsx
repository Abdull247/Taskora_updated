import './DashboardSkeleton.css'

function DashboardSkeleton() {
  return (
    <div className="dashboard-main dash-skeleton" aria-busy="true" aria-label="Loading dashboard">
      {/* Greeting */}
      <div className="skel-greeting">
        <div className="skel skel-text skel-greeting-title" />
        <div className="skel skel-text skel-greeting-sub" />
      </div>

      {/* Balance card */}
      <div className="skel-balance-card">
        <div className="skel-balance-card-top">
          <div className="skel-balance-card-left">
            <div className="skel skel-text skel-balance-label" />
            <div className="skel skel-text skel-balance-value" />
            <div className="skel skel-text skel-balance-pending" />
          </div>
          <div className="skel skel-balance-icon" />
        </div>
        <div className="skel-balance-actions">
          <div className="skel skel-balance-btn" />
          <div className="skel skel-balance-btn" />
        </div>
      </div>

      {/* Stats row */}
      <div className="stats-row">
        {[0, 1].map((i) => (
          <div key={i} className="skel-stat-card">
            <div className="skel-stat-card-top">
              <div className="skel skel-text skel-stat-label" />
              <div className="skel skel-stat-icon" />
            </div>
            <div className="skel skel-text skel-stat-value" />
            <div className="skel skel-text skel-stat-delta" />
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="dash-section">
        <div className="skel skel-text skel-section-label" />
        <div className="quick-actions-grid">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skel-quick-action-card">
              <div className="skel skel-quick-action-icon" />
              <div className="skel skel-text skel-quick-action-label" />
            </div>
          ))}
        </div>
      </div>

      {/* Recommended tasks */}
      <div className="dash-section">
        <div className="dash-section-header">
          <div className="skel skel-text skel-section-label" />
          <div className="skel skel-text skel-section-link" />
        </div>
        <div className="task-list">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skel-task-card">
              <div className="skel-task-card-top">
                <div className="skel skel-task-tag" />
                <div className="skel skel-text skel-task-reward" />
              </div>
              <div className="skel skel-text skel-task-title" />
              <div className="skel skel-text skel-task-title skel-task-title-short" />
              <div className="skel-task-meta">
                <div className="skel skel-text skel-task-meta-item" />
                <div className="skel skel-text skel-task-meta-item" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent earnings */}
      <div className="dash-section">
        <div className="dash-section-header">
          <div className="skel skel-text skel-section-label" />
          <div className="skel skel-text skel-section-link" />
        </div>
        <div className="earnings-list">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skel-earnings-row">
              <div className="skel skel-earnings-icon" />
              <div className="skel-earnings-info">
                <div className="skel skel-text skel-earnings-title" />
                <div className="skel skel-text skel-earnings-subtitle" />
              </div>
              <div className="skel-earnings-amount-wrap">
                <div className="skel skel-text skel-earnings-amount" />
                <div className="skel skel-text skel-earnings-when" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardSkeleton
