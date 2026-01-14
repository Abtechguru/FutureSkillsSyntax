import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    MessageSquare,
    X,
    Send,
    Sparkles,
    User,
    Bot,
    Lightbulb,
    TrendingUp,
    Users,
    BookOpen
} from 'lucide-react'
import { cn } from '@/utils/cn'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
}

const quickSuggestions = [
    { icon: Users, text: "Show users registered today" },
    { icon: TrendingUp, text: "What's our growth rate?" },
    { icon: BookOpen, text: "Most popular courses" },
    { icon: Lightbulb, text: "Improvement suggestions" },
]

// Smart mock AI responses
const generateAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes('user') && lowerQuery.includes('today')) {
        return `📊 **Today's User Activity**\n\n• New registrations: **47 users**\n• Active users: **1,284**\n• Peak hour: 2:00 PM - 3:00 PM\n\nThat's a 12% increase compared to yesterday! Most new users are signing up as mentees.`
    }

    if (lowerQuery.includes('growth') || lowerQuery.includes('rate')) {
        return `📈 **Growth Metrics**\n\n• Weekly user growth: **+8.5%**\n• Monthly active users: **4,521**\n• Course completion rate: **73%**\n• Mentor satisfaction: **4.8/5** ⭐\n\nRecommendation: Consider running a referral campaign to boost growth further.`
    }

    if (lowerQuery.includes('popular') || lowerQuery.includes('course')) {
        return `🏆 **Top Performing Courses**\n\n1. **JavaScript Fundamentals** - 892 enrollments\n2. **Python for Data Science** - 654 enrollments\n3. **React Development** - 543 enrollments\n4. **Cloud Computing Basics** - 421 enrollments\n\nTip: JavaScript courses have 40% higher completion rates!`
    }

    if (lowerQuery.includes('improve') || lowerQuery.includes('suggestion')) {
        return `💡 **AI Recommendations**\n\n1. **Engagement**: 15% of users haven't logged in this week - send a re-engagement email\n2. **Content**: Add more intermediate-level courses - there's high demand\n3. **Mentorship**: 8 mentors have availability - match them with waiting mentees\n4. **Performance**: Consider caching API responses to improve load times`
    }

    if (lowerQuery.includes('help') || lowerQuery.includes('what can')) {
        return `👋 **I can help you with:**\n\n• User analytics and statistics\n• Content performance insights\n• Growth and engagement metrics\n• System health monitoring\n• Actionable recommendations\n• Quick administrative tasks\n\nJust ask me anything about your platform!`
    }

    return `I understand you're asking about "${query}". Based on your platform data:\n\n• Total users: **1,284**\n• Active courses: **42**\n• Pending reviews: **12**\n\nWould you like more specific information? Try asking about users, courses, growth, or improvement suggestions.`
}

const AdminAIAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: '👋 Hi! I\'m your AI admin assistant. I can help you with analytics, user management, and platform insights. What would you like to know?',
            timestamp: new Date(),
        }
    ])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async (text?: string) => {
        const messageText = text || input
        if (!messageText.trim()) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: messageText,
            timestamp: new Date(),
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsTyping(true)

        // Simulate AI thinking
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

        const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: generateAIResponse(messageText),
            timestamp: new Date(),
        }

        setIsTyping(false)
        setMessages(prev => [...prev, aiResponse])
    }

    return (
        <>
            {/* Floating Button */}
            <motion.button
                onClick={() => setIsOpen(true)}
                className={cn(
                    'fixed bottom-6 right-6 z-50',
                    'w-14 h-14 rounded-full',
                    'bg-gradient-to-r from-primary via-purple-500 to-pink-500',
                    'text-white shadow-2xl shadow-primary/30',
                    'flex items-center justify-center',
                    'hover:scale-110 transition-transform',
                    isOpen && 'hidden'
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <Sparkles className="w-6 h-6" />
            </motion.button>

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className={cn(
                            'fixed bottom-6 right-6 z-50',
                            'w-96 h-[32rem]',
                            'bg-white dark:bg-gray-900',
                            'rounded-2xl shadow-2xl',
                            'border border-gray-200 dark:border-gray-700',
                            'flex flex-col overflow-hidden'
                        )}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-white">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">AI Assistant</p>
                                    <p className="text-xs text-white/70">Always here to help</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        'flex gap-2',
                                        message.role === 'user' && 'flex-row-reverse'
                                    )}
                                >
                                    <div className={cn(
                                        'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                                        message.role === 'assistant'
                                            ? 'bg-gradient-to-r from-primary to-purple-500 text-white'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                                    )}>
                                        {message.role === 'assistant' ? (
                                            <Bot className="w-4 h-4" />
                                        ) : (
                                            <User className="w-4 h-4" />
                                        )}
                                    </div>
                                    <div className={cn(
                                        'max-w-[80%] rounded-2xl px-4 py-2 text-sm',
                                        message.role === 'assistant'
                                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                                            : 'bg-primary text-white'
                                    )}>
                                        <p className="whitespace-pre-wrap">{message.content}</p>
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-2"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center text-white">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Suggestions */}
                        {messages.length <= 2 && (
                            <div className="px-4 pb-2">
                                <p className="text-xs text-gray-500 mb-2">Quick suggestions:</p>
                                <div className="flex flex-wrap gap-2">
                                    {quickSuggestions.map((suggestion, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSend(suggestion.text)}
                                            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <suggestion.icon className="w-3 h-3" />
                                            <span>{suggestion.text}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input */}
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask me anything..."
                                    className="flex-1 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-full border-0 focus:ring-2 focus:ring-primary outline-none"
                                />
                                <button
                                    onClick={() => handleSend()}
                                    disabled={!input.trim()}
                                    className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-50 hover:bg-primary/90 transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default AdminAIAssistant
