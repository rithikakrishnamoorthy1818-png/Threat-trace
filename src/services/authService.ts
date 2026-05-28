import type { AuthUser } from '../context/AuthContext'

const TOKEN_KEY = 'tt_token'
const USER_KEY = 'tt_user'

function sleep(ms: number) {
  return new Promise((r) => window.setTimeout(r, ms))
}

function makeUser(email: string, name?: string): AuthUser {
  return {
    id: crypto.randomUUID(),
    name: name ?? 'Analyst',
    email,
    role: email.toLowerCase().includes('admin') ? 'admin' : 'analyst',
  }
}

export const authService = {
  getSession(): { user: AuthUser | null; token: string | null } {
    const token = localStorage.getItem(TOKEN_KEY)
    const rawUser = localStorage.getItem(USER_KEY)
    const user = rawUser ? (JSON.parse(rawUser) as AuthUser) : null
    if (!token || !user) return { user: null, token: null }
    return { user, token }
  },

  async login(email: string, password: string) {
    await sleep(650)
    if (password.length < 1) throw new Error('Invalid credentials')
    const token = `stub.${crypto.randomUUID()}.token`
    const user = makeUser(email)
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    return { token, user }
  },

  async signup(name: string, email: string, password: string) {
    await sleep(750)
    if (password.length < 8) throw new Error('Weak password')
    const token = `stub.${crypto.randomUUID()}.token`
    const user = makeUser(email, name)
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    return { token, user }
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },
}

