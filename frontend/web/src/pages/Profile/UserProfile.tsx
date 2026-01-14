import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    User,
    Mail,
    MapPin,
    Calendar,
    Edit2,
    Save,
    X,
    Camera,
    Briefcase,
    GraduationCap,
    Award,
    ExternalLink,
    Github,
    Linkedin,
    Globe,
} from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import FadeIn from '@/components/animations/FadeIn'
import BadgeDisplay from '@/components/gamification/BadgeDisplay'
import { RootState } from '@/store/store'
import { cn } from '@/utils/cn'

interface Experience {
    id: string
    title: string
    company: string
    startDate: string
    endDate: string | null
    description: string
    current: boolean
}

const UserProfile: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth)
    const gamification = useSelector((state: RootState) => state.gamification)
    const [isEditing, setIsEditing] = useState(false)
    const [activeTab, setActiveTab] = useState<'about' | 'experience' | 'skills' | 'achievements'>('about')

    // Form state for editing
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        location: user?.location || '',
        bio: user?.bio || '',
        title: 'Software Developer',
        website: '',
        github: '',
        linkedin: '',
    })

    // Mock data
    const skills = [
        { name: 'JavaScript', level: 85, category: 'programming' },
        { name: 'React', level: 80, category: 'frontend' },
        { name: 'TypeScript', level: 75, category: 'programming' },
        { name: 'Node.js', level: 70, category: 'backend' },
        { name: 'Python', level: 60, category: 'programming' },
        { name: 'CSS/Tailwind', level: 85, category: 'frontend' },
    ]

    const interests = [
        'Web Development', 'Machine Learning', 'Cloud Computing',
        'Open Source', 'DevOps', 'Mobile Development'
    ]

    const experiences: Experience[] = [
        {
            id: '1',
            title: 'Frontend Developer',
            company: 'Tech Startup Inc.',
            startDate: '2024-01',
            endDate: null,
            description: 'Building modern web applications with React and TypeScript.',
            current: true,
        },
        {
            id: '2',
            title: 'Junior Developer',
            company: 'Digital Agency',
            startDate: '2022-06',
            endDate: '2023-12',
            description: 'Developed responsive websites and maintained client projects.',
            current: false,
        },
    ]

    const badges = [
        { id: '1', name: 'Quick Learner', icon: '🚀', description: 'Completed 5 courses in a week', earned: true },
        { id: '2', name: 'First Session', icon: '👥', description: 'Had your first mentorship session', earned: true },
        { id: '3', name: 'Code Master', icon: '💻', description: 'Completed all coding challenges', earned: true },
        { id: '4', name: 'Social Butterfly', icon: '🦋', description: 'Connected with 10 mentors', earned: false },
        { id: '5', name: 'Night Owl', icon: '🦉', description: 'Studied past midnight', earned: true },
        { id: '6', name: 'Perfectionist', icon: '✨', description: 'Got 100% on an assessment', earned: false },
    ]

    const profileCompletion = 75

    const handleSave = () => {
        // TODO: API call to save profile
        setIsEditing(false)
    }

    const handleCancel = () => {
        // Reset form data
        setFormData({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            location: user?.location || '',
            bio: user?.bio || '',
            title: 'Software Developer',
            website: '',
            github: '',
            linkedin: '',
        })
        setIsEditing(false)
    }

    const tabs = [
        { id: 'about', label: 'About' },
        { id: 'experience', label: 'Experience' },
        { id: 'skills', label: 'Skills & Interests' },
        { id: 'achievements', label: 'Achievements' },
    ]

    return (
        <div className="space-y-6">
            {/* Profile Header */}
            <FadeIn>
                <Card className="relative overflow-hidden">
                    {/* Cover Image */}
                    <div className="h-32 md:h-48 bg-gradient-to-r from-primary via-secondary to-primary" />

                    <div className="px-6 pb-6">
                        {/* Avatar and Actions */}
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 md:-mt-20 gap-4">
                            <div className="flex flex-col md:flex-row md:items-end gap-4">
                                <div className="relative">
                                    <Avatar
                                        src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.firstName}`}
                                        alt={`${user?.firstName} ${user?.lastName}`}
                                        size="xl"
                                        className="ring-4 ring-white dark:ring-gray-900 w-32 h-32"
                                    />
                                    {isEditing && (
                                        <button className="absolute bottom-2 right-2 p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
                                            <Camera className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    {isEditing ? (
                                        <div className="flex gap-2">
                                            <Input
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                placeholder="First Name"
                                                className="w-32"
                                            />
                                            <Input
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                placeholder="Last Name"
                                                className="w-32"
                                            />
                                        </div>
                                    ) : (
                                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {user?.firstName} {user?.lastName}
                                        </h1>
                                    )}
                                    {isEditing ? (
                                        <Input
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Title"
                                            className="w-64"
                                        />
                                    ) : (
                                        <p className="text-gray-600 dark:text-gray-400">{formData.title}</p>
                                    )}
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {user?.location || 'Location not set'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            Joined {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {isEditing ? (
                                    <>
                                        <Button variant="outline" icon={<X />} onClick={handleCancel}>
                                            Cancel
                                        </Button>
                                        <Button variant="primary" icon={<Save />} onClick={handleSave}>
                                            Save Changes
                                        </Button>
                                    </>
                                ) : (
                                    <Button variant="primary" icon={<Edit2 />} onClick={() => setIsEditing(true)}>
                                        Edit Profile
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Profile Completion */}
                        <div className="mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Profile Completion
                                </span>
                                <span className="text-sm text-gray-500">{profileCompletion}%</span>
                            </div>
                            <Progress value={profileCompletion} variant="primary" />
                            {profileCompletion < 100 && (
                                <p className="text-xs text-gray-500 mt-2">
                                    Complete your profile to unlock all features
                                </p>
                            )}
                        </div>
                    </div>
                </Card>
            </FadeIn>

            {/* Tabs */}
            <FadeIn delay={0.1}>
                <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as typeof activeTab)}
                            className={cn(
                                'flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap',
                                activeTab === tab.id
                                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </FadeIn>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* About Tab */}
                    {activeTab === 'about' && (
                        <div className="grid md:grid-cols-3 gap-6">
                            <Card className="md:col-span-2 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    About Me
                                </h2>
                                {isEditing ? (
                                    <Textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        placeholder="Tell us about yourself..."
                                        rows={5}
                                    />
                                ) : (
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {formData.bio || 'No bio yet. Click Edit Profile to add one!'}
                                    </p>
                                )}

                                <h3 className="text-md font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                                    Contact & Links
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-600 dark:text-gray-400">{user?.email}</span>
                                    </div>
                                    {isEditing ? (
                                        <>
                                            <div className="flex items-center gap-3">
                                                <Globe className="w-5 h-5 text-gray-400" />
                                                <Input
                                                    value={formData.website}
                                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                                    placeholder="Website URL"
                                                />
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Github className="w-5 h-5 text-gray-400" />
                                                <Input
                                                    value={formData.github}
                                                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                                    placeholder="GitHub username"
                                                />
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Linkedin className="w-5 h-5 text-gray-400" />
                                                <Input
                                                    value={formData.linkedin}
                                                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                                    placeholder="LinkedIn URL"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {formData.website && (
                                                <a href={formData.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-primary hover:underline">
                                                    <Globe className="w-5 h-5" />
                                                    {formData.website}
                                                </a>
                                            )}
                                        </>
                                    )}
                                </div>
                            </Card>

                            <Card className="p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Stats
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Level</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {gamification?.currentLevel || 5}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Total XP</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {gamification?.currentXp || 850}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Courses Completed</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">12</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Mentorship Sessions</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">8</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Badges Earned</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {badges.filter(b => b.earned).length}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* Experience Tab */}
                    {activeTab === 'experience' && (
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Experience
                                </h2>
                                {isEditing && (
                                    <Button variant="outline" size="sm">
                                        Add Experience
                                    </Button>
                                )}
                            </div>
                            <div className="relative">
                                {/* Timeline line */}
                                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

                                <div className="space-y-8">
                                    {experiences.map((exp, index) => (
                                        <div key={exp.id} className="relative pl-10">
                                            {/* Timeline dot */}
                                            <div className={cn(
                                                'absolute left-2 w-5 h-5 rounded-full border-2 border-white dark:border-gray-900',
                                                exp.current ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                                            )} />

                                            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                                            {exp.title}
                                                        </h3>
                                                        <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                                            <Briefcase className="w-4 h-4" />
                                                            {exp.company}
                                                        </p>
                                                    </div>
                                                    {exp.current && (
                                                        <Badge variant="success">Current</Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                                    {' - '}
                                                    {exp.endDate
                                                        ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                                        : 'Present'
                                                    }
                                                </p>
                                                <p className="text-gray-600 dark:text-gray-400 mt-2">
                                                    {exp.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Skills & Interests Tab */}
                    {activeTab === 'skills' && (
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Skills
                                </h2>
                                <div className="space-y-4">
                                    {skills.map((skill) => (
                                        <div key={skill.name} className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {skill.name}
                                                </span>
                                                <span className="text-xs text-gray-500">{skill.level}%</span>
                                            </div>
                                            <Progress value={skill.level} size="sm" />
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card className="p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Interests
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {interests.map((interest) => (
                                        <Badge key={interest} variant="secondary" className="text-sm">
                                            {interest}
                                        </Badge>
                                    ))}
                                </div>

                                {isEditing && (
                                    <div className="mt-4">
                                        <Input placeholder="Add new interest..." />
                                    </div>
                                )}
                            </Card>
                        </div>
                    )}

                    {/* Achievements Tab */}
                    {activeTab === 'achievements' && (
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                                Achievements & Badges
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                {badges.map((badge) => (
                                    <motion.div
                                        key={badge.id}
                                        whileHover={{ scale: badge.earned ? 1.05 : 1 }}
                                        className={cn(
                                            'p-4 rounded-xl text-center transition-all',
                                            badge.earned
                                                ? 'bg-gradient-to-br from-primary/10 to-secondary/10 cursor-pointer'
                                                : 'bg-gray-100 dark:bg-gray-800 opacity-50'
                                        )}
                                    >
                                        <div className="text-4xl mb-2">{badge.icon}</div>
                                        <h3 className="font-medium text-sm text-gray-900 dark:text-white">
                                            {badge.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {badge.description}
                                        </p>
                                        {!badge.earned && (
                                            <Badge variant="secondary" className="mt-2 text-xs">
                                                Locked
                                            </Badge>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </Card>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default UserProfile
