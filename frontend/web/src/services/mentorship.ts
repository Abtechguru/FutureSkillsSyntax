import api from './api'

// Types
export interface Mentor {
    id: string
    userId: string
    name: string
    avatar: string
    title: string
    company: string
    bio: string
    expertise: string[]
    languages: string[]
    timezone: string
    rating: number
    reviewCount: number
    sessionCount: number
    responseTime: string
    hourlyRate: number
    availability: AvailabilitySlot[]
    matchScore?: number
    verified: boolean
    featured: boolean
}

export interface AvailabilitySlot {
    dayOfWeek: number
    startTime: string
    endTime: string
}

export interface MentorSession {
    id: string
    mentorId: string
    menteeId: string
    mentor: { name: string; avatar: string }
    mentee: { name: string; avatar: string }
    title: string
    description: string
    date: string
    startTime: string
    endTime: string
    duration: number
    type: 'video' | 'chat' | 'phone'
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
    meetingUrl?: string
    notes: SessionNote[]
    actionItems: ActionItem[]
    recording?: {
        url: string
        duration: number
    }
}

export interface SessionNote {
    id: string
    userId: string
    content: string
    createdAt: string
}

export interface ActionItem {
    id: string
    title: string
    completed: boolean
    dueDate?: string
    assignedTo: string
}

export interface MentorshipRequest {
    id: string
    mentorId: string
    menteeId: string
    status: 'pending' | 'accepted' | 'declined'
    message: string
    goals: string[]
    createdAt: string
}

export interface MentorReview {
    id: string
    sessionId: string
    rating: number
    comment: string
    createdAt: string
    author: { name: string; avatar: string }
}

export interface MentorFilters {
    expertise?: string[]
    rating?: number
    availability?: string[]
    priceRange?: { min: number; max: number }
    languages?: string[]
    verified?: boolean
}

// Service class
class MentorshipService {
    private baseUrl = '/api/v1/mentorship'

    // Mentors
    async getMentors(filters?: MentorFilters): Promise<Mentor[]> {
        const params = new URLSearchParams()
        if (filters?.expertise?.length) params.set('expertise', filters.expertise.join(','))
        if (filters?.rating) params.set('minRating', filters.rating.toString())
        if (filters?.verified) params.set('verified', 'true')
        if (filters?.priceRange) {
            params.set('minPrice', filters.priceRange.min.toString())
            params.set('maxPrice', filters.priceRange.max.toString())
        }

        const response = await api.get(`${this.baseUrl}/mentors?${params.toString()}`)
        return response.data
    }

    async getMentor(id: string): Promise<Mentor> {
        const response = await api.get(`${this.baseUrl}/mentors/${id}`)
        return response.data
    }

    async getMentorReviews(mentorId: string): Promise<MentorReview[]> {
        const response = await api.get(`${this.baseUrl}/mentors/${mentorId}/reviews`)
        return response.data
    }

    async getMatchedMentors(): Promise<Mentor[]> {
        const response = await api.get(`${this.baseUrl}/mentors/matched`)
        return response.data
    }

    // Mentorship Requests
    async requestMentorship(mentorId: string, message: string, goals: string[]): Promise<MentorshipRequest> {
        const response = await api.post(`${this.baseUrl}/requests`, { mentorId, message, goals })
        return response.data
    }

    async getMyRequests(): Promise<MentorshipRequest[]> {
        const response = await api.get(`${this.baseUrl}/requests`)
        return response.data
    }

    async respondToRequest(requestId: string, status: 'accepted' | 'declined'): Promise<void> {
        await api.put(`${this.baseUrl}/requests/${requestId}`, { status })
    }

    // Sessions
    async getSessions(filters?: { status?: string; upcoming?: boolean }): Promise<MentorSession[]> {
        const params = new URLSearchParams()
        if (filters?.status) params.set('status', filters.status)
        if (filters?.upcoming) params.set('upcoming', 'true')

        const response = await api.get(`${this.baseUrl}/sessions?${params.toString()}`)
        return response.data
    }

    async getSession(id: string): Promise<MentorSession> {
        const response = await api.get(`${this.baseUrl}/sessions/${id}`)
        return response.data
    }

    async bookSession(data: {
        mentorId: string
        date: string
        startTime: string
        duration: number
        type: 'video' | 'chat' | 'phone'
        title: string
        description?: string
    }): Promise<MentorSession> {
        const response = await api.post(`${this.baseUrl}/sessions`, data)
        return response.data
    }

    async updateSession(id: string, data: Partial<MentorSession>): Promise<MentorSession> {
        const response = await api.put(`${this.baseUrl}/sessions/${id}`, data)
        return response.data
    }

    async cancelSession(id: string, reason: string): Promise<void> {
        await api.delete(`${this.baseUrl}/sessions/${id}`, { data: { reason } })
    }

    async startSession(id: string): Promise<{ meetingUrl: string }> {
        const response = await api.post(`${this.baseUrl}/sessions/${id}/start`)
        return response.data
    }

    async endSession(id: string): Promise<void> {
        await api.post(`${this.baseUrl}/sessions/${id}/end`)
    }

    // Session Notes
    async addNote(sessionId: string, content: string): Promise<SessionNote> {
        const response = await api.post(`${this.baseUrl}/sessions/${sessionId}/notes`, { content })
        return response.data
    }

    async addActionItem(sessionId: string, item: Omit<ActionItem, 'id'>): Promise<ActionItem> {
        const response = await api.post(`${this.baseUrl}/sessions/${sessionId}/action-items`, item)
        return response.data
    }

    async toggleActionItem(sessionId: string, itemId: string): Promise<void> {
        await api.put(`${this.baseUrl}/sessions/${sessionId}/action-items/${itemId}/toggle`)
    }

    // Reviews
    async submitReview(sessionId: string, rating: number, comment: string): Promise<MentorReview> {
        const response = await api.post(`${this.baseUrl}/sessions/${sessionId}/review`, { rating, comment })
        return response.data
    }

    // Availability
    async getMentorAvailability(mentorId: string, date: string): Promise<string[]> {
        const response = await api.get(`${this.baseUrl}/mentors/${mentorId}/availability?date=${date}`)
        return response.data
    }

    async updateMyAvailability(slots: AvailabilitySlot[]): Promise<void> {
        await api.put(`${this.baseUrl}/availability`, { slots })
    }
}

export const mentorshipService = new MentorshipService()
export default mentorshipService
