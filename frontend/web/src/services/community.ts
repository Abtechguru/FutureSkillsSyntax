import api from './api'

// Types
export interface ForumCategory {
    id: string
    name: string
    slug: string
    description: string
    icon: string
    threadCount: number
    postCount: number
    lastPost?: {
        title: string
        author: string
        date: string
    }
}

export interface ForumThread {
    id: string
    categoryId: string
    title: string
    content: string
    author: {
        id: string
        name: string
        avatar: string
        reputation: number
        badges: string[]
    }
    tags: string[]
    upvotes: number
    downvotes: number
    replyCount: number
    viewCount: number
    isPinned: boolean
    isSolved: boolean
    solutionId?: string
    createdAt: string
    updatedAt: string
    userVote?: 'up' | 'down' | null
}

export interface ForumPost {
    id: string
    threadId: string
    content: string
    author: {
        id: string
        name: string
        avatar: string
        reputation: number
        badges: string[]
    }
    upvotes: number
    downvotes: number
    isSolution: boolean
    parentId?: string
    createdAt: string
    updatedAt: string
    userVote?: 'up' | 'down' | null
}

export interface StudyGroup {
    id: string
    name: string
    description: string
    topic: string
    coverImage?: string
    members: GroupMember[]
    memberCount: number
    maxMembers: number
    isPrivate: boolean
    owner: {
        id: string
        name: string
        avatar: string
    }
    nextMeeting?: {
        date: string
        title: string
    }
    resources: GroupResource[]
    projects: GroupProject[]
    createdAt: string
}

export interface GroupMember {
    id: string
    userId: string
    name: string
    avatar: string
    role: 'owner' | 'admin' | 'member'
    joinedAt: string
}

export interface GroupResource {
    id: string
    title: string
    type: 'link' | 'file' | 'note'
    url?: string
    content?: string
    addedBy: string
    createdAt: string
}

export interface GroupProject {
    id: string
    title: string
    description: string
    status: 'planning' | 'in_progress' | 'review' | 'completed'
    members: string[]
    dueDate?: string
    tasks: ProjectTask[]
}

export interface ProjectTask {
    id: string
    title: string
    completed: boolean
    assignedTo?: string
    dueDate?: string
}

export interface GroupMessage {
    id: string
    groupId: string
    userId: string
    author: {
        name: string
        avatar: string
    }
    content: string
    type: 'text' | 'file' | 'system'
    fileUrl?: string
    fileName?: string
    createdAt: string
}

export interface GroupMeeting {
    id: string
    groupId: string
    title: string
    description?: string
    date: string
    startTime: string
    duration: number
    meetingUrl?: string
    attendees: string[]
}

// Service class
class CommunityService {
    private baseUrl = '/api/v1/community'

    // Forum Categories
    async getCategories(): Promise<ForumCategory[]> {
        const response = await api.get(`${this.baseUrl}/categories`)
        return response.data
    }

    // Forum Threads
    async getThreads(categoryId?: string, options?: {
        page?: number
        limit?: number
        sort?: 'latest' | 'popular' | 'unanswered'
        tag?: string
    }): Promise<{ threads: ForumThread[]; total: number }> {
        const params = new URLSearchParams()
        if (categoryId) params.set('category', categoryId)
        if (options?.page) params.set('page', options.page.toString())
        if (options?.limit) params.set('limit', options.limit.toString())
        if (options?.sort) params.set('sort', options.sort)
        if (options?.tag) params.set('tag', options.tag)

        const response = await api.get(`${this.baseUrl}/threads?${params.toString()}`)
        return response.data
    }

    async getThread(id: string): Promise<ForumThread> {
        const response = await api.get(`${this.baseUrl}/threads/${id}`)
        return response.data
    }

    async createThread(data: {
        categoryId: string
        title: string
        content: string
        tags?: string[]
    }): Promise<ForumThread> {
        const response = await api.post(`${this.baseUrl}/threads`, data)
        return response.data
    }

    async updateThread(id: string, data: Partial<ForumThread>): Promise<ForumThread> {
        const response = await api.put(`${this.baseUrl}/threads/${id}`, data)
        return response.data
    }

    async deleteThread(id: string): Promise<void> {
        await api.delete(`${this.baseUrl}/threads/${id}`)
    }

    async voteThread(id: string, vote: 'up' | 'down'): Promise<{ upvotes: number; downvotes: number }> {
        const response = await api.post(`${this.baseUrl}/threads/${id}/vote`, { vote })
        return response.data
    }

    // Forum Posts
    async getPosts(threadId: string): Promise<ForumPost[]> {
        const response = await api.get(`${this.baseUrl}/threads/${threadId}/posts`)
        return response.data
    }

    async createPost(threadId: string, data: {
        content: string
        parentId?: string
    }): Promise<ForumPost> {
        const response = await api.post(`${this.baseUrl}/threads/${threadId}/posts`, data)
        return response.data
    }

