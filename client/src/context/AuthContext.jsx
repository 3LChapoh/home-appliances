import { createContext, useContext, useEffect, useState } from 'react'
import { loginUser, registerUser, fetchMe } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ready

  useEffect(() => {
    const token = localStorage.getItem('rc_token')
    if (!token) {
      setStatus('ready')
      return
    }

    fetchMe()
      .then((data) => setUser(data))
      .catch(() => {
        localStorage.removeItem('rc_token')
      })
      .finally(() => setStatus('ready'))
  }, [])

  async function login(email, password) {
    const data = await loginUser({ email, password })
    localStorage.setItem('rc_token', data.token)
    setUser(data)
    return data
  }

  async function register(payload) {
    const data = await registerUser(payload)
    localStorage.setItem('rc_token', data.token)
    setUser(data)
    return data
  }

  function logout() {
    localStorage.removeItem('rc_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, status, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
