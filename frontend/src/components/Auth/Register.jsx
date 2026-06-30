// components/Auth/Register.jsx
// Register form — name + email + password → create account + get JWT token

import { useState } from 'react'
import client from '../../api/client'
import { useAuth } from '../../context/AuthContext'

const Register = ({ onSwitch }) => {
  const { login } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all fields')
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      const res = await client.post('/auth/register', form)
      login(res.data.user, res.data.token)
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
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
        <h1 className="text-white text-xl font-medium mb-1">Create account</h1>
        <p className="text-[#666] text-sm mb-6">Start chatting with AI today</p>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-3 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Name */}
        <div className="mb-4">
          <label className="text-[#888] text-[11px] uppercase tracking-wide block mb-1.5">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Justice"
            className="w-full bg-[#222] border border-[#333] rounded-lg px-3 py-2.5 text-[#ddd] text-sm outline-none focus:border-[#7c6af7] transition-colors"
          />
        </div>

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
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        {/* Switch to login */}
        <p className="text-center text-[#666] text-xs mt-4">
          Already have an account?{' '}
          <span
            onClick={onSwitch}
            className="text-[#7c6af7] cursor-pointer hover:underline"
          >
            Sign in
          </span>
        </p>

      </div>
    </div>
  )
}

export default Register