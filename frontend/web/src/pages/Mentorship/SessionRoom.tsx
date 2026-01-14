import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Video,
    VideoOff,
    Mic,
    MicOff,
    Phone,
    Monitor,
    MessageSquare,
    Code,
    PenTool,
    FileText,
    Settings,
    Users,
    ChevronLeft,
    ChevronRight,
    Send,
    Plus,
    Check,
    Circle,
    Square,
    Type,
    Eraser,
    Download,
    Play,
    Pause,
} from 'lucide-react'
import { toast } from 'react-hot-toast'

import Button from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Avatar } from '@/components/ui/Avatar'
import mentorshipService, { MentorSession, SessionNote, ActionItem } from '@/services/mentorship'
import { cn } from '@/utils/cn'

type SidePanel = 'chat' | 'code' | 'whiteboard' | 'notes' | null

const SessionRoom: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const codeEditorRef = useRef<HTMLTextAreaElement>(null)

    // Session state
    const [session, setSession] = useState<MentorSession | null>(null)
    const [loading, setLoading] = useState(true)

    // Video controls
    const [isVideoOn, setIsVideoOn] = useState(true)
    const [isAudioOn, setIsAudioOn] = useState(true)
    const [isScreenSharing, setIsScreenSharing] = useState(false)
    const [isRecording, setIsRecording] = useState(false)

    // Side panel
    const [activePanel, setActivePanel] = useState<SidePanel>('chat')

    // Chat state
    const [messages, setMessages] = useState<{ userId: string; name: string; content: string; time: string }[]>([])
    const [newMessage, setNewMessage] = useState('')

    // Code editor state
    const [code, setCode] = useState('// Start coding here...\n\nfunction example() {\n  console.log("Hello, world!");\n}')
    const [codeLanguage, setCodeLanguage] = useState('javascript')

    // Whiteboard state
    const [isDrawing, setIsDrawing] = useState(false)
    const [drawTool, setDrawTool] = useState<'pen' | 'line' | 'rect' | 'text' | 'eraser'>('pen')
    const [drawColor, setDrawColor] = useState('#4F46E5')

    // Notes state
    const [notes, setNotes] = useState<SessionNote[]>([])
    const [newNote, setNewNote] = useState('')
    const [actionItems, setActionItems] = useState<ActionItem[]>([])
    const [newActionItem, setNewActionItem] = useState('')

    useEffect(() => {
        loadSession()
    }, [id])

    const loadSession = async () => {
        setLoading(true)
        try {
            const data = await mentorshipService.getSession(id!)
            setSession(data)
            setNotes(data.notes || [])
            setActionItems(data.actionItems || [])
        } catch (error) {
            toast.error('Failed to load session')
        } finally {
            setLoading(false)
        }
    }

    // Video controls handlers
    const toggleVideo = () => setIsVideoOn(!isVideoOn)
    const toggleAudio = () => setIsAudioOn(!isAudioOn)
    const toggleScreenShare = () => {
        setIsScreenSharing(!isScreenSharing)
        toast.success(isScreenSharing ? 'Screen sharing stopped' : 'Screen sharing started')
    }
    const toggleRecording = () => {
        setIsRecording(!isRecording)
        toast.success(isRecording ? 'Recording stopped' : 'Recording started')
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

    // Chat handlers
    const sendMessage = () => {
        if (!newMessage.trim()) return
        setMessages(prev => [...prev, {
            userId: 'current',
            name: 'You',
            content: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }])
        setNewMessage('')
    }

    // Notes handlers
    const addNote = async () => {
        if (!newNote.trim()) return
        try {
            const note = await mentorshipService.addNote(id!, newNote)
            setNotes(prev => [...prev, note])
            setNewNote('')
        } catch (error) {
            toast.error('Failed to add note')
        }
    }

    const addActionItem = async () => {
        if (!newActionItem.trim()) return
        try {
            const item = await mentorshipService.addActionItem(id!, {
                title: newActionItem,
                completed: false,
                assignedTo: 'current'
            })
            setActionItems(prev => [...prev, item])
            setNewActionItem('')
        } catch (error) {
            toast.error('Failed to add action item')
        }
    }

    const toggleActionItem = async (itemId: string) => {
        try {
            await mentorshipService.toggleActionItem(id!, itemId)
            setActionItems(prev => prev.map(item =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
            ))
        } catch (error) {
            toast.error('Failed to update action item')
        }
    }

    // Whiteboard handlers
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDrawing(true)
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const rect = canvas.getBoundingClientRect()
        ctx.beginPath()
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
    }

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const rect = canvas.getBoundingClientRect()
        ctx.strokeStyle = drawTool === 'eraser' ? '#ffffff' : drawColor
        ctx.lineWidth = drawTool === 'eraser' ? 20 : 2
        ctx.lineCap = 'round'
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
        ctx.stroke()
    }

    const stopDrawing = () => {
        setIsDrawing(false)
    }

    const clearCanvas = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
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
                            with {session?.mentor?.name || 'Loading...'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {isRecording && (
                        <Badge variant="danger" className="animate-pulse">
                            <Circle className="w-2 h-2 fill-current mr-1" />
                            Recording
                        </Badge>
                    )}
                    <Badge variant="success">
                        {session?.status === 'in_progress' ? 'Live' : session?.status}
                    </Badge>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Video Area */}
                <div className="flex-1 relative bg-gray-900 p-4">
                    {/* Remote Video (Mentor) */}
                    <div className="absolute inset-4 rounded-xl bg-gray-800 flex items-center justify-center overflow-hidden">
                        {/* Placeholder for video stream */}
                        <div className="text-center">
                            <Avatar
                                src={session?.mentor?.avatar}
                                alt={session?.mentor?.name}
                                size="xl"
                                className="mx-auto mb-4"
                            />
                            <p className="text-lg font-medium">{session?.mentor?.name}</p>
                            <p className="text-gray-400">Connecting...</p>
                        </div>
                    </div>

                    {/* Local Video (Self) */}
                    <div className="absolute bottom-8 right-8 w-48 h-36 rounded-lg bg-gray-700 overflow-hidden shadow-lg">
                        {isVideoOn ? (
                            <div className="w-full h-full flex items-center justify-center">
                                <Avatar
                                    src={session?.mentee?.avatar}
                                    alt="You"
                                    size="lg"
                                />
                            </div>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                <VideoOff className="w-8 h-8 text-gray-500" />
                            </div>
                        )}
                    </div>

                    {/* Video Controls */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-full bg-gray-800/90 backdrop-blur-sm">
                        <button
                            onClick={toggleAudio}
                            className={cn(
                                'p-3 rounded-full transition-colors',
                                isAudioOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'
                            )}
                        >
                            {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={toggleVideo}
                            className={cn(
                                'p-3 rounded-full transition-colors',
                                isVideoOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'
                            )}
                        >
                            {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={toggleScreenShare}
                            className={cn(
                                'p-3 rounded-full transition-colors',
                                isScreenSharing ? 'bg-primary hover:bg-primary/90' : 'bg-gray-700 hover:bg-gray-600'
                            )}
                        >
                            <Monitor className="w-5 h-5" />
                        </button>
                        <button
                            onClick={toggleRecording}
                            className={cn(
                                'p-3 rounded-full transition-colors',
                                isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                            )}
                        >
                            {isRecording ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </button>
                        <div className="w-px h-8 bg-gray-600 mx-2" />
                        <button
                            onClick={endCall}
                            className="p-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                        >
                            <Phone className="w-5 h-5 rotate-[135deg]" />
                        </button>
                    </div>
                </div>

                {/* Side Panel Toggle */}
                <div className="flex flex-col bg-gray-800 border-l border-gray-700">
                    {[
                        { id: 'chat', icon: MessageSquare, label: 'Chat' },
                        { id: 'code', icon: Code, label: 'Code' },
                        { id: 'whiteboard', icon: PenTool, label: 'Board' },
                        { id: 'notes', icon: FileText, label: 'Notes' },
                    ].map((panel) => (
                        <button
                            key={panel.id}
                            onClick={() => setActivePanel(activePanel === panel.id ? null : panel.id as SidePanel)}
                            className={cn(
                                'p-3 flex flex-col items-center gap-1 transition-colors',
                                activePanel === panel.id
                                    ? 'bg-primary text-white'
                                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                            )}
                        >
                            <panel.icon className="w-5 h-5" />
                            <span className="text-xs">{panel.label}</span>
                        </button>
                    ))}
                </div>

                {/* Side Panel Content */}
                <AnimatePresence>
                    {activePanel && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 384, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="bg-gray-800 border-l border-gray-700 flex flex-col overflow-hidden"
                        >
                            {/* Chat Panel */}
                            {activePanel === 'chat' && (
                                <div className="flex-1 flex flex-col">
                                    <div className="p-4 border-b border-gray-700">
                                        <h3 className="font-semibold">Session Chat</h3>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                        {messages.map((msg, i) => (
                                            <div
                                                key={i}
                                                className={cn(
                                                    'flex gap-2',
                                                    msg.userId === 'current' ? 'flex-row-reverse' : ''
                                                )}
                                            >
                                                <Avatar
                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.name}`}
                                                    alt={msg.name}
                                                    size="sm"
                                                />
                                                <div className={cn(
                                                    'max-w-[70%] p-3 rounded-lg',
                                                    msg.userId === 'current'
                                                        ? 'bg-primary text-white'
                                                        : 'bg-gray-700'
                                                )}>
                                                    <p className="text-sm">{msg.content}</p>
                                                    <p className="text-xs opacity-60 mt-1">{msg.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-4 border-t border-gray-700">
                                        <div className="flex gap-2">
                                            <Input
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder="Type a message..."
                                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                                className="bg-gray-700 border-gray-600"
                                            />
                                            <Button variant="primary" icon={<Send />} onClick={sendMessage} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Code Editor Panel */}
                            {activePanel === 'code' && (
                                <div className="flex-1 flex flex-col">
                                    <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                                        <h3 className="font-semibold">Shared Code Editor</h3>
                                        <select
                                            value={codeLanguage}
                                            onChange={(e) => setCodeLanguage(e.target.value)}
                                            className="bg-gray-700 text-sm rounded px-2 py-1 border border-gray-600"
                                        >
                                            <option value="javascript">JavaScript</option>
                                            <option value="typescript">TypeScript</option>
                                            <option value="python">Python</option>
                                            <option value="java">Java</option>
                                        </select>
                                    </div>
                                    <textarea
                                        ref={codeEditorRef}
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        className="flex-1 bg-gray-900 text-green-400 font-mono text-sm p-4 resize-none focus:outline-none"
                                        spellCheck={false}
                                    />
                                    <div className="p-2 border-t border-gray-700 flex gap-2">
                                        <Button variant="primary" size="sm" icon={<Play />}>
                                            Run
                                        </Button>
                                        <Button variant="outline" size="sm" className="border-gray-600">
                                            Share
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Whiteboard Panel */}
                            {activePanel === 'whiteboard' && (
                                <div className="flex-1 flex flex-col">
                                    <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                                        <h3 className="font-semibold">Whiteboard</h3>
                                        <div className="flex gap-1">
                                            {(['pen', 'line', 'rect', 'text', 'eraser'] as const).map((tool) => (
                                                <button
                                                    key={tool}
                                                    onClick={() => setDrawTool(tool)}
                                                    className={cn(
                                                        'p-2 rounded transition-colors',
                                                        drawTool === tool ? 'bg-primary' : 'bg-gray-700 hover:bg-gray-600'
                                                    )}
                                                >
                                                    {tool === 'pen' && <PenTool className="w-4 h-4" />}
                                                    {tool === 'line' && <div className="w-4 h-0.5 bg-current rotate-45" />}
                                                    {tool === 'rect' && <Square className="w-4 h-4" />}
                                                    {tool === 'text' && <Type className="w-4 h-4" />}
                                                    {tool === 'eraser' && <Eraser className="w-4 h-4" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-2 border-b border-gray-700 flex items-center gap-2">
                                        {['#4F46E5', '#EF4444', '#10B981', '#F59E0B', '#000000'].map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setDrawColor(color)}
                                                className={cn(
                                                    'w-6 h-6 rounded-full',
                                                    drawColor === color && 'ring-2 ring-white'
                                                )}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                        <button
                                            onClick={clearCanvas}
                                            className="ml-auto text-sm text-gray-400 hover:text-white"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                    <div className="flex-1 bg-white">
                                        <canvas
                                            ref={canvasRef}
                                            width={384}
                                            height={400}
                                            onMouseDown={startDrawing}
                                            onMouseMove={draw}
                                            onMouseUp={stopDrawing}
                                            onMouseLeave={stopDrawing}
                                            className="cursor-crosshair"
                                        />
                                    </div>
                                    <div className="p-2 border-t border-gray-700">
                                        <Button variant="outline" size="sm" icon={<Download />} fullWidth className="border-gray-600">
                                            Save Image
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Notes Panel */}
                            {activePanel === 'notes' && (
                                <div className="flex-1 flex flex-col">
                                    <div className="p-4 border-b border-gray-700">
                                        <h3 className="font-semibold">Session Notes</h3>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                        {/* Notes */}
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-400 mb-2">Notes</h4>
                                            <div className="space-y-2">
                                                {notes.map((note) => (
                                                    <div key={note.id} className="p-3 rounded-lg bg-gray-700 text-sm">
                                                        {note.content}
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {new Date(note.createdAt).toLocaleTimeString()}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-2 flex gap-2">
                                                <Input
                                                    value={newNote}
                                                    onChange={(e) => setNewNote(e.target.value)}
                                                    placeholder="Add a note..."
                                                    className="bg-gray-700 border-gray-600"
                                                />
                                                <Button variant="primary" icon={<Plus />} onClick={addNote} />
                                            </div>
                                        </div>

                                        {/* Action Items */}
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-400 mb-2">Action Items</h4>
                                            <div className="space-y-2">
                                                {actionItems.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-700"
                                                    >
                                                        <button
                                                            onClick={() => toggleActionItem(item.id)}
                                                            className={cn(
                                                                'w-5 h-5 rounded border flex items-center justify-center',
                                                                item.completed
                                                                    ? 'bg-green-500 border-green-500'
                                                                    : 'border-gray-500'
                                                            )}
                                                        >
                                                            {item.completed && <Check className="w-3 h-3" />}
                                                        </button>
                                                        <span className={cn(
                                                            'flex-1 text-sm',
                                                            item.completed && 'line-through text-gray-400'
                                                        )}>
                                                            {item.title}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-2 flex gap-2">
                                                <Input
                                                    value={newActionItem}
                                                    onChange={(e) => setNewActionItem(e.target.value)}
                                                    placeholder="Add action item..."
                                                    className="bg-gray-700 border-gray-600"
                                                />
                                                <Button variant="primary" icon={<Plus />} onClick={addActionItem} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default SessionRoom
