import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2'
import DashboardTopbar from '../../components/DashboardTopbar/DashboardTopbar'
import BottomNav from '../../components/BottomNav/BottomNav'
import BrowseTasksSkeleton from '../../components/BrowseTasksSkeleton/BrowseTasksSkeleton'
import { getTaskCategories, getTasks } from '../../lib/tasks'
import { ApiRequestError } from '../../lib/api'
import type { TaskCategoryItem, TaskListItem } from '../../types/api'
import './BrowseTasksPage.css'

const ALL_CHIP_ID = 'all'

function formatNaira(kobo: number) {
  const naira = kobo / 100
  return `₦${naira.toLocaleString('en-NG', {
    minimumFractionDigits: naira % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`
}

function categoryLabel(name: string) {
  return name
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function difficultyFromReward(rewardKobo: number): 'Easy' | 'Medium' | 'Hard' {
  const naira = rewardKobo / 100
  if (naira < 100) return 'Easy'
  if (naira < 300) return 'Medium'
  return 'Hard'
}

function difficultyClass(difficulty: 'Easy' | 'Medium' | 'Hard') {
  if (difficulty === 'Easy') return 'task-diff-easy'
  if (difficulty === 'Medium') return 'task-diff-medium'
  return 'task-diff-hard'
}

function timeLeftLabel(expiresAt: string) {
  const diffMs = new Date(expiresAt).getTime() - Date.now()
  if (diffMs <= 0) return 'Expired'
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (days >= 1) return `${days}d left`
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  if (hours >= 1) return `${hours}h left`
  const minutes = Math.max(1, Math.floor(diffMs / (1000 * 60)))
  return `${minutes}m left`
}

function BrowseTasksPage() {
  const navigate = useNavigate()

  const [categories, setCategories] = useState<TaskCategoryItem[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoriesError, setCategoriesError] = useState<string | null>(null)

  const [activeCategoryId, setActiveCategoryId] = useState<string>(ALL_CHIP_ID)

  const [tasks, setTasks] = useState<TaskListItem[]>([])
  const [tasksLoading, setTasksLoading] = useState(true)
  const [tasksError, setTasksError] = useState<string | null>(null)

  const [query, setQuery] = useState('')

  const loadCategories = useCallback(async () => {
    setCategoriesLoading(true)
    setCategoriesError(null)
    try {
      const { categories: cats } = await getTaskCategories()
      setCategories(cats)
    } catch {
      setCategoriesError('Could not load categories.')
    } finally {
      setCategoriesLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  const loadTasks = useCallback(() => {
    let cancelled = false
    setTasksLoading(true)
    setTasksError(null)

    getTasks({
      limit: 30,
      categoryId: activeCategoryId === ALL_CHIP_ID ? undefined : activeCategoryId,
    })
      .then(({ tasks: fetched }) => {
        if (!cancelled) setTasks(fetched)
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof ApiRequestError && err.status === 401) {
          navigate('/login', { replace: true })
          return
        }
        setTasksError('Could not load tasks. Pull down to try again.')
      })
      .finally(() => {
        if (!cancelled) setTasksLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [activeCategoryId, navigate])

  useEffect(() => {
    const cancel = loadTasks()
    return cancel
  }, [loadTasks])

  const filteredTasks = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return tasks
    return tasks.filter((task) => task.job_description.toLowerCase().includes(q))
  }, [tasks, query])

  const showInitialSkeleton = categoriesLoading && tasksLoading

  return (
    <div className="browse-page">
      <DashboardTopbar initials="··" hasNotifications />

      <div className="browse-sticky-zone">
        <div className="browse-heading">
          <h1>Browse Tasks</h1>
          <p>
            {tasksLoading
              ? 'Loading tasks…'
              : `${filteredTasks.length} task${filteredTasks.length === 1 ? '' : 's'} available`}
          </p>
        </div>

        <div className="browse-search-wrap">
          <HiOutlineMagnifyingGlass className="browse-search-icon" />
          <input
            type="text"
            className="browse-search-input"
            placeholder="Search tasks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {categoriesLoading ? (
          <div className="browse-chip-row browse-chip-row-skel-inline">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="skel skel-chip" />
            ))}
          </div>
        ) : categoriesError ? (
          <div className="browse-chip-error">
            <span>{categoriesError}</span>
            <button type="button" onClick={loadCategories}>Retry</button>
          </div>
        ) : (
          <div className="browse-chip-row">
            <button
              type="button"
              className={`browse-chip ${activeCategoryId === ALL_CHIP_ID ? 'browse-chip-active' : ''}`}
              onClick={() => setActiveCategoryId(ALL_CHIP_ID)}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.categoryId}
                type="button"
                className={`browse-chip ${activeCategoryId === cat.categoryId ? 'browse-chip-active' : ''}`}
                onClick={() => setActiveCategoryId(cat.categoryId)}
              >
                {categoryLabel(cat.category)}
              </button>
            ))}
          </div>
        )}
      </div>

      <main className="browse-main">
        {showInitialSkeleton ? (
          <BrowseTasksSkeleton showChips={false} />
        ) : tasksLoading ? (
          <BrowseTasksSkeleton showChips={false} />
        ) : tasksError ? (
          <div className="browse-empty">
            <p>{tasksError}</p>
            <button type="button" className="browse-retry-btn" onClick={loadTasks}>
              Retry
            </button>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="browse-empty">
            <p>No tasks match your search.</p>
          </div>
        ) : (
          <div className="task-list">
            {filteredTasks.map((task) => {
              const rewardKobo = Number(task.worker_earn_kobo)
              const difficulty = difficultyFromReward(rewardKobo)
              return (
                <div key={task.id} className="task-card">
                  <div className="task-card-top">
                    <div className="task-tags">
                      <span className="task-tag task-tag-category">
                        {categoryLabel(task.category_name)}
                      </span>
                    </div>
                    <span className="task-reward">{formatNaira(rewardKobo)}</span>
                  </div>

                  <h3 className="task-title">{task.job_description}</h3>

                  <div className="task-meta">
                    <span className={difficultyClass(difficulty)}>{difficulty}</span>
                    <span>{task.spots_remaining} spot{task.spots_remaining === 1 ? '' : 's'} left</span>
                    <span>{timeLeftLabel(task.expires_at)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}

export default BrowseTasksPage
