import './BrowseTasksSkeleton.css'

interface BrowseTasksSkeletonProps {
  showChips?: boolean
}

function BrowseTasksSkeleton({ showChips = true }: BrowseTasksSkeletonProps) {
  return (
    <div className="browse-skeleton" aria-busy="true" aria-label="Loading tasks">
      {showChips && (
        <div className="browse-chip-row browse-chip-row-skel">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="skel skel-chip" />
          ))}
        </div>
      )}

      <div className="task-list">
        {[0, 1, 2, 3].map((i) => (
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
              <div className="skel skel-text skel-task-meta-item" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BrowseTasksSkeleton
