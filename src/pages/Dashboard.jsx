import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [issues, setIssues] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchIssues()
  }, [statusFilter])

  async function fetchIssues() {
    setLoading(true)
    setError('')
    try {
      const query = statusFilter ? `?status=${statusFilter}` : ''
      const res = await api.get(`/issues${query}`)
      setIssues(res.data)
    } catch (err) {
      if (err.response?.status === 401) {
        logout()
        navigate('/login')
      }
      setError(err.response?.data?.message || 'Failed to load issues')
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const filteredIssues = issues.filter(issue => {
    const searchTerm = search.toLowerCase()
    return (
      issue.title?.toLowerCase().includes(searchTerm) ||
      issue.description?.toLowerCase().includes(searchTerm) ||
      issue.assignedTo?.name?.toLowerCase().includes(searchTerm) ||
      issue.createdBy?.name?.toLowerCase().includes(searchTerm)
    )
  })

  const openCount = issues.filter(i => i.status === 'open').length
  const progressCount = issues.filter(i => i.status === 'in-progress').length
  const closedCount = issues.filter(i => i.status === 'closed').length

  function getStatusColor(status) {
    if (status === 'open') return 'bg-blue-100 text-blue-700'
    if (status === 'in-progress') return 'bg-yellow-100 text-yellow-700'
    if (status === 'closed') return 'bg-green-100 text-green-700'
    return 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-8 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Workspace overview</p>
          <h1 className="text-2xl font-bold">Issue Dashboard</h1>
          <p className="text-sm text-gray-500">{user?.name}, here is the current issue queue across your visible work.</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/create-issue"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
          >
            Create Issue
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="px-8 py-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Visible issues', value: filteredIssues.length },
            { label: 'Open', value: openCount },
            { label: 'In progress', value: progressCount },
            { label: 'Closed', value: closedCount },
          ].map(card => (
            <div key={card.label} className="bg-white rounded-xl border p-4">
              <p className="text-xs text-gray-400 uppercase tracking-widest">{card.label}</p>
              <p className="text-3xl font-bold mt-1">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border p-4">
          <div className="flex gap-3 mb-4">
            <input
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="search"
              placeholder="Search by title, description, assignee, or creator"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">All statuses</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
            <button
              onClick={fetchIssues}
              className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
            >
              Refresh
            </button>
            <button
              onClick={() => { setSearch(''); setStatusFilter('') }}
              className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
            >
              Clear
            </button>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {loading ? (
            <p className="text-gray-400 text-sm text-center py-8">Loading issues...</p>
          ) : filteredIssues.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No issues match the current search or filter.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIssues.map(issue => (
                <div key={issue._id} className="border rounded-xl p-4 hover:shadow-sm transition">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(issue.status)}`}>
                    {issue.status}
                  </span>
                  <h3 className="font-semibold mt-2 mb-1">{issue.title}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{issue.description}</p>
                  <div className="text-xs text-gray-400 mb-3 space-y-1">
                    <p>Assigned: {issue.assignedTo?.name || 'Unassigned'}</p>
                    <p>Created by: {issue.createdBy?.name || 'Unknown'}</p>
                  </div>
                  <Link
                    to={`/issue/${issue._id}`}
                    className="text-sm text-blue-600 font-medium hover:underline"
                  >
                    View details →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard