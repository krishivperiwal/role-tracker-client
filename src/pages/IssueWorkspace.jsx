import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

function IssueWorkspace() {
  const { id } = useParams()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [issue, setIssue] = useState(null)
  const [users, setUsers] = useState([])
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm()
  const { register: registerComment, handleSubmit: handleCommentSubmit, reset: resetComment, formState: { isSubmitting: isPostingComment } } = useForm()

  useEffect(() => {
    initPage()
  }, [id])

  async function initPage() {
    setLoading(true)
    setError('')
    try {
      await Promise.all([fetchIssue(), fetchUsers(), fetchComments()])
    } catch (err) {
      setError('Failed to load page data')
    } finally {
      setLoading(false)
    }
  }

  async function fetchIssue() {
    try {
      const res = await api.get('/issues')
      const found = res.data.find(i => i._id === id)
      if (!found) {
        setError('Issue not found or you do not have access.')
        return
      }
      setIssue(found)
      reset({
        title: found.title,
        description: found.description,
        status: found.status,
        assignedTo: found.assignedTo?._id || ''
      })
    } catch (err) {
      if (err.response?.status === 401) { logout(); navigate('/login') }
      throw err
    }
  }

  async function fetchUsers() {
    try {
      const res = await api.get('/auth/users')
      setUsers(res.data)
    } catch (err) {
      if (err.response?.status === 401) { logout(); navigate('/login') }
      throw err
    }
  }

  async function fetchComments() {
    try {
      const res = await api.get(`/issues/${id}/comments`)
      setComments(res.data)
    } catch (err) {
      if (err.response?.status === 401) { logout(); navigate('/login') }
      throw err
    }
  }

  async function onUpdateIssue(data) {
    setError('')
    setSuccessMsg('')
    try {
      const res = await api.put(`/issues/${id}`, data)
      setIssue(res.data)
      setSuccessMsg('Issue updated successfully.')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update issue')
    }
  }

  async function onPostComment(data) {
    setError('')
    setSuccessMsg('')
    try {
      await api.post(`/issues/${id}/comments`, data)
      resetComment()
      setSuccessMsg('Comment added.')
      await fetchComments()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post comment')
    }
  }

  async function onDeleteComment(commentId) {
    setError('')
    setSuccessMsg('')
    try {
      await api.delete(`/issues/comments/${commentId}`)
      setSuccessMsg('Comment deleted.')
      await fetchComments()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete comment')
    }
  }

  function getStatusColor(status) {
    if (status === 'open') return 'bg-blue-100 text-blue-700'
    if (status === 'in-progress') return 'bg-yellow-100 text-yellow-700'
    if (status === 'closed') return 'bg-green-100 text-green-700'
    return 'bg-gray-100 text-gray-700'
  }

  function canDeleteComment(comment) {
    if (!user) return false
    const decoded = JSON.parse(atob(user.token.split('.')[1]))
    return decoded.role === 'admin' || decoded.id === comment.createdBy?._id
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">
      Loading issue...
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-8 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Issue detail</p>
          <h1 className="text-2xl font-bold">Issue workspace</h1>
          <p className="text-sm text-gray-500">Update the issue record, adjust assignment or status, and manage the discussion thread.</p>
        </div>
        <Link to="/dashboard" className="border px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
          Back to dashboard
        </Link>
      </header>

      <main className="px-8 py-6 max-w-6xl mx-auto">
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {successMsg && <p className="text-green-600 text-sm mb-4">{successMsg}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs text-gray-400">Issue ID: {id}</span>
                {issue && (
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(issue.status)}`}>
                    {issue.status}
                  </span>
                )}
              </div>

              <form onSubmit={handleSubmit(onUpdateIssue)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    {...register('title', { required: 'Title is required' })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={4}
                    {...register('description', { required: 'Description is required' })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register('status')}
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Assign to</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register('assignedTo')}
                  >
                    <option value="">Unassigned</option>
                    {users.map(u => (
                      <option key={u._id} value={u._id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save changes'}
                  </button>
                  <button
                    className="flex-1 border py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
                    type="button"
                    onClick={() => reset({
                      title: issue.title,
                      description: issue.description,
                      status: issue.status,
                      assignedTo: issue.assignedTo?._id || ''
                    })}
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-xl border p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Discussion</p>
              <h2 className="text-lg font-bold mb-4">Comments</h2>

              <div className="space-y-4 mb-6">
                {comments.length === 0 ? (
                  <p className="text-sm text-gray-400">No comments yet. Add the first update or decision for this issue.</p>
                ) : (
                  comments.map(comment => (
                    <div key={comment._id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm font-semibold">{comment.createdBy?.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</p>
                        </div>
                        {canDeleteComment(comment) && (
                          <button
                            onClick={() => onDeleteComment(comment._id)}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{comment.text}</p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleCommentSubmit(onPostComment)} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Add comment</label>
                  <textarea
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                    placeholder="Share context, blockers, or next steps"
                    {...registerComment('text', { required: true })}
                  />
                </div>
                <button
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 disabled:opacity-50"
                  type="submit"
                  disabled={isPostingComment}
                >
                  {isPostingComment ? 'Posting...' : 'Post comment'}
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-4">
            {issue && (
              <div className="bg-white rounded-xl border p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Current issue</p>
                <h2 className="text-lg font-bold mb-2">{issue.title}</h2>
                <p className="text-sm text-gray-500 mb-4">{issue.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status</span>
                    <strong>{issue.status}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Assigned to</span>
                    <strong>{issue.assignedTo?.name || 'Unassigned'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Created by</span>
                    <strong>{issue.createdBy?.name || 'Unknown'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Updated</span>
                    <strong>{new Date(issue.updatedAt).toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Workflow notes</p>
              <ul className="space-y-2 text-sm text-gray-500 list-disc list-inside">
                <li>Use status updates to reflect current execution, not final intent.</li>
                <li>Assign an owner only when that person can act on the issue.</li>
                <li>Keep comments focused on decisions, blockers, or evidence.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default IssueWorkspace