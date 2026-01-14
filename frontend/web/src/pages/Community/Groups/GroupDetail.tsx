import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft,
    MessageSquare,
    BookOpen,
    Briefcase,
    Calendar,
    Settings,
    Send,
    Plus,
    Link as LinkIcon,
    FileText,
    Trash,
    Check,
    Users,
    Video,
    Clock,
    ChevronRight,
} from 'lucide-react'
import { toast } from 'react-hot-toast'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Progress } from '@/components/ui/Progress'
import Modal from '@/components/ui/Modal'
import FadeIn from '@/components/animations/FadeIn'
import communityService, {
    StudyGroup,
    GroupMessage,
    GroupResource,
    GroupProject,
    GroupMeeting
} from '@/services/community'
import { cn } from '@/utils/cn'

type ActiveTab = 'chat' | 'resources' | 'projects' | 'meetings' | 'members'

const GroupDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const chatEndRef = useRef<HTMLDivElement>(null)

    const [group, setGroup] = useState<StudyGroup | null>(null)
    const [messages, setMessages] = useState<GroupMessage[]>([])
    const [meetings, setMeetings] = useState<GroupMeeting[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<ActiveTab>('chat')
    const [newMessage, setNewMessage] = useState('')

    // Modals
    const [showAddResource, setShowAddResource] = useState(false)
    const [showNewProject, setShowNewProject] = useState(false)
    const [showScheduleMeeting, setShowScheduleMeeting] = useState(false)

    // New resource form
    const [newResource, setNewResource] = useState({
        title: '',
        type: 'link' as 'link' | 'file' | 'note',
        url: '',
        content: '',
    })

    // New project form
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        status: 'planning' as const,
        dueDate: '',
    })

    // New meeting form
    const [newMeeting, setNewMeeting] = useState({
        title: '',
        description: '',
        date: '',
        startTime: '',
        duration: 60,
    })

    useEffect(() => {
        loadGroup()
    }, [id])

    useEffect(() => {
        if (activeTab === 'chat') {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages, activeTab])

    const loadGroup = async () => {
        setLoading(true)
        try {
            const [groupData, messagesData, meetingsData] = await Promise.all([
                communityService.getGroup(id!),
                communityService.getMessages(id!),
                communityService.getMeetings(id!)
            ])
            setGroup(groupData)
            setMessages(messagesData)
            setMeetings(meetingsData)
        } catch (error) {
            toast.error('Failed to load group')
        } finally {
            setLoading(false)
        }
    }

    const sendMessage = async () => {
        if (!newMessage.trim()) return
        try {
            const msg = await communityService.sendMessage(id!, newMessage)
            setMessages(prev => [...prev, msg])
            setNewMessage('')
        } catch (error) {
            toast.error('Failed to send message')
        }
    }

    const addResource = async () => {
        try {
            const resource = await communityService.addResource(id!, newResource)
            setGroup(prev => prev ? {
                ...prev,
                resources: [...prev.resources, resource]
            } : null)
            setShowAddResource(false)
            setNewResource({ title: '', type: 'link', url: '', content: '' })
            toast.success('Resource added!')
        } catch (error) {
            toast.error('Failed to add resource')
        }
    }

    const createProject = async () => {
        try {
            const project = await communityService.createProject(id!, {
                ...newProject,
                members: [],
            })
            setGroup(prev => prev ? {
                ...prev,
                projects: [...prev.projects, project]
            } : null)
            setShowNewProject(false)
            setNewProject({ title: '', description: '', status: 'planning', dueDate: '' })
            toast.success('Project created!')
        } catch (error) {
            toast.error('Failed to create project')
        }
    }

    const toggleTask = async (projectId: string, taskId: string) => {
        try {
            await communityService.toggleProjectTask(id!, projectId, taskId)
            setGroup(prev => prev ? {
                ...prev,
                projects: prev.projects.map(p =>
                    p.id === projectId ? {
                        ...p,
                        tasks: p.tasks.map(t =>
                            t.id === taskId ? { ...t, completed: !t.completed } : t
                        )
                    } : p
                )
            } : null)
        } catch (error) {
            toast.error('Failed to update task')
        }
    }

    const scheduleMeeting = async () => {
        try {
            const meeting = await communityService.scheduleMeeting(id!, newMeeting)
            setMeetings(prev => [...prev, meeting])
            setShowScheduleMeeting(false)
            setNewMeeting({ title: '', description: '', date: '', startTime: '', duration: 60 })
            toast.success('Meeting scheduled!')
        } catch (error) {
            toast.error('Failed to schedule meeting')
        }
    }

    if (loading || !group) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
        )
    }

    const projectProgress = (project: GroupProject) => {
        if (!project.tasks.length) return 0
        return Math.round(project.tasks.filter(t => t.completed).length / project.tasks.length * 100)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <FadeIn>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" icon={<ArrowLeft />} onClick={() => navigate('/community/groups')}>
                        Back
                    </Button>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                                {group.name.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {group.name}
                                </h1>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary">{group.topic}</Badge>
                                    <span className="text-sm text-gray-500">
                                        {group.memberCount} members
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button variant="outline" icon={<Settings className="w-4 h-4" />}>
                        Settings
                    </Button>
                </div>
            </FadeIn>

            {/* Tabs */}
            <FadeIn delay={0.1}>
                <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
                    {([
                        { id: 'chat', icon: MessageSquare, label: 'Chat' },
                        { id: 'resources', icon: BookOpen, label: 'Resources' },
                        { id: 'projects', icon: Briefcase, label: 'Projects' },
                        { id: 'meetings', icon: Calendar, label: 'Meetings' },
                        { id: 'members', icon: Users, label: 'Members' },
                    ] as const).map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                'flex items-center gap-2 px-4 py-2 rounded-md transition-colors',
                                activeTab === tab.id
                                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </FadeIn>

            <AnimatePresence mode="wait">
                {/* Chat Tab */}
                {activeTab === 'chat' && (
                    <motion.div
                        key="chat"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <Card className="flex flex-col h-[600px]">
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((msg) => (
                                    <div key={msg.id} className="flex gap-3">
                                        <Avatar src={msg.author.avatar} alt={msg.author.name} size="sm" />
                                        <div className="flex-1">
                                            <div className="flex items-baseline gap-2">
                                                <span className="font-medium text-gray-900 dark:text-white text-sm">
                                                    {msg.author.name}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
                                                {msg.content}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Input */}
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex gap-2">
                                    <Input
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    />
                                    <Button variant="primary" icon={<Send />} onClick={sendMessage} />
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Resources Tab */}
                {activeTab === 'resources' && (
                    <motion.div
                        key="resources"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <div className="flex justify-end mb-4">
                            <Button variant="primary" icon={<Plus />} onClick={() => setShowAddResource(true)}>
                                Add Resource
                            </Button>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {group.resources.map((resource) => (
                                <Card key={resource.id} className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className={cn(
                                            'p-2 rounded-lg',
                                            resource.type === 'link' && 'bg-blue-100 dark:bg-blue-900/30',
                                            resource.type === 'file' && 'bg-green-100 dark:bg-green-900/30',
                                            resource.type === 'note' && 'bg-yellow-100 dark:bg-yellow-900/30',
                                        )}>
                                            {resource.type === 'link' && <LinkIcon className="w-5 h-5 text-blue-500" />}
                                            {resource.type === 'file' && <FileText className="w-5 h-5 text-green-500" />}
                                            {resource.type === 'note' && <FileText className="w-5 h-5 text-yellow-500" />}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900 dark:text-white">
                                                {resource.title}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Added {new Date(resource.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    {resource.url && (
                                        <a
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-3 text-sm text-primary hover:underline flex items-center gap-1"
                                        >
                                            Open link <ChevronRight className="w-4 h-4" />
                                        </a>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Projects Tab */}
                {activeTab === 'projects' && (
                    <motion.div
                        key="projects"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <div className="flex justify-end mb-4">
                            <Button variant="primary" icon={<Plus />} onClick={() => setShowNewProject(true)}>
                                New Project
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {group.projects.map((project) => (
                                <Card key={project.id} className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                                                {project.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                {project.description}
                                            </p>
                                        </div>
                                        <Badge variant={
                                            project.status === 'completed' ? 'success' :
                                                project.status === 'in_progress' ? 'primary' :
                                                    project.status === 'review' ? 'warning' : 'secondary'
                                        }>
                                            {project.status.replace('_', ' ')}
                                        </Badge>
                                    </div>

                                    <Progress value={projectProgress(project)} className="mb-4" />

                                    <div className="space-y-2">
                                        {project.tasks.map((task) => (
                                            <div
                                                key={task.id}
                                                className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
                                            >
                                                <button
                                                    onClick={() => toggleTask(project.id, task.id)}
                                                    className={cn(
                                                        'w-5 h-5 rounded border flex items-center justify-center',
                                                        task.completed
                                                            ? 'bg-green-500 border-green-500'
                                                            : 'border-gray-300 dark:border-gray-600'
                                                    )}
                                                >
                                                    {task.completed && <Check className="w-3 h-3 text-white" />}
                                                </button>
                                                <span className={cn(
                                                    'flex-1 text-sm',
                                                    task.completed && 'line-through text-gray-400'
                                                )}>
                                                    {task.title}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Meetings Tab */}
                {activeTab === 'meetings' && (
                    <motion.div
                        key="meetings"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <div className="flex justify-end mb-4">
                            <Button variant="primary" icon={<Plus />} onClick={() => setShowScheduleMeeting(true)}>
                                Schedule Meeting
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {meetings.map((meeting) => (
                                <Card key={meeting.id} className="p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-lg bg-primary/10">
                                            <Video className="w-6 h-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900 dark:text-white">
                                                {meeting.title}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(meeting.date).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {meeting.startTime} ({meeting.duration} min)
                                                </span>
                                            </div>
                                        </div>
                                        <Button variant="primary" size="sm">
                                            Join
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Members Tab */}
                {activeTab === 'members' && (
                    <motion.div
                        key="members"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {group.members.map((member) => (
                                <Card key={member.id} className="p-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar src={member.avatar} alt={member.name} size="lg" />
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900 dark:text-white">
                                                {member.name}
                                            </h3>
                                            <Badge variant={
                                                member.role === 'owner' ? 'primary' :
                                                    member.role === 'admin' ? 'warning' : 'secondary'
                                            } className="text-xs">
                                                {member.role}
                                            </Badge>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Resource Modal */}
            <Modal isOpen={showAddResource} onClose={() => setShowAddResource(false)} title="Add Resource">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <Input
                            value={newResource.title}
                            onChange={(e) => setNewResource(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Resource title"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Type</label>
                        <div className="flex gap-2">
                            {(['link', 'file', 'note'] as const).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setNewResource(prev => ({ ...prev, type }))}
                                    className={cn(
                                        'px-3 py-1.5 text-sm rounded-full capitalize',
                                        newResource.type === type
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'
                                    )}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                    {newResource.type === 'link' && (
                        <div>
                            <label className="block text-sm font-medium mb-1">URL</label>
                            <Input
                                value={newResource.url}
                                onChange={(e) => setNewResource(prev => ({ ...prev, url: e.target.value }))}
                                placeholder="https://..."
                            />
                        </div>
                    )}
                    {newResource.type === 'note' && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Content</label>
                            <Textarea
                                value={newResource.content}
                                onChange={(e) => setNewResource(prev => ({ ...prev, content: e.target.value }))}
                                placeholder="Note content..."
                                rows={4}
                            />
                        </div>
                    )}
                    <div className="flex gap-3">
                        <Button variant="outline" fullWidth onClick={() => setShowAddResource(false)}>Cancel</Button>
                        <Button variant="primary" fullWidth onClick={addResource}>Add</Button>
                    </div>
                </div>
            </Modal>

            {/* New Project Modal */}
            <Modal isOpen={showNewProject} onClose={() => setShowNewProject(false)} title="New Project">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <Input
                            value={newProject.title}
                            onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Project title"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <Textarea
                            value={newProject.description}
                            onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Project description..."
                            rows={3}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Due Date</label>
                        <Input
                            type="date"
                            value={newProject.dueDate}
                            onChange={(e) => setNewProject(prev => ({ ...prev, dueDate: e.target.value }))}
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" fullWidth onClick={() => setShowNewProject(false)}>Cancel</Button>
                        <Button variant="primary" fullWidth onClick={createProject}>Create</Button>
                    </div>
                </div>
            </Modal>

            {/* Schedule Meeting Modal */}
            <Modal isOpen={showScheduleMeeting} onClose={() => setShowScheduleMeeting(false)} title="Schedule Meeting">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <Input
                            value={newMeeting.title}
                            onChange={(e) => setNewMeeting(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Meeting title"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Date</label>
                            <Input
                                type="date"
                                value={newMeeting.date}
                                onChange={(e) => setNewMeeting(prev => ({ ...prev, date: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Time</label>
                            <Input
                                type="time"
                                value={newMeeting.startTime}
                                onChange={(e) => setNewMeeting(prev => ({ ...prev, startTime: e.target.value }))}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                        <Input
                            type="number"
                            value={newMeeting.duration}
                            onChange={(e) => setNewMeeting(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                            min={15}
                            max={180}
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" fullWidth onClick={() => setShowScheduleMeeting(false)}>Cancel</Button>
                        <Button variant="primary" fullWidth onClick={scheduleMeeting}>Schedule</Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default GroupDetail
