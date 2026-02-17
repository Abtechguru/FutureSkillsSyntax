import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
    CheckCircle2,
    X,
    Smile,
    Meh,
    Frown,
    Zap,
    TrendingUp,
    AlertCircle,
    Heart,
    Target,
    Sparkles,
} from 'lucide-react'
import { cn } from '@/utils/cn'

interface DailyCheckInProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (checkIn: any) => void
    goals?: Array<{ id: string; title: string }>
}

const DailyCheckIn: React.FC<DailyCheckInProps> = ({ isOpen, onClose, onSubmit, goals = [] }) => {
    const [formData, setFormData] = useState({
        goal_id: '',
        mood: '',
        progress_note: '',
        wins: '',
        challenges: '',
        progress_value: '',
        is_public: true,
    })

    const moods = [
        { value: 'excellent', label: 'Excellent', emoji: '🚀', color: 'from-green-500 to-emerald-500', icon: Zap },
        { value: 'good', label: 'Good', emoji: '😊', color: 'from-blue-500 to-cyan-500', icon: Smile },
        { value: 'neutral', label: 'Neutral', emoji: '😐', color: 'from-gray-500 to-slate-500', icon: Meh },
        { value: 'struggling', label: 'Struggling', emoji: '😓', color: 'from-orange-500 to-amber-500', icon: Frown },
        { value: 'need_help', label: 'Need Help', emoji: '🆘', color: 'from-red-500 to-rose-500', icon: AlertCircle },
    ]

    const handleSubmit = () => {
        if (!formData.mood) {
            alert('Please select your mood')
            return
        }
        onSubmit(formData)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800"
            >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Daily Check-in</h2>
                            <p className="text-sm text-blue-100">How's your progress today?</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Select Goal */}
                    {goals.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Which goal are you checking in on? (Optional)
                            </label>
                            <select
                                value={formData.goal_id}
                                onChange={(e) => setFormData({ ...formData, goal_id: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            >
                                <option value="">General check-in</option>
                                {goals.map((goal) => (
                                    <option key={goal.id} value={goal.id}>
                                        {goal.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Mood Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            How are you feeling today? *
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {moods.map((mood) => (
                                <button
                                    key={mood.value}
                                    onClick={() => setFormData({ ...formData, mood: mood.value })}
                                    className={cn(
                                        'p-4 rounded-xl border-2 transition-all text-center',
                                        formData.mood === mood.value
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:scale-105'
                                    )}
                                >
                                    <div className="text-3xl mb-2">{mood.emoji}</div>
                                    <div className="text-xs font-medium text-gray-900 dark:text-white">
                                        {mood.label}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Progress Note */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-blue-600" />
                                What progress did you make today?
                            </div>
                        </label>
                        <textarea
                            value={formData.progress_note}
                            onChange={(e) => setFormData({ ...formData, progress_note: e.target.value })}
                            placeholder="Describe what you accomplished today..."
                            rows={3}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                        />
                    </div>

                    {/* Wins */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-yellow-600" />
                                What wins are you celebrating? 🎉
                            </div>
                        </label>
                        <textarea
                            value={formData.wins}
                            onChange={(e) => setFormData({ ...formData, wins: e.target.value })}
                            placeholder="Share your victories, big or small..."
                            rows={3}
                            className="w-full px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none"
                        />
                    </div>

                    {/* Challenges */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-orange-600" />
                                Any challenges or blockers?
                            </div>
                        </label>
                        <textarea
                            value={formData.challenges}
                            onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                            placeholder="What's holding you back? The community can help..."
                            rows={3}
                            className="w-full px-4 py-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-none"
                        />
                    </div>

                    {/* Progress Value */}
                    {formData.goal_id && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-purple-600" />
                                    Update progress value (Optional)
                                </div>
                            </label>
                            <input
                                type="number"
                                value={formData.progress_value}
                                onChange={(e) => setFormData({ ...formData, progress_value: e.target.value })}
                                placeholder="e.g., 5 (hours studied today)"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                            />
                        </div>
                    )}

                    {/* Public Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                        <div className="flex items-start gap-3">
                            <Heart className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Share with community</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Get support and encouragement from others
                                </p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.is_public}
                                onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-pink-600"></div>
                        </label>
                    </div>

                    {/* Motivational Message */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                        <div className="flex gap-3">
                            <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-900 dark:text-blue-300">
                                <p className="font-medium mb-1">Keep up the great work! 💪</p>
                                <p className="text-blue-700 dark:text-blue-400">
                                    Daily check-ins increase goal completion rates by 42%. You're building a powerful habit!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-6">
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!formData.mood}
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                        >
                            <CheckCircle2 className="w-5 h-5" />
                            Complete Check-in
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default DailyCheckIn
