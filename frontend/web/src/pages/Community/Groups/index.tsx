import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    Search,
    Plus,
    Users,
    Calendar,
    BookOpen,
    MessageSquare,
    Lock,
    Globe,
    ArrowRight,
    Star,
} from 'lucide-react'
import { toast } from 'react-hot-toast'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Avatar, AvatarGroup } from '@/components/ui/Avatar'
import { Progress } from '@/components/ui/Progress'
import Modal from '@/components/ui/Modal'
import { Textarea } from '@/components/ui/Textarea'
import FadeIn from '@/components/animations/FadeIn'
import StaggerChildren from '@/components/animations/StaggerChildren'
import communityService, { StudyGroup } from '@/services/community'
import { cn } from '@/utils/cn'

const topics = ['React', 'TypeScript', 'Node.js', 'System Design', 'Python', 'AWS', 'Interview Prep']

const GroupsIndex: React.FC = () => {
    const navigate = useNavigate()

    const [groups, setGroups] = useState<StudyGroup[]>([])
    const [myGroups, setMyGroups] = useState<StudyGroup[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
    const [showCreateModal, setShowCreateModal] = useState(false)

    const [newGroup, setNewGroup] = useState({
        name: '',
        description: '',
        topic: '',
        maxMembers: 10,
        isPrivate: false,
    })

    useEffect(() => {
        loadGroups()
    }, [selectedTopic])

    const loadGroups = async () => {
        setLoading(true)
        try {
            const [allGroups, userGroups] = await Promise.all([
                communityService.getGroups({ topic: selectedTopic || undefined, joinable: true }),
                communityService.getGroups({ myGroups: true })
            ])
            setGroups(allGroups)
            setMyGroups(userGroups)
        } catch (error) {
            toast.error('Failed to load groups')
        } finally {
            setLoading(false)
        }
    }

    const handleCreateGroup = async () => {
        if (!newGroup.name.trim() || !newGroup.description.trim() || !newGroup.topic) {
            toast.error('Please fill in all required fields')
            return
        }
        try {
            const group = await communityService.createGroup(newGroup)
            setMyGroups(prev => [...prev, group])
            setShowCreateModal(false)
            setNewGroup({ name: '', description: '', topic: '', maxMembers: 10, isPrivate: false })
            toast.success('Group created!')
            navigate(`/community/groups/${group.id}`)
        } catch (error) {
            toast.error('Failed to create group')
        }
    }

    const handleJoinGroup = async (groupId: string, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        try {
            await communityService.joinGroup(groupId)
            const group = groups.find(g => g.id === groupId)
            if (group) {
                setMyGroups(prev => [...prev, group])
                setGroups(prev => prev.filter(g => g.id !== groupId))
            }
            toast.success('Joined group!')
        } catch (error) {
            toast.error('Failed to join group')
        }
    }

    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.topic.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <FadeIn>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Study Groups
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Learn together, grow together
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        icon={<Plus />}
                        onClick={() => setShowCreateModal(true)}
                    >
                        Create Group
                    </Button>
                </div>
            </FadeIn>

            {/* My Groups */}
            {myGroups.length > 0 && (
                <FadeIn delay={0.1}>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        My Groups
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {myGroups.map((group) => (
                            <Link key={group.id} to={`/community/groups/${group.id}`}>
                                <Card className="p-4 hover:border-primary/50 transition-colors h-full">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                                            {group.name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {group.name}
                                            </h3>
                                            <Badge variant="secondary" className="text-xs">{group.topic}</Badge>
                                        </div>
                                        {group.isPrivate && <Lock className="w-4 h-4 text-gray-400" />}
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            {group.memberCount} members
                                        </div>
                                        {group.nextMeeting && (
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(group.nextMeeting.date).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </FadeIn>
            )}

            {/* Search and Filters */}
            <FadeIn delay={0.15}>
                <Card className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="flex-1">
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search groups..."
                                leftIcon={<Search className="w-4 h-4" />}
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={selectedTopic === null ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedTopic(null)}
                        >
                            All Topics
                        </Button>
                        {topics.map((topic) => (
                            <Button
                                key={topic}
                                variant={selectedTopic === topic ? 'primary' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedTopic(topic)}
                            >
                                {topic}
                            </Button>
                        ))}
                    </div>
                </Card>
            </FadeIn>

            {/* Discover Groups */}
            <FadeIn delay={0.2}>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Discover Groups
                </h2>
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Card key={i} className="p-6 animate-pulse">
                                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                            </Card>
                        ))}
                    </div>
                ) : (
                    <StaggerChildren staggerDelay={0.05}>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredGroups.map((group) => (
                                <motion.div key={group.id} whileHover={{ y: -4 }}>
                                    <Link to={`/community/groups/${group.id}`}>
                                        <Card className="p-6 h-full flex flex-col hover:border-primary/50 transition-colors">
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/80 to-secondary/80 flex items-center justify-center text-white font-bold text-xl">
                                                    {group.name.charAt(0)}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {group.isPrivate ? (
                                                        <Badge variant="secondary"><Lock className="w-3 h-3 mr-1" />Private</Badge>
                                                    ) : (
                                                        <Badge variant="secondary"><Globe className="w-3 h-3 mr-1" />Public</Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                {group.name}
                                            </h3>
                                            <Badge variant="primary" className="w-fit mb-3">{group.topic}</Badge>

                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-grow line-clamp-2">
                                                {group.description}
                                            </p>

                                            {/* Owner */}
                                            <div className="flex items-center gap-2 mb-4">
                                                <Avatar src={group.owner.avatar} alt={group.owner.name} size="sm" />
                                                <span className="text-sm text-gray-500">
                                                    Created by {group.owner.name}
                                                </span>
                                            </div>

                                            {/* Stats */}
                                            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                                <div className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    {group.memberCount}/{group.maxMembers}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <BookOpen className="w-4 h-4" />
                                                    {group.resources.length} resources
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4" />
                                                    {group.projects.length} projects
                                                </div>
                                            </div>

                                            {/* Progress for filling */}
                                            <Progress
                                                value={(group.memberCount / group.maxMembers) * 100}
                                                size="sm"
                                                className="mb-4"
                                            />

                                            {/* Actions */}
                                            <Button
                                                variant="primary"
                                                fullWidth
                                                icon={<ArrowRight className="w-4 h-4" />}
                                                iconPosition="right"
                                                onClick={(e) => handleJoinGroup(group.id, e)}
                                                disabled={group.memberCount >= group.maxMembers}
                                            >
                                                {group.memberCount >= group.maxMembers ? 'Full' : 'Join Group'}
                                            </Button>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </StaggerChildren>
                )}
            </FadeIn>

            {/* Create Group Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Create Study Group"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Group Name *
                        </label>
                        <Input
                            value={newGroup.name}
                            onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., React Masters"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Topic *
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {topics.map((topic) => (
                                <button
                                    key={topic}
                                    onClick={() => setNewGroup(prev => ({ ...prev, topic }))}
                                    className={cn(
                                        'px-3 py-1.5 text-sm rounded-full transition-colors',
                                        newGroup.topic === topic
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    )}
                                >
                                    {topic}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description *
                        </label>
                        <Textarea
                            value={newGroup.description}
                            onChange={(e) => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="What will your group focus on?"
                            rows={3}
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Max Members
                            </label>
                            <Input
                                type="number"
                                value={newGroup.maxMembers}
                                onChange={(e) => setNewGroup(prev => ({ ...prev, maxMembers: parseInt(e.target.value) || 10 }))}
                                min={2}
                                max={50}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Visibility
                            </label>
                            <button
                                onClick={() => setNewGroup(prev => ({ ...prev, isPrivate: !prev.isPrivate }))}
                                className={cn(
                                    'w-full p-2 rounded-lg flex items-center justify-center gap-2 transition-colors',
                                    newGroup.isPrivate
                                        ? 'bg-gray-200 dark:bg-gray-700'
                                        : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                )}
                            >
                                {newGroup.isPrivate ? (
                                    <><Lock className="w-4 h-4" /> Private</>
                                ) : (
                                    <><Globe className="w-4 h-4" /> Public</>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button variant="outline" fullWidth onClick={() => setShowCreateModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" fullWidth onClick={handleCreateGroup}>
                            Create Group
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default GroupsIndex
