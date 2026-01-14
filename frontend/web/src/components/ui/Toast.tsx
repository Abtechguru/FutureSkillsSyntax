import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface ToastProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  onClose: (id: string) => void
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  }

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }

  const Icon = icons[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={cn(
        'fixed bottom-4 right-4 z-50 w-80 rounded-lg border p-4 shadow-lg',
        colors[type]
      )}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className="h-5 w-5" />
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium">{title}</p>
          <p className="mt-1 text-sm opacity-90">{message}</p>
        </div>
        <div className="ml-4 flex flex-shrink-0">
          <button
            type="button"
            className="inline-flex rounded-md opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
            onClick={() => onClose(id)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

interface ToastContainerProps {
  toasts: ToastProps[]
  onClose: (id: string) => void
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <AnimatePresence>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </AnimatePresence>
  )
}

export default Toast