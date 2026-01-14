import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { store } from '@/store/store'
import { logout, refreshToken } from '@/store/slices/authSlice'
import { toast } from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

class ApiService {
  private api: AxiosInstance
  private refreshTokenPromise: Promise<string> | null = null

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = store.getState().auth.accessToken
        
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
        
        // Add request ID for tracing
        config.headers['X-Request-ID'] = crypto.randomUUID()
        
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config
        
        // Handle 401 Unauthorized (token expired)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          
          try {
            const newAccessToken = await this.refreshAccessToken()
            
            // Update authorization header
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
            
            // Retry the original request
            return this.api(originalRequest)
          } catch (refreshError) {
            // Refresh token failed, logout user
            store.dispatch(logout())
            window.location.href = '/login'
            return Promise.reject(refreshError)
          }
        }
        
        // Handle other errors
        if (error.response) {
          const { status, data } = error.response
          
          switch (status) {
            case 400:
              toast.error(data.message || 'Invalid request')
              break
            case 403:
              toast.error('You do not have permission to perform this action')
              break
            case 404:
              toast.error('Resource not found')
              break
            case 422:
              toast.error('Validation error')
              break
            case 429:
              toast.error('Too many requests. Please try again later.')
              break
            case 500:
              toast.error('Internal server error')
              break
            default:
              toast.error(data.message || 'An error occurred')
          }
        } else if (error.request) {
          toast.error('Network error. Please check your connection.')
        } else {
          toast.error('An unexpected error occurred')
        }
        
        return Promise.reject(error)
      }
    )
  }

  private async refreshAccessToken(): Promise<string> {
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise
    }

    this.refreshTokenPromise = new Promise(async (resolve, reject) => {
      try {
        const refreshTokenValue = store.getState().auth.refreshToken
        
        if (!refreshTokenValue) {
          throw new Error('No refresh token available')
        }

        const response = await axios.post(
          `${API_BASE_URL}/api/v1/auth/refresh`,
          { refresh_token: refreshTokenValue }
        )

        const { access_token } = response.data
        
        // Update store with new token
        store.dispatch(refreshToken({ accessToken: access_token }))
        
        resolve(access_token)
      } catch (error) {
        reject(error)
      } finally {
        this.refreshTokenPromise = null
      }
    })

    return this.refreshTokenPromise
  }

  // Auth endpoints
  auth = {
    login: (credentials: LoginCredentials) =>
      this.api.post('/api/v1/auth/login', credentials),
    
    register: (data: RegisterData) =>
      this.api.post('/api/v1/auth/register', data),
    
    logout: () =>
      this.api.post('/api/v1/auth/logout'),
    
    forgotPassword: (email: string) =>
      this.api.post('/api/v1/auth/forgot-password', { email }),
    
    resetPassword: (token: string, password: string) =>
      this.api.post('/api/v1/auth/reset-password', { token, password }),
    
    verifyEmail: (token: string) =>
      this.api.post('/api/v1/auth/verify-email', { token }),
  }

  // User endpoints
  user = {
    getProfile: () =>
      this.api.get('/api/v1/user/profile'),
    
    updateProfile: (data: Partial<User>) =>
      this.api.put('/api/v1/user/profile', data),
    
    updateAvatar: (file: File) => {
      const formData = new FormData()
      formData.append('avatar', file)
      return this.api.post('/api/v1/user/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    },
    
    changePassword: (currentPassword: string, newPassword: string) =>
      this.api.post('/api/v1/user/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      }),
  }

  // Career endpoints
  career = {
    getRoles: (field?: CareerField) =>
      this.api.get('/api/v1/career/roles', { params: { field } }),
    
    getRole: (id: string) =>
      this.api.get(`/api/v1/career/roles/${id}`),
    
    assess: (data: any) =>
      this.api.post('/api/v1/career/assess', data),
    
    getAssessment: (id: string) =>
      this.api.get(`/api/v1/career/assessments/${id}`),
    
    getAssessments: () =>
      this.api.get('/api/v1/career/assessments'),
    
    getSkillGapAnalysis: (roleId: string) =>
      this.api.get(`/api/v1/career/skill-gap-analysis/${roleId}`),
    
    getLearningResources: (skillId: string) =>
      this.api.get(`/api/v1/career/learning-resources/${skillId}`),
  }

  // Mentorship endpoints
  mentorship = {
    getAssignments: () =>
      this.api.get('/api/v1/mentorship/assignments'),
    
    getAssignment: (id: string) =>
      this.api.get(`/api/v1/mentorship/assignments/${id}`),
    
    getSessions: (assignmentId?: string) =>
      this.api.get('/api/v1/mentorship/sessions', { 
        params: { assignment_id: assignmentId } 
      }),
    
    getSession: (id: string) =>
      this.api.get(`/api/v1/mentorship/sessions/${id}`),
    
    createSession: (data: Partial<MentorshipSession>) =>
      this.api.post('/api/v1/mentorship/sessions', data),
    
    updateSession: (id: string, data: Partial<MentorshipSession>) =>
      this.api.put(`/api/v1/mentorship/sessions/${id}`, data),
    
    cancelSession: (id: string, reason: string) =>
      this.api.post(`/api/v1/mentorship/sessions/${id}/cancel`, { reason }),
    
    completeSession: (id: string, reflection: string, rating: number) =>
      this.api.post(`/api/v1/mentorship/sessions/${id}/complete`, {
        reflection,
        rating,
      }),
  }

  // Gamification endpoints
  gamification = {
    getProfile: () =>
      this.api.get('/api/v1/gamification/profile'),
    
    getBadges: () =>
      this.api.get('/api/v1/gamification/badges'),
    
    getQuests: () =>
      this.api.get('/api/v1/gamification/quests'),
    
    completeQuest: (questId: string) =>
      this.api.post(`/api/v1/gamification/quests/${questId}/complete`),
    
    getLeaderboard: (scope: 'global' | 'friends' = 'global', limit = 50) =>
      this.api.get('/api/v1/gamification/leaderboard', {
        params: { scope, limit },
      }),
    
    claimReward: (rewardId: string) =>
      this.api.post(`/api/v1/gamification/rewards/${rewardId}/claim`),
  }

  // Learning endpoints
  learning = {
    getPaths: () =>
      this.api.get('/api/v1/learning/paths'),
    
    getPath: (id: string) =>
      this.api.get(`/api/v1/learning/paths/${id}`),
    
    enrollPath: (id: string) =>
      this.api.post(`/api/v1/learning/paths/${id}/enroll`),
    
    getProgress: (pathId: string) =>
      this.api.get(`/api/v1/learning/paths/${pathId}/progress`),
    
    completeModule: (pathId: string, moduleId: string) =>
      this.api.post(`/api/v1/learning/paths/${pathId}/modules/${moduleId}/complete`),
  }

  // File upload
  upload = {
    file: (file: File, type: 'avatar' | 'document' | 'project') => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)
      
      return this.api.post('/api/v1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    },
  }

  // Generic request methods
  get = (url: string, config?: AxiosRequestConfig) =>
    this.api.get(url, config)
  
  post = (url: string, data?: any, config?: AxiosRequestConfig) =>
    this.api.post(url, data, config)
  
  put = (url: string, data?: any, config?: AxiosRequestConfig) =>
    this.api.put(url, data, config)
  
  patch = (url: string, data?: any, config?: AxiosRequestConfig) =>
    this.api.patch(url, data, config)
  
  delete = (url: string, config?: AxiosRequestConfig) =>
    this.api.delete(url, config)
}

export default new ApiService()