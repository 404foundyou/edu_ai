// pages/AuthPage.jsx
// Switches between Login and Register components

import { useState } from 'react'
import Login from '../components/Auth/Login'
import Register from '../components/Auth/Register'

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)

  return isLogin
    ? <Login onSwitch={() => setIsLogin(false)} />
    : <Register onSwitch={() => setIsLogin(true)} />
}

export default AuthPage