import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { authService } from '../services/authService'

export type AuthUser = {
  id: string
  name: string
  email: string
  role: 'analyst' | 'admin'
}

type AuthState = {
  user: AuthUser | null
  token: string | null
  loading: boolean
}

type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const session = authService.getSession()
    return { user: session.user, token: session.token, loading: false }
  })

  const login = useCallback(async (email: string, password: string) => {
    setState((s) => ({ ...s, loading: true }))
    const session = await authService.login(email, password)
    setState({ user: session.user, token: session.token, loading: false })
  }, [])

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      setState((s) => ({ ...s, loading: true }))
      const session = await authService.signup(name, email, password)
      setState({ user: session.user, token: session.token, loading: false })
    },
    [],
  )

  const logout = useCallback(() => {
    authService.logout()
    setState({ user: null, token: null, loading: false })
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, login, signup, logout }),
    [state, login, signup, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}

