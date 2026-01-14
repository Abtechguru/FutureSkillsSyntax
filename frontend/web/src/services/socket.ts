import { io, Socket } from 'socket.io-client'

class SocketService {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private store: any = null

  connect() {
    const token = this.store?.getState()?.auth?.accessToken

    if (!token) {
      console.error('No authentication token available')
      return
    }

    this.socket = io(import.meta.env.VITE_WS_URL || 'ws://localhost:8000', {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    })

    this.setupEventListeners()
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.reconnectAttempts = 0
    }
  }

  private setupEventListeners() {
    if (!this.socket) return

    this.socket.on('connect', () => {
      console.log('Socket connected')
      this.reconnectAttempts = 0
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)

      this.reconnectAttempts++
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached')
        this.disconnect()
      }
    })

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
    })

    // Custom event listeners
    this.socket.on('notification', (data) => {
      this.handleNotification(data)
    })

    this.socket.on('mentorship_session_update', (data) => {
      this.handleMentorshipSessionUpdate(data)
    })

    this.socket.on('gamification_update', (data) => {
      this.handleGamificationUpdate(data)
    })

    this.socket.on('chat_message', (data) => {
      this.handleChatMessage(data)
    })
  }

  // Event handlers
  private handleNotification(data: any) {
    // Dispatch to store or show toast
    console.log('New notification:', data)
  }

  private handleMentorshipSessionUpdate(data: any) {
    console.log('Mentorship session update:', data)
  }

  private handleGamificationUpdate(data: any) {
    console.log('Gamification update:', data)
  }

  private handleChatMessage(data: any) {
    console.log('Chat message:', data)
  }

  // Emit methods
  emit(event: string, data?: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data)
    } else {
      console.error('Socket not connected')
    }
  }

  // Subscribe to events
  subscribe(event: string, callback: (data: any) => void) {
    this.socket?.on(event, callback)
  }

  // Unsubscribe from events
  unsubscribe(event: string, callback?: (data: any) => void) {
    if (callback) {
      this.socket?.off(event, callback)
    } else {
      this.socket?.off(event)
    }
  }

  // Check connection status
  isConnected(): boolean {
    return this.socket?.connected || false
  }

  // Get socket instance
  getSocket(): Socket | null {
    return this.socket
  }

  injectStore(store: any) {
    this.store = store
  }
}

const socketService = new SocketService()
export const injectStore = (store: any) => {
  socketService.injectStore(store)
}

export default socketService