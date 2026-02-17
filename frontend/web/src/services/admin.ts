import api from './api'

export type UserRole = 'mentee' | 'mentor' | 'career_seeker' | 'parent' | 'admin'

export interface AdminStats {
    total_users: number
    total_mentors: number
    total_mentees: number
    total_revenue: number
    pending_transactions: number
}

export interface UserSummary {
    id: number
    email: string
    full_name: string
    role: UserRole
    created_at: string
    is_active: boolean
}

export interface Transaction {
    id: number
    user_id: number
    amount: number
    provider: string
    status: string
    reference: string
    purpose: string
    created_at: string
}

class AdminService {
    async getStats(): Promise<AdminStats> {
        const response = await api.get('/admin/stats')
        return response.data
    }

    async getUsers(role?: string): Promise<UserSummary[]> {
        const response = await api.get('/admin/users', { params: { role } })
        return response.data
    }

    async createMentor(data: any): Promise<UserSummary> {
        const response = await api.post('/admin/mentors', data)
        return response.data
    }

    async createAssignment(data: any): Promise<void> {
        await api.post('/admin/assignments', data)
    }

    async getTransactions(status?: string): Promise<Transaction[]> {
        const response = await api.get('/admin/transactions', { params: { status } })
        return response.data
    }

    async verifyTransaction(txId: number, approve: boolean, notes?: string): Promise<any> {
        const response = await api.post(`/admin/transactions/${txId}/verify`, { approve, notes })
        return response.data
    }
}

export default new AdminService()
