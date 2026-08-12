import { useMemo, useState } from 'react'
import {
  HiOutlineMagnifyingGlass,
  HiStar,
} from 'react-icons/hi2'
import DashboardTopbar from '../../components/DashboardTopbar/DashboardTopbar'
import BottomNav from '../../components/BottomNav/BottomNav'
import './BrowseTasksPage.css'

interface TaskItem {
  id: string
  category: string
  verified: boolean
  reward: number
  title: string
  duration: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  slotsLeft: number
  rating: number
}

const allTasks: TaskItem[] = [
  {
    id: '1',
    category: 'Social Media',
    verified: true,
    reward: 150,
    title: 'Follow @OfficialMTN on Instagram and like their latest 3 posts',
    duration: '5 mins',
    difficulty: 'Easy',
    slotsLeft: 48,
    rating: 4.8,
  },
  {
    id: '2',
    category: 'App Download',
    verified: true,
    reward: 300,
    title: 'Download KliqPay app, create an account and complete profile setup',
    duration: '10 mins',
    difficulty: 'Easy',
    slotsLeft: 120,
    rating: 4.9,
  },
  {
    id: '3',
    category: 'Review',
    verified: false,
    reward: 200,
    title: 'Write a genuine Google Play review for Opay (min. 50 words)',
    duration: '8 mins',
    difficulty: 'Medium',
    slotsLeft: 30,
    rating: 4.7,
  },
  {
    id: '4',
    category: 'Social Media',
    verified: true,
    reward: 100,
    title: 'Subscribe to a YouTube channel and turn on notifications',
    duration: '3 mins',
    difficulty: 'Easy',
    slotsLeft: 75,
    rating: 4.6,
  },
  {
    id: '5',
    category: 'Survey',
    verified: true,
    reward: 250,
    title: 'Complete a 5-minute survey about mobile banking habits',
    duration: '5 mins',
    difficulty: 'Medium',
    slotsLeft: 60,
    rating: 4.5,
  },
  {
    id: '6',
    category: 'App Download',
    verified: false,
    reward: 350,
    title: 'Install PiggyVest, verify your BVN and fund your wallet with ₦1,000',
    duration: '15 mins',
    difficulty: 'Hard',
    slotsLeft: 18,
    rating: 4.4,
  },
]

const categories = ['All', 'Social Media', 'App Download', 'Review', 'Survey']

function formatNaira(value: number) {
  return `₦${value.toLocaleString('en-NG')}`
}

function difficultyClass(difficulty: TaskItem['difficulty']) {
  if (difficulty === 'Easy') return 'task-diff-easy'
  if (difficulty === 'Medium') return 'task-diff-medium'
  return 'task-diff-hard'
}

function BrowseTasksPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [query, setQuery] = useState('')

  const filteredTasks = useMemo(() => {
    return allTasks.filter((task) => {
      const matchesCategory = activeCategory === 'All' || task.category === activeCategory
      const matchesQuery = task.title.toLowerCase().includes(query.trim().toLowerCase())
      return matchesCategory && matchesQuery
    })
  }, [activeCategory, query])

  return (
    <div className="browse-page">
      <DashboardTopbar initials="CE" hasNotifications />

      <div className="browse-sticky-zone">
        <div className="browse-heading">
          <h1>Browse Tasks</h1>
          <p>{filteredTasks.length} task{filteredTasks.length === 1 ? '' : 's'} available</p>
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

        <div className="browse-chip-row">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`browse-chip ${activeCategory === cat ? 'browse-chip-active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <main className="browse-main">
        {filteredTasks.length === 0 ? (
          <div className="browse-empty">
            <p>No tasks match your search.</p>
          </div>
        ) : (
          <div className="task-list">
            {filteredTasks.map((task) => (
              <div key={task.id} className="task-card">
                <div className="task-card-top">
                  <div className="task-tags">
                    <span className="task-tag task-tag-category">{task.category}</span>
                    {task.verified && <span className="task-tag task-tag-verified">Verified</span>}
                  </div>
                  <span className="task-reward">{formatNaira(task.reward)}</span>
                </div>

                <h3 className="task-title">{task.title}</h3>

                <div className="task-meta">
                  <span>{task.duration}</span>
                  <span className={difficultyClass(task.difficulty)}>{task.difficulty}</span>
                  <span>{task.slotsLeft} slots left</span>
                  <span className="task-rating">
                    <HiStar /> {task.rating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}

export default BrowseTasksPage
