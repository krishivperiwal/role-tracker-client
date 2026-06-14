import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import api from '../api/axios'

function CreateIssue() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const watchTitle = watch('title', '')
  const watchDescription = watch('description', '')

  async function onSubmit(data) {
    setError('')
    try {
      const res = await api.post('/issues', data)
      navigate(`/issue/${res.data._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create issue')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-8 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">New issue</p>
          <h1 className="text-2xl font-bold">Create a clear issue record</h1>
          <p className="text-sm text-gray-500">Write enough context for someone else to pick this up without asking what the issue actually means.</p>
        </div>
        <Link
          to="/dashboard"
          className="border px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
        >
          Back to dashboard
        </Link>
      </header>

      <main className="px-8 py-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-white rounded-xl border p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Issue title</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  placeholder="Short, specific summary"
                  {...register('title', { required: 'Title is required' })}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={6}
                  placeholder="What happened, what should happen, and any important context"
                  {...register('description', { required: 'Description is required' })}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create issue'}
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Preview</p>
              <h2 className="text-lg font-bold mb-2">
                {watchTitle.trim() || 'Your issue title will appear here'}
              </h2>
              <p className="text-sm text-gray-500">
                {watchDescription.trim() || 'A concise problem statement helps the dashboard stay readable and makes assignment easier.'}
              </p>
            </div>

            <div className="bg-white rounded-xl border p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Writing tips</p>
              <ul className="space-y-2 text-sm text-gray-500 list-disc list-inside">
                <li>Lead with the user-visible problem or system failure.</li>
                <li>Include enough context for assignment and triage.</li>
                <li>Save implementation ideas for comments if the problem statement should stay neutral.</li>
              </ul>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default CreateIssue