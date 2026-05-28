import { useToast } from '../components/common/Toast'

export function useNotification() {
  const toast = useToast()
  return {
    success: (title: string, message?: string) =>
      toast.push(message ? { title, message, tone: 'success' } : { title, tone: 'success' }),
    info: (title: string, message?: string) =>
      toast.push(message ? { title, message, tone: 'info' } : { title, tone: 'info' }),
    warning: (title: string, message?: string) =>
      toast.push(message ? { title, message, tone: 'warning' } : { title, tone: 'warning' }),
    error: (title: string, message?: string) =>
      toast.push(message ? { title, message, tone: 'error' } : { title, tone: 'error' }),
  }
}

