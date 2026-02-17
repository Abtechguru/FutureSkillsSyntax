import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ChevronLeft,
    Plus,
    BookOpen,
    ExternalLink,
    Terminal,
    MessageSquare,
    FileText
} from 'lucide-react'
import { toast } from 'react-hot-toast'

import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import mentorshipService from '@/services/mentorship'
import type { MentorSession } from '@/services/mentorship'
import { cn } from '@/utils/cn'
import CodePlayground from '@/components/mentorship/CodePlayground'
import { useAuth } from '@/hooks/useAuth'

type SidePanel = 'chat' | 'code' | 'whiteboard' | 'notes' | 'tasks' | 'classroom' | null

const SessionRoom: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { user } = useAuth()

    // Session state
    const [session, setSession] = useState<MentorSession | null>(null)
    const [loading, setLoading] = useState(true)

    // Side panel
    const [activePanel, setActivePanel] = useState<SidePanel>('code')

    // Classroom state
    const [classroomLink, setClassroomLink] = useState('')

    // Tasks state
    const [tasks, setTasks] = useState<any[]>([])
    const [newTaskTitle, setNewTaskTitle] = useState('')

    // WebSocket Ref for classroom sync
    const socketRef = useRef<WebSocket | null>(null)

    useEffect(() => {
        loadSession()
        setupCollaboration()
        return () => socketRef.current?.close()
    }, [id])

    const loadSession = async () => {
        setLoading(true)
        try {
            const data = await mentorshipService.getSession(id!)
            setSession(data)
            if (data.classroom_link) setClassroomLink(data.classroom_link)

            // Fetch tasks if assignment exists
            if (data.assignment_id) {
                const tasksData = await mentorshipService.getAssignmentTasks(data.assignment_id)
                setTasks(tasksData)
            }
        } catch (error) {
            toast.error('Failed to load session')
        } finally {
            setLoading(false)
        }
    }

    const setupCollaboration = () => {
        const token = localStorage.getItem('token')
        if (!token || !id) return

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const hostname = window.location.hostname;
        const port = hostname === 'localhost' ? '8000' : window.location.port;
        const wsUrl = `${protocol}//${hostname}${port ? `:${port}` : ''}/api/v1/collaboration/${id}/ws?token=${token}`;

        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'classroom_link') {
                setClassroomLink(message.data.link)
                toast.success('Live classroom link updated!')
            }
        };
    }

    const updateClassroomLink = () => {
        if (!classroomLink.trim()) return
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: 'classroom_link',
                data: { link: classroomLink }
            }))
            toast.success('Classroom link shared with mentee!')
        }
    }

    const endCall = async () => {
        try {
            await mentorshipService.endSession(id!)
            toast.success('Session ended')
            navigate('/mentorship/sessions')
        } catch (error) {
            toast.error('Failed to end session')
        }
    }

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-900">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        )
    }

    return (
        <div className="h-screen flex flex-col bg-gray-900 text-white">
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={<ChevronLeft />}
                        onClick={() => navigate(-1)}
                        className="text-gray-400 hover:text-white"
                    />
                    <div>
                        <h1 className="font-semibold">{session?.title || 'Session'}</h1>
                        <p className="text-sm text-gray-400">
                            with {user?.id === session?.mentorId ? session?.mentee?.name : session?.mentor?.name}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant="success">
                        Live Collaboration
                    </Badge>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={endCall}
                        className="ml-4"
                    >
                        End Session
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Main Workspace Area (IDE or Classroom) */}
                <div className="flex-1 relative bg-[#1e1e1e] flex flex-col">
                    {activePanel === 'classroom' && classroomLink ? (
                        <div className="flex-1 flex flex-col">
                            <div className="p-2 bg-gray-800 flex justify-between items-center">
                                <span className="text-sm text-gray-400 flex items-center gap-2">
                                    <BookOpen size={16} /> Live Classroom: {classroomLink}
                                </span>
                                <Button size="sm" variant="ghost" icon={<ExternalLink size={14} />} onClick={() => window.open(classroomLink, '_blank')}>
                                    Open Externally
                                </Button>
                            </div>
                            <iframe
                                src={classroomLink}
                                className="flex-1 w-full border-none"
                                title="Classroom"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col">
                            <CodePlayground
                                sessionId={parseInt(id!)}
                                role={user?.role === 'mentor' ? 'mentor' : 'mentee'}
                                userId={parseInt(user?.id || '0')}
                            />
                        </div>
                    )}
                </div>

                {/* Side Panel Toggle */}
                <div className="flex flex-col bg-gray-800 border-l border-gray-700">
                    {[
                        { id: 'code', icon: Terminal, label: 'IDE' },
                        { id: 'classroom', icon: BookOpen, label: 'Class' },
                        { id: 'chat', icon: MessageSquare, label: 'Chat' },
                        { id: 'tasks', icon: ListIcon, label: 'Tasks' },
                        { id: 'notes', icon: FileText, label: 'Notes' },
                    ].map((panel) => (
                        <button
                            key={panel.id}
                            onClick={() => setActivePanel(activePanel === panel.id ? null : panel.id as SidePanel)}
                            className={cn(
                                'p-3 flex flex-col items-center gap-1 transition-colors min-w-[64px]',
                                activePanel === panel.id
                                    ? 'bg-primary text-white'
                                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                            )}
                        >
                            <panel.icon className="w-5 h-5" />
                            <span className="text-[10px]">{panel.label}</span>
                        </button>
                    ))}
                </div>

                {/* Side Panel Content */}
                <AnimatePresence>
                    {activePanel && activePanel !== 'code' && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 384, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="bg-gray-800 border-l border-gray-700 flex flex-col overflow-hidden"
                        >
                            {activePanel === 'classroom' && (
                                <div className="p-4 flex flex-col gap-4">
                                    <h3 className="font-semibold">Classroom Integration</h3>
                                    {user?.role === 'mentor' ? (
                                        <div className="space-y-4">
                                            <p className="text-sm text-gray-400">Paste a link to a video, document, or external tool to share it with your mentee instantly.</p>
                                            <Input
                                                value={classroomLink}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClassroomLink(e.target.value)}
                                                placeholder="https://..."
                                            />
                                            <Button variant="primary" fullWidth onClick={updateClassroomLink}>
                                                Push to Mentee
                                            </Button>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-400">Your mentor will share classroom materials here when the session begins.</p>
                                    )}
                                </div>
                            )}

                            {activePanel === 'tasks' && (
                                <div className="flex-1 flex flex-col p-4 overflow-y-auto">
                                    <h3 className="font-semibold mb-4">Assignments</h3>
                                    {user?.role === 'mentor' && (
                                        <div className="flex gap-2 mb-4">
                                            <Input
                                                value={newTaskTitle}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTaskTitle(e.target.value)}
                                                placeholder="Task title..."
                                                className="flex-1"
                                            />
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                icon={<Plus size={16} />}
                                                onClick={async () => {
                                                    if (!newTaskTitle.trim()) return;
                                                    try {
                                                        const newTask = await mentorshipService.addTask({
                                                            assignment_id: session?.assignment_id,
                                                            title: newTaskTitle,
                                                            language: 'javascript'
                                                        });
                                                        setTasks([newTask, ...tasks]);
                                                        setNewTaskTitle('');
                                                        toast.success('Task assigned!');
                                                    } catch (err) {
                                                        toast.error('Failed to assign task');
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                    <div className="space-y-3">
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-wider">Active Tasks</p>
                                        {tasks.length === 0 ? (
                                            <p className="text-xs text-gray-500 italic">No tasks assigned yet.</p>
                                        ) : (
                                            tasks.map((task: any) => (
                                                <div key={task.id} className="p-3 bg-gray-700/50 rounded-lg border-l-2 border-primary group hover:bg-gray-700 transition-colors">
                                                    <div className="flex justify-between items-start">
                                                        <p className="text-sm font-semibold">{task.title}</p>
                                                        <Badge size="sm" variant={task.status === 'submitted' ? 'success' : 'warning'}>
                                                            {task.status}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-[10px] text-gray-400 mt-1 uppercase">{task.language}</p>
                                                    {user?.role === 'mentee' && task.status !== 'submitted' && (
                                                        <Button
                                                            variant="primary"
                                                            size="xs"
                                                            className="mt-2 w-full text-[10px] h-7"
                                                            onClick={() => setActivePanel('code')}
                                                        >
                                                            Start Working
                                                        </Button>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {activePanel === 'chat' && (
                                <div className="flex-1 flex flex-col h-full items-center justify-center text-gray-500 text-sm italic">
                                    Chat integration coming soon...
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

const ListIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
)

export default SessionRoom