    async updatePost(threadId: string, postId: string, content: string): Promise<ForumPost> {
        const response = await api.put(`${this.baseUrl}/threads/${threadId}/posts/${postId}`, { content })
        return response.data
    }

    async deletePost(threadId: string, postId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/threads/${threadId}/posts/${postId}`)
    }

    async votePost(threadId: string, postId: string, vote: 'up' | 'down'): Promise<{ upvotes: number; downvotes: number }> {
        const response = await api.post(`${this.baseUrl}/threads/${threadId}/posts/${postId}/vote`, { vote })
        return response.data
    }

    async markAsSolution(threadId: string, postId: string): Promise<void> {
        await api.post(`${this.baseUrl}/threads/${threadId}/solution`, { postId })
    }

    // Study Groups
    async getGroups(options?: {
        topic?: string
        joinable?: boolean
        myGroups?: boolean
    }): Promise<StudyGroup[]> {
        const params = new URLSearchParams()
        if (options?.topic) params.set('topic', options.topic)
        if (options?.joinable) params.set('joinable', 'true')
        if (options?.myGroups) params.set('myGroups', 'true')

        const response = await api.get(`${this.baseUrl}/groups?${params.toString()}`)
        return response.data
    }

    async getGroup(id: string): Promise<StudyGroup> {
        const response = await api.get(`${this.baseUrl}/groups/${id}`)
        return response.data
    }

    async createGroup(data: {
        name: string
        description: string
        topic: string
        maxMembers?: number
        isPrivate?: boolean
    }): Promise<StudyGroup> {
        const response = await api.post(`${this.baseUrl}/groups`, data)
        return response.data
    }

    async updateGroup(id: string, data: Partial<StudyGroup>): Promise<StudyGroup> {
        const response = await api.put(`${this.baseUrl}/groups/${id}`, data)
        return response.data
    }

    async deleteGroup(id: string): Promise<void> {
        await api.delete(`${this.baseUrl}/groups/${id}`)
    }

    async joinGroup(id: string): Promise<void> {
        await api.post(`${this.baseUrl}/groups/${id}/join`)
    }

    async leaveGroup(id: string): Promise<void> {
        await api.post(`${this.baseUrl}/groups/${id}/leave`)
    }

    // Group Chat
    async getMessages(groupId: string, options?: {
        before?: string
        limit?: number
    }): Promise<GroupMessage[]> {
        const params = new URLSearchParams()
        if (options?.before) params.set('before', options.before)
        if (options?.limit) params.set('limit', options.limit.toString())

        const response = await api.get(`${this.baseUrl}/groups/${groupId}/messages?${params.toString()}`)
        return response.data
    }

    async sendMessage(groupId: string, content: string, type?: 'text' | 'file'): Promise<GroupMessage> {
        const response = await api.post(`${this.baseUrl}/groups/${groupId}/messages`, { content, type: type || 'text' })
        return response.data
    }

    // Group Resources
    async addResource(groupId: string, resource: Omit<GroupResource, 'id' | 'createdAt' | 'addedBy'>): Promise<GroupResource> {
        const response = await api.post(`${this.baseUrl}/groups/${groupId}/resources`, resource)
        return response.data
    }

    async deleteResource(groupId: string, resourceId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/groups/${groupId}/resources/${resourceId}`)
    }

    // Group Projects
    async createProject(groupId: string, project: Omit<GroupProject, 'id' | 'tasks'>): Promise<GroupProject> {
        const response = await api.post(`${this.baseUrl}/groups/${groupId}/projects`, project)
        return response.data
    }

    async updateProject(groupId: string, projectId: string, data: Partial<GroupProject>): Promise<GroupProject> {
        const response = await api.put(`${this.baseUrl}/groups/${groupId}/projects/${projectId}`, data)
        return response.data
    }

    async addProjectTask(groupId: string, projectId: string, task: Omit<ProjectTask, 'id'>): Promise<ProjectTask> {
        const response = await api.post(`${this.baseUrl}/groups/${groupId}/projects/${projectId}/tasks`, task)
        return response.data
    }

    async toggleProjectTask(groupId: string, projectId: string, taskId: string): Promise<void> {
        await api.put(`${this.baseUrl}/groups/${groupId}/projects/${projectId}/tasks/${taskId}/toggle`)
    }

    // Group Meetings
    async scheduleMeeting(groupId: string, meeting: Omit<GroupMeeting, 'id' | 'groupId' | 'attendees'>): Promise<GroupMeeting> {
        const response = await api.post(`${this.baseUrl}/groups/${groupId}/meetings`, meeting)
        return response.data
    }

    async getMeetings(groupId: string): Promise<GroupMeeting[]> {
        const response = await api.get(`${this.baseUrl}/groups/${groupId}/meetings`)
        return response.data
    }

    async joinMeeting(groupId: string, meetingId: string): Promise<void> {
        await api.post(`${this.baseUrl}/groups/${groupId}/meetings/${meetingId}/join`)
    }
}

export const communityService = new CommunityService()
export default communityService
