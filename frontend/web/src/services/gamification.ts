import api from './api'

// Types
export interface Badge {
    id: string
    name: string
    description: string
    tier: 'bronze' | 'silver' | 'gold' | 'platinum'
    category: 'learning' | 'mentorship' | 'community' | 'streak' | 'special'
    icon: string
    unlockedAt?: string
    progress?: number
    requirement?: number
    rarity: number // percentage of users who have it
}

export interface UserLevel {
    level: number
    currentXp: number
    xpToNextLevel: number
    totalXp: number
    title: string
    perks: string[]
}

export interface Streak {
    current: number
    longest: number
    lastActivity: string
    milestones: number[]
}

export interface Reward {
    id: string
    type: 'xp' | 'badge' | 'item' | 'certificate'
    amount?: number
    badgeId?: string
    itemId?: string
    claimed: boolean
    expiresAt?: string
}

export interface AvatarItem {
    id: string
    type: 'hair' | 'face' | 'outfit' | 'accessory' | 'background'
    name: string
    preview: string
    unlockedAt?: string
    requiresLevel?: number
    requiresBadge?: string
    isPremium?: boolean
}

export interface Avatar {
    id: string
    hair: string
    face: string
    outfit: string
    accessory?: string
    background: string
    skinTone: string
}

// Service
class GamificationService {
    private baseUrl = '/api/v1/gamification'

    // Badges
    async getBadges(): Promise<Badge[]> {
        const response = await api.get(`${this.baseUrl}/badges`)
        return response.data
    }

    async getUnlockedBadges(): Promise<Badge[]> {
        const response = await api.get(`${this.baseUrl}/badges/unlocked`)
        return response.data
    }

    async getBadgeProgress(): Promise<Badge[]> {
        const response = await api.get(`${this.baseUrl}/badges/progress`)
        return response.data
    }

    async claimBadge(badgeId: string): Promise<Badge> {
        const response = await api.post(`${this.baseUrl}/badges/${badgeId}/claim`)
        return response.data
    }

    // XP & Levels
    async getLevel(): Promise<UserLevel> {
        const response = await api.get(`${this.baseUrl}/level`)
        return response.data
    }

    async addXp(amount: number, source: string): Promise<{ newXp: number; levelUp?: UserLevel }> {
        const response = await api.post(`${this.baseUrl}/xp`, { amount, source })
        return response.data
    }

    async getXpHistory(limit?: number): Promise<{ amount: number; source: string; date: string }[]> {
        const response = await api.get(`${this.baseUrl}/xp/history?limit=${limit || 50}`)
        return response.data
    }

    // Streaks
    async getStreak(): Promise<Streak> {
        const response = await api.get(`${this.baseUrl}/streak`)
        return response.data
    }

    async checkIn(): Promise<{ streak: Streak; reward?: Reward }> {
        const response = await api.post(`${this.baseUrl}/streak/check-in`)
        return response.data
    }

    // Rewards
    async getPendingRewards(): Promise<Reward[]> {
        const response = await api.get(`${this.baseUrl}/rewards/pending`)
        return response.data
    }

    async claimReward(rewardId: string): Promise<Reward> {
        const response = await api.post(`${this.baseUrl}/rewards/${rewardId}/claim`)
        return response.data
    }

    // Avatar
    async getAvatar(): Promise<Avatar> {
        const response = await api.get(`${this.baseUrl}/avatar`)
        return response.data
    }

    async updateAvatar(avatar: Partial<Avatar>): Promise<Avatar> {
        const response = await api.put(`${this.baseUrl}/avatar`, avatar)
        return response.data
    }

    async getAvatarItems(): Promise<AvatarItem[]> {
        const response = await api.get(`${this.baseUrl}/avatar/items`)
        return response.data
    }

    async getUnlockedItems(): Promise<AvatarItem[]> {
        const response = await api.get(`${this.baseUrl}/avatar/items/unlocked`)
        return response.data
    }

    async unlockItem(itemId: string): Promise<AvatarItem> {
        const response = await api.post(`${this.baseUrl}/avatar/items/${itemId}/unlock`)
        return response.data
    }

    // Leaderboard
    async getLeaderboard(scope: 'global' | 'friends' | 'weekly' = 'global'): Promise<{
        rank: number
        users: { id: string; name: string; avatar: string; xp: number; level: number }[]
    }> {
        const response = await api.get(`${this.baseUrl}/leaderboard?scope=${scope}`)
        return response.data
    }

    // Share
    async shareAchievement(badgeId: string, platform: 'twitter' | 'linkedin' | 'copy'): Promise<{ url: string }> {
        const response = await api.post(`${this.baseUrl}/share`, { badgeId, platform })
        return response.data
    }
}

export const gamificationService = new GamificationService()
export default gamificationService
