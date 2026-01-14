// Common types
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// User types
export enum UserRole {
  ADMIN = 'admin',
  MENTOR = 'mentor',
  MENTEE = 'mentee',
  CAREER_SEEKER = 'career_seeker',
  PARENT_GUARDIAN = 'parent_guardian',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  NON_BINARY = 'non_binary',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

export interface User extends BaseEntity {
  email: string
  username: string
  fullName: string | null
  role: UserRole
  gender: Gender | null
  bio: string | null
  profilePictureUrl: string | null
  phoneNumber: string | null
  country: string | null
  city: string | null
  isFutureSyntaxMentee: boolean
  guardianEmail: string | null
  guardianVerified: boolean
  experiencePoints: number
  currentLevel: number
  badges: string[]
  isActive: boolean
  isVerified: boolean
  lastLogin: string | null
}

// Auth types
export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterData {
  email: string
  username: string
  password: string
  confirmPassword: string
  fullName: string
  role: UserRole
  gender?: Gender
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  user: User
}

// Career types
export enum CareerField {
  SOFTWARE_ENGINEERING = 'software_engineering',
  DATA_SCIENCE = 'data_science',
  WEB_DEVELOPMENT = 'web_development',
  MOBILE_DEVELOPMENT = 'mobile_development',
  DEVOPS = 'devops',
  CYBERSECURITY = 'cybersecurity',
  AI_ML = 'ai_ml',
  CLOUD_COMPUTING = 'cloud_computing',
  UX_UI_DESIGN = 'ux_ui_design',
  PRODUCT_MANAGEMENT = 'product_management',
  GAME_DEVELOPMENT = 'game_development',
  BLOCKCHAIN = 'blockchain',
}

export enum ExperienceLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

export interface Skill {
  id: string
  name: string
  category: string
  level: number // 1-5
  isRequired: boolean
}

export interface CareerRole extends BaseEntity {
  title: string
  field: CareerField
  description: string
  requiredSkills: Skill[]
  recommendedSkills: Skill[]
  toolsTechnologies: string[]
  averageSalaryMin: number
  averageSalaryMax: number
  demandLevel: number // 1-5
  growthProjection: number // percentage
  isActive: boolean
}

export interface CareerAssessment extends BaseEntity {
  userId: string
  answers: Record<string, any>
  personalityTraits: string[]
  currentSkills: Skill[]
  interests: string[]
  recommendedRoleId: string
  recommendedRole?: CareerRole
  matchScore: number
  alternativeRoles: CareerRole[]
  skillGaps: SkillGap[]
}

export interface SkillGap {
  skill: Skill
  currentLevel: number
  requiredLevel: number
  gap: number
  learningResources: LearningResource[]
}

export interface LearningResource {
  id: string
  title: string
  description: string
  type: 'course' | 'article' | 'video' | 'project'
  url: string
  duration: string
  difficulty: ExperienceLevel
  provider: string
  isFree: boolean
  rating: number
}

// Mentorship types
export enum SessionStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  MISSED = 'missed',
}

export enum WeekFocus {
  CODING_BASICS = 'coding_basics',
  DIGITAL_LITERACY = 'digital_literacy',
  RESPONSIBILITY = 'responsibility',
  DISCIPLINE = 'discipline',
  FINANCIAL_AWARENESS = 'financial_awareness',
  GROWTH_MINDSET = 'growth_mindset',
  PROJECT_WORK = 'project_work',
}

export interface MentorAssignment extends BaseEntity {
  mentorId: string
  menteeId: string
  mentor?: User
  mentee?: User
  startDate: string
  endDate: string | null
  isActive: boolean
  currentWeek: number
  completedModules: string[]
  overallProgress: number
  menteeSatisfaction: number | null
  mentorFeedback: string | null
}

export interface MentorshipSession extends BaseEntity {
  assignmentId: string
  menteeId: string
  assignment?: MentorAssignment
  mentee?: User
  title: string
  description: string
  weekFocus: WeekFocus
  sessionDate: string
  durationMinutes: number
  status: SessionStatus
  learningObjectives: string[]
  resources: LearningResource[]
  discussionPoints: string[]
  mentorNotes: string | null
  menteeReflection: string | null
  sessionRating: number | null
}

// Gamification types
export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: 'achievement' | 'skill' | 'social' | 'progress'
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  xpReward: number
  requirements: BadgeRequirement[]
}

export interface BadgeRequirement {
  type: 'xp' | 'level' | 'skill' | 'activity' | 'streak'
  value: number | string
  description: string
}

export interface Quest {
  id: string
  title: string
  description: string
  type: 'daily' | 'weekly' | 'monthly' | 'achievement'
  xpReward: number
  badgeRewardId?: string
  badgeReward?: Badge
  requirements: QuestRequirement[]
  isActive: boolean
  isCompleted: boolean
  progress: number
}

export interface QuestRequirement {
  id: string
  description: string
  isCompleted: boolean
}

export interface LeaderboardEntry {
  userId: string
  user?: User
  rank: number
  xp: number
  level: number
  badgesCount: number
  streak: number
}

// Notification types
export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  actionUrl?: string
  createdAt: string
}

// UI types
export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

export interface Modal {
  id: string
  type: string
  props: Record<string, any>
  isOpen: boolean
}