import './TaskDetailsSkeleton.css'

function TaskDetailsSkeleton() {
  return (
    <div className="td-skeleton" aria-busy="true" aria-label="Loading task details">
      <div className="td-skel-hero">
        <div className="td-skel-tag-row">
          <div className="skel skel-td-tag" />
          <div className="skel skel-td-tag" />
          <div className="skel skel-td-tag" />
        </div>
        <div className="skel skel-td-title" />
        <div className="skel skel-td-title skel-td-title-short" />
        <div className="skel skel-td-reward" />
        <div className="skel skel-td-meta-line" />
        <div className="skel skel-td-cta" />
      </div>

      <div className="td-skel-section">
        <div className="skel skel-td-section-label" />
        <div className="td-skel-card">
          <div className="skel skel-td-body" />
          <div className="skel skel-td-body skel-td-body-short" />
        </div>
      </div>

      <div className="td-skel-section">
        <div className="skel skel-td-section-label" />
        <div className="td-skel-card">
          <div className="td-skel-step">
            <div className="skel skel-td-step-num" />
            <div className="skel skel-td-body" />
          </div>
          <div className="td-skel-step">
            <div className="skel skel-td-step-num" />
            <div className="skel skel-td-body" />
          </div>
          <div className="td-skel-step">
            <div className="skel skel-td-step-num" />
            <div className="skel skel-td-body skel-td-body-short" />
          </div>
        </div>
      </div>

      <div className="td-skel-section">
        <div className="skel skel-td-section-label" />
        <div className="td-skel-card">
          <div className="td-skel-row">
            <div className="skel skel-td-icon" />
            <div className="skel skel-td-body skel-td-body-short" />
          </div>
          <div className="td-skel-row">
            <div className="skel skel-td-icon" />
            <div className="skel skel-td-body skel-td-body-short" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskDetailsSkeleton
