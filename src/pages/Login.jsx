import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const { login, user } = useAuth()
  const navigate = useNavigate()

  if (user) {
    navigate('/dashboard')
    return null
  }

  async function onSubmit(data) {
    try {
      const res = await api.post('/auth/login', data)
      login(res.data.token, res.data.name)
      navigate('/dashboard')
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex w-1/2 bg-blue-700 text-white flex-col justify-center px-16">
        <p className="text-sm font-semibold uppercase tracking-widest mb-4">Mini Issue Tracker</p>
        <h1 className="text-4xl font-bold mb-4">Track work without losing the details.</h1>
        <p className="text-blue-200 mb-6">Review your queue, assign owners, update issue status, and manage comments from a clearer workspace.</p>
        <ul className="space-y-2 text-blue-100 text-sm list-disc list-inside">
          <li>See open, in-progress, and closed issues from one dashboard.</li>
          <li>Assign work quickly and keep comment threads attached to each issue.</li>
          <li>Update title, description, status, and assignee in one place.</li>
        </ul>
      </div>

      <div className="flex w-full md:w-1/2 items-center justify-center px-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-1">Welcome back</h2>
          <p className="text-gray-500 mb-6">Sign in to continue to your dashboard.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="email"
                placeholder="you@example.com"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="password"
                placeholder="Enter your password"
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>

            <p className="text-sm text-center text-gray-500">
              Don't have an account?{' '}
              <Link className="text-blue-600 font-medium hover:underline" to="/signup">Create account</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login