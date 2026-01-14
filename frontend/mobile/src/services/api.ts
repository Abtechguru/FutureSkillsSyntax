import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import * as SecureStore from 'expo-secure-store'
import Constants from 'expo-constants'

const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:8000'

const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

class ApiService {
    private api: AxiosInstance
    private refreshTokenPromise: Promise<string> | null = null

    constructor() {
        this.api = axios.create({
            baseURL: API_BASE_URL,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        })

        this.setupInterceptors()
    }

    private setupInterceptors() {
        // Request interceptor - add auth token
        this.api.interceptors.request.use(
            async (config) => {
                const token = await SecureStore.getItemAsync(TOKEN_KEY)
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }
                return config
            },
            (error) => Promise.reject(error)
        )

        // Response interceptor - handle token refresh
        this.api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true

                    try {
                        const newToken = await this.refreshAccessToken()
                        originalRequest.headers.Authorization = `Bearer ${newToken}`
                        return this.api(originalRequest)
                    } catch (refreshError) {
                        await this.clearTokens()
                        return Promise.reject(refreshError)
                    }
                }

                return Promise.reject(error)
            }
        )
    }

    private async refreshAccessToken(): Promise<string> {
        if (this.refreshTokenPromise) {
            return this.refreshTokenPromise
        }

        this.refreshTokenPromise = (async () => {
            const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY)
            if (!refreshToken) {
                throw new Error('No refresh token')
            }

            const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
                refresh_token: refreshToken,
            })

            const { access_token, refresh_token } = response.data
            await this.setTokens(access_token, refresh_token)
            return access_token
        })()

        try {
            return await this.refreshTokenPromise
        } finally {
            this.refreshTokenPromise = null
        }
    }

    async setTokens(accessToken: string, refreshToken: string) {
        await SecureStore.setItemAsync(TOKEN_KEY, accessToken)
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken)
    }

    async clearTokens() {
        await SecureStore.deleteItemAsync(TOKEN_KEY)
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY)
    }

    async getToken(): Promise<string | null> {
        return SecureStore.getItemAsync(TOKEN_KEY)
    }

    // Generic request methods
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.api.get<T>(url, config)
        return response.data
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.api.post<T>(url, data, config)
        return response.data
    }

    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.api.put<T>(url, data, config)
        return response.data
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.api.delete<T>(url, config)
        return response.data
    }

    // Auth endpoints
    async login(credentials: { email: string; password: string }) {
        const response = await this.post<{ access_token: string; refresh_token: string; user: any }>(
            '/api/v1/auth/login',
            credentials
        )
        await this.setTokens(response.access_token, response.refresh_token)
        return response
    }

    async register(data: { email: string; password: string; name: string }) {
        return this.post('/api/v1/auth/register', data)
    }

    async logout() {
        await this.post('/api/v1/auth/logout')
        await this.clearTokens()
    }

    async getProfile() {
        return this.get('/api/v1/users/me')
    }

    async updateProfile(data: any) {
        return this.put('/api/v1/users/me', data)
    }
}

export const apiService = new ApiService()
export default apiService
