import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Target,
    Calendar,
    Flag,
    Tag,
    Plus,
    X,
    Sparkles,
    TrendingUp,
    AlertCircle,
} from 'lucide-react'
import { cn } from '@/utils/cn'

interface CreateGoalModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (goal: any) => void
}

const CreateGoalModal: React.FC<CreateGoalModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'learning',
        priority: 'medium',
        target_date: '',
        target_value: '',
        unit: '',
        milestones: [] as Array<{ title: string; description?: string; target_date?: string; target_value?: number }>,
        tags: [] as string[],
        is_public: false,
    })

    const [currentMilestone, setCurrentMilestone] = useState('')
    const [currentTag, setCurrentTag] = useState('')

    const categories = [
        { value: 'learning', label: 'Learning', emoji: '📚', color: 'from-blue-500 to-cyan-500' },
        { value: 'career', label: 'Career', emoji: '💼', color: 'from-purple-500 to-pink-500' },
        { value: 'health', label: 'Health', emoji: '💪', color: 'from-green-500 to-emerald-500' },
        { value: 'finance', label: 'Finance', emoji: '💰', color: 'from-yellow-500 to-orange-500' },
        { value: 'personal', label: 'Personal', emoji: '🌟', color: 'from-indigo-500 to-purple-500' },
        { value: 'creativity', label: 'Creativity', emoji: '🎨', color: 'from-pink-500 to-rose-500' },
    ]

    const priorities = [
        { value: 'low', label: 'Low', color: 'text-gray-600 bg-gray-100' },
        { value: 'medium', label: 'Medium', color: 'text-blue-600 bg-blue-100' },
        { value: 'high', label: 'High', color: 'text-orange-600 bg-orange-100' },
        { value: 'critical', label: 'Critical', color: 'text-red-600 bg-red-100' },
    ]

    const addMilestone = () => {
        if (currentMilestone.trim()) {
            setFormData({ ...formData, milestones: [...formData.milestones, currentMilestone] })
            setCurrentMilestone('')
        }
    }

    const removeMilestone = (index: number) => {
        setFormData({
            ...formData,
            milestones: formData.milestones.filter((_, i) => i !== index),
        })
    }

    const addTag = () => {
        if (currentTag.trim() && !formData.tags.includes(currentTag)) {
            setFormData({ ...formData, tags: [...formData.tags, currentTag] })
            setCurrentTag('')
        }
    }

    const removeTag = (tag: string) => {
        setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) })
    }

    const handleSubmit = () => {
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
                <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6 z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Goal</h2>
                            <p className="text-sm text-gray-500">Step {step} of 3</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 flex gap-2">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={cn(
                                    'h-1 flex-1 rounded-full transition-all',
                                    s <= step ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-800'
                                )}
                            />
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {step === 1 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Goal Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Master React & TypeScript"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe your goal in detail..."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Category *
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.value}
                                            onClick={() => setFormData({ ...formData, category: cat.value })}
                                            className={cn(
                                                'p-4 rounded-xl border-2 transition-all text-left',
                                                formData.category === cat.value
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                            )}
                                        >
                                            <div className="text-2xl mb-1">{cat.emoji}</div>
                                            <div className="font-medium text-gray-900 dark:text-white text-sm">
                                                {cat.label}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Priority
                                </label>
                                <div className="flex gap-2">
                                    {priorities.map((pri) => (
                                        <button
                                            key={pri.value}
                                            onClick={() => setFormData({ ...formData, priority: pri.value })}
                                            className={cn(
                                                'flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all',
                                                formData.priority === pri.value
                                                    ? pri.color
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                            )}
                                        >
                                            {pri.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Target Date
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.target_date}
                                        onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Target Value (Optional)
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={formData.target_value}
                                            onChange={(e) => setFormData({ ...formData, target_value: e.target.value })}
                                            placeholder="100"
                                            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                        <input
                                            type="text"
                                            value={formData.unit}
                                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                            placeholder="hours"
                                            className="w-24 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Milestones
                                </label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={currentMilestone}
                                        onChange={(e) => setCurrentMilestone(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addMilestone()}
                                        placeholder="Add a milestone..."
                                        className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                    <button
                                        onClick={addMilestone}
                                        className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {formData.milestones.map((milestone, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                        >
                                            <span className="text-sm text-gray-700 dark:text-gray-300">{milestone}</span>
                                            <button
                                                onClick={() => removeMilestone(index)}
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Tags
                                </label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={currentTag}
                                        onChange={(e) => setCurrentTag(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                                        placeholder="Add tags..."
                                        className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                    <button
                                        onClick={addTag}
                                        className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                                    >
                                        <Tag className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm"
                                        >
                                            {tag}
                                            <button onClick={() => removeTag(tag)} className="hover:text-blue-900">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                                <div className="flex gap-3">
                                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-blue-900 dark:text-blue-300">
                                        <p className="font-medium mb-1">Make your goal public for accountability!</p>
                                        <p className="text-blue-700 dark:text-blue-400">
                                            Public goals get 3x more support from the community and have higher completion rates.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Make this goal public</p>
                                    <p className="text-sm text-gray-500">Share with the community for support</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_public}
                                        onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                                <div className="flex items-start gap-3 mb-4">
                                    <Sparkles className="w-6 h-6 text-purple-600" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                            AI Success Tips
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Based on successful goal achievers
                                        </p>
                                    </div>
                                </div>
                                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                    <li className="flex items-start gap-2">
                                        <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                        <span>Break down your goal into weekly milestones for better tracking</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                        <span>Set up daily habits that support this goal</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                        <span>Share progress updates weekly to stay accountable</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Goal Summary */}
                            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Goal Summary</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Title:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{formData.title || 'Not set'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Category:</span>
                                        <span className="font-medium text-gray-900 dark:text-white capitalize">{formData.category}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Priority:</span>
                                        <span className="font-medium text-gray-900 dark:text-white capitalize">{formData.priority}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Target Date:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{formData.target_date || 'Not set'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Milestones:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{formData.milestones.length}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-6">
                    <div className="flex justify-between">
                        <button
                            onClick={() => setStep(Math.max(1, step - 1))}
                            disabled={step === 1}
                            className="px-6 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Back
                        </button>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            {step < 3 ? (
                                <button
                                    onClick={() => setStep(step + 1)}
                                    disabled={!formData.title}
                                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
                                >
                                    Create Goal
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default CreateGoalModal
