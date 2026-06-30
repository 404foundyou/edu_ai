// components/Auth/Login.jsx
// Login form — email + password → get JWT token

import { useState } from 'react'
import client from '../../api/client'
import { useAuth } from '../../context/AuthContext'

const Login = ({ onSwitch }) => {
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const res = await client.post('/auth/login', form)
      login(res.data.user, res.data.token)
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center">
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 w-[340px]">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2.5 h-2.5 rounded-full bg-[#7c6af7]"></div>
          <span className="text-white text-base font-medium">edu_ai</span>
        </div>

        {/* Title */}
        <h1 className="text-white text-xl font-medium mb-1">Welcome back</h1>
        <p className="text-[#666] text-sm mb-6">Sign in to continue</p>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-3 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="text-[#888] text-[11px] uppercase tracking-wide block mb-1.5">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full bg-[#222] border border-[#333] rounded-lg px-3 py-2.5 text-[#ddd] text-sm outline-none focus:border-[#7c6af7] transition-colors"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-[#888] text-[11px] uppercase tracking-wide block mb-1.5">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full bg-[#222] border border-[#333] rounded-lg px-3 py-2.5 text-[#ddd] text-sm outline-none focus:border-[#7c6af7] transition-colors"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#7c6af7] hover:bg-[#6a5ae0] text-white text-sm font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        {/* Switch to register */}
        <p className="text-center text-[#666] text-xs mt-4">
          No account?{' '}
          <span
            onClick={onSwitch}
            className="text-[#7c6af7] cursor-pointer hover:underline"
          >
            Create one
          </span>
        </p>

      </div>
    </div>
  )
}

export default Login