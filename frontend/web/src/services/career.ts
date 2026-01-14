import api from './api'

// Types
export interface CareerRole {
    id: string
    title: string
    field: string
    description: string
    shortDescription: string
    salary: {
        min: number
        max: number
        median: number
        currency: string
    }
    demand: 'low' | 'medium' | 'high' | 'very_high'
    growthRate: number
    skills: {
        id: string
        name: string
        level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
        required: boolean
    }[]
    certifications: {
        id: string
        name: string
        provider: string
        required: boolean
        url?: string
    }[]
    education: {
        level: string
        field: string
        required: boolean
    }[]
    dayInLife: {
        time: string
        activity: string
    }[]
    relatedRoles: string[]
    averageTimeToAchieve: string
    remoteAvailability: 'full' | 'hybrid' | 'onsite'
}

export interface LearningPath {
    id: string
    title: string
    description: string
    thumbnail: string
    category: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    duration: string
    durationHours: number
    modules: LearningModule[]
    skills: string[]
    enrolledCount: number
    rating: number
    ratingCount: number
    instructor: {
        name: string
        avatar: string
        title: string
    }
    certificate: boolean
    price: number
    enrolled?: boolean
    progress?: number
}

export interface LearningModule {
    id: string
    title: string
    description: string
    type: 'video' | 'article' | 'exercise' | 'quiz' | 'project'
    duration: string
    durationMinutes: number
    order: number
    completed: boolean
    locked: boolean
    resources: {
        type: 'video' | 'article' | 'download' | 'link'
        title: string
        url: string
        duration?: string
    }[]
    quiz?: {
        questions: number
        passingScore: number
        attempts: number
        bestScore?: number
    }
}

export interface SkillGap {
    skill: string
    currentLevel: number
    requiredLevel: number
    gap: number
    priority: 'low' | 'medium' | 'high'
    resources: {
        id: string
        title: string
        type: string
        duration: string
        url: string
    }[]
    estimatedTime: string
}

export interface ProgressAnalytics {
    totalHoursLearned: number
    coursesCompleted: number
    coursesInProgress: number
    certificatesEarned: number
    skillsImproved: number
    weeklyProgress: {
        week: string
        hours: number
    }[]
    skillProgress: {
        skill: string
        before: number
        after: number
    }[]
    recentActivities: {
        date: string
        type: string
        title: string
        xpEarned: number
    }[]
}

// Service class
class CareerService {
    // Career Roles
    async getRoles(field?: string): Promise<CareerRole[]> {
        const response = await api.career.getRoles(field)
        return response.data
    }

    async getRole(id: string): Promise<CareerRole> {
        const response = await api.career.getRole(id)
        return response.data
    }

    async compareRoles(roleIds: string[]): Promise<CareerRole[]> {
        const roles = await Promise.all(roleIds.map(id => this.getRole(id)))
        return roles
    }

    // Skill Gap Analysis
    async getSkillGapAnalysis(roleId: string): Promise<SkillGap[]> {
        const response = await api.career.getSkillGapAnalysis(roleId)
        return response.data
    }

    async getLearningResources(skillId: string): Promise<any[]> {
        const response = await api.career.getLearningResources(skillId)
        return response.data
    }

    // Learning Paths
    async getPaths(): Promise<LearningPath[]> {
        const response = await api.learning.getPaths()
        return response.data
    }

    async getPath(id: string): Promise<LearningPath> {
        const response = await api.learning.getPath(id)
        return response.data
    }

    async enrollPath(id: string): Promise<void> {
        await api.learning.enrollPath(id)
    }

    async getProgress(pathId: string): Promise<any> {
        const response = await api.learning.getProgress(pathId)
        return response.data
    }

    async completeModule(pathId: string, moduleId: string): Promise<void> {
        await api.learning.completeModule(pathId, moduleId)
    }

    // Progress Analytics
    async getProgressAnalytics(): Promise<ProgressAnalytics> {
        // This would be an actual API call
        // For now returning structured data that the API would provide
        const response = await api.learning.getProgress('analytics')
        return response.data
    }

    // Submit quiz
    async submitQuiz(moduleId: string, answers: Record<string, string>): Promise<{ score: number; passed: boolean }> {
        const response = await api.learning.completeModule('quiz', moduleId)
        return response.data
    }

    // Submit project
    async submitProject(moduleId: string, data: { title: string; description: string; repoUrl: string; demoUrl?: string }): Promise<void> {
        await api.upload.file(new File([JSON.stringify(data)], 'project.json'), 'project')
    }
}

export const careerService = new CareerService()
export default careerService
