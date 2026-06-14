import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

function Signup() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const { login, user } = useAuth()
  const navigate = useNavigate()

  if (user) {
    navigate('/dashboard')
    return null
  }

  async function onSubmit(data) {
    try {
      const res = await api.post('/auth/signup', data)
      login(res.data.token, res.data.name)
      navigate('/dashboard')
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed')
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex w-1/2 text-white flex-col justify-center px-16" style={{ background: 'linear-gradient(160deg, rgba(194,65,12,0.95), rgba(154,52,18,0.92))' }}>
        <p className="text-sm font-semibold uppercase tracking-widest mb-4">New workspace</p>
        <h1 className="text-4xl font-bold mb-4">Start with a clean issue workflow.</h1>
        <p className="text-orange-200 mb-6">Create an account to manage issue intake, assignment, status updates, and comments from a single interface.</p>
        <ul className="space-y-2 text-orange-100 text-sm list-disc list-inside">
          <li>Capture issue titles and descriptions clearly from the start.</li>
          <li>Route work to teammates with assignment support.</li>
          <li>Keep status changes and discussion visible on each issue page.</li>
        </ul>
      </div>

      <div className="flex w-full md:w-1/2 items-center justify-center px-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-1">Create your account</h2>
          <p className="text-gray-500 mb-6">Set up access in under a minute.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full name</label>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                type="text"
                placeholder="Your full name"
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                type="email"
                placeholder="you@example.com"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                type="password"
                placeholder="Minimum 6 characters"
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              className="w-full bg-orange-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-orange-700 disabled:opacity-50"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>

            <p className="text-sm text-center text-gray-500">
              Already have an account?{' '}
              <Link className="text-orange-600 font-medium hover:underline" to="/login">Back to login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup