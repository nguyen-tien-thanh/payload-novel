'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

type User = {
  id: string
  email: string
  name?: string
  avatarUrl?: string
  role?: 'admin' | 'user'
}

type AuthContextType = {
  user: User | null
  loading: boolean
  refresh: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refresh: async () => {},
  logout: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/users/me?depth=1', {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        const u = data.user
        if (u) {
          setUser({ ...u, avatarUrl: u.avatar?.url ?? undefined, role: u.role })
        } else {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    await fetch('/api/users/logout', { method: 'POST', credentials: 'include' })
    setUser(null)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
