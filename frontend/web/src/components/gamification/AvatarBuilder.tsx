import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Palette,
    Shirt,
    Sparkles,
    User,
    Check,
    Lock,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    Save,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { Avatar, AvatarItem } from '@/services/gamification'
import gamificationService from '@/services/gamification'
import Button from '@/components/ui/Button'
import { toast } from 'react-hot-toast'

interface AvatarBuilderProps {
    onSave?: (avatar: Avatar) => void
    className?: string
}

const categories = [
    { id: 'face', label: 'Face', icon: User },
    { id: 'hair', label: 'Hair', icon: Sparkles },
    { id: 'outfit', label: 'Outfit', icon: Shirt },
    { id: 'accessory', label: 'Accessories', icon: Sparkles },
    { id: 'background', label: 'Background', icon: Palette },
] as const

const skinTones = [
    '#FFDBB4',
    '#EDB98A',
    '#D08B5B',
    '#AE5D29',
    '#614335',
    '#3B241F',
]

const AvatarBuilder: React.FC<AvatarBuilderProps> = ({
    onSave,
    className,
}) => {
    const [avatar, setAvatar] = useState<Avatar | null>(null)
    const [originalAvatar, setOriginalAvatar] = useState<Avatar | null>(null)
    const [items, setItems] = useState<AvatarItem[]>([])
    const [unlockedItems, setUnlockedItems] = useState<Set<string>>(new Set())
    const [activeCategory, setActiveCategory] = useState<typeof categories[number]['id']>('face')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            const [avatarData, allItems, unlocked] = await Promise.all([
                gamificationService.getAvatar(),
                gamificationService.getAvatarItems(),
                gamificationService.getUnlockedItems(),
            ])
            setAvatar(avatarData)
            setOriginalAvatar(avatarData)
            setItems(allItems)
            setUnlockedItems(new Set(unlocked.map(i => i.id)))
        } catch (error) {
            toast.error('Failed to load avatar')
        } finally {
            setLoading(false)
        }
    }

    const handleItemSelect = (item: AvatarItem) => {
        if (!unlockedItems.has(item.id)) {
            toast.error('This item is locked!')
            return
        }

        setAvatar(prev => prev ? {
            ...prev,
            [item.type]: item.id,
        } : null)
    }

    const handleSkinToneChange = (tone: string) => {
        setAvatar(prev => prev ? { ...prev, skinTone: tone } : null)
    }

    const handleReset = () => {
        setAvatar(originalAvatar)
    }

    const handleSave = async () => {
        if (!avatar) return
        setSaving(true)
        try {
            await gamificationService.updateAvatar(avatar)
            setOriginalAvatar(avatar)
            toast.success('Avatar saved!')
            onSave?.(avatar)
        } catch (error) {
            toast.error('Failed to save avatar')
        } finally {
            setSaving(false)
        }
    }

    const categoryItems = items.filter(i => i.type === activeCategory)
    const hasChanges = JSON.stringify(avatar) !== JSON.stringify(originalAvatar)

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        )
    }

    return (
        <div className={cn('bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden', className)}>
            <div className="grid md:grid-cols-2 gap-0">
                {/* Preview Panel */}
                <div className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 p-8 flex flex-col items-center justify-center min-h-[400px]">
                    {/* Avatar Preview */}
                    <motion.div
                        key={JSON.stringify(avatar)}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative"
                    >
                        {/* Avatar Container */}
                        <div
                            className="w-48 h-48 rounded-full overflow-hidden shadow-2xl"
                            style={{ backgroundColor: avatar?.background || '#6366f1' }}
                        >
                            {/* This would be an actual avatar renderer in production */}
                            <div className="w-full h-full flex items-center justify-center">
                                <motion.div
                                    animate={{
                                        y: [0, -3, 0],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                    className="text-7xl"
                                    style={{ color: avatar?.skinTone }}
                                >
                                    {/* Placeholder face - replace with actual avatar rendering */}
                                    <svg viewBox="0 0 100 100" className="w-32 h-32">
                                        <circle
                                            cx="50"
                                            cy="45"
                                            r="35"
                                            fill={avatar?.skinTone || '#FFDBB4'}
                                        />
                                        {/* Eyes */}
                                        <circle cx="38" cy="40" r="4" fill="#333" />
                                        <circle cx="62" cy="40" r="4" fill="#333" />
                                        {/* Smile */}
                                        <path
                                            d="M 35 55 Q 50 70 65 55"
                                            stroke="#333"
                                            strokeWidth="3"
                                            fill="none"
                                        />
                                    </svg>
                                </motion.div>
                            </div>
                        </div>

                        {/* Glow Effect */}
                        <div
                            className="absolute inset-0 rounded-full blur-2xl opacity-30"
                            style={{ backgroundColor: avatar?.background || '#6366f1' }}
                        />
                    </motion.div>

                    {/* Skin Tone Selector */}
                    <div className="mt-8">
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-3">
                            Skin Tone
                        </p>
                        <div className="flex gap-2">
                            {skinTones.map((tone) => (
                                <motion.button
                                    key={tone}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleSkinToneChange(tone)}
                                    className={cn(
                                        'w-8 h-8 rounded-full border-2 transition-all',
                                        avatar?.skinTone === tone
                                            ? 'border-primary ring-2 ring-primary ring-offset-2'
                                            : 'border-gray-300 dark:border-gray-600'
                                    )}
                                    style={{ backgroundColor: tone }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Customization Panel */}
                <div className="p-6">
                    {/* Category Tabs */}
                    <div className="flex gap-1 mb-6 overflow-x-auto">
                        {categories.map((category) => {
                            const Icon = category.icon
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={cn(
                                        'flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors min-w-[80px]',
                                        activeCategory === category.id
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    )}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="text-xs font-medium">{category.label}</span>
                                </button>
                            )
                        })}
                    </div>

                    {/* Items Grid */}
                    <div className="h-64 overflow-y-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeCategory}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="grid grid-cols-4 gap-3"
                            >
                                {categoryItems.map((item) => {
                                    const isUnlocked = unlockedItems.has(item.id)
                                    const isSelected = avatar?.[item.type as keyof Avatar] === item.id

                                    return (
                                        <motion.button
                                            key={item.id}
                                            whileHover={{ scale: isUnlocked ? 1.05 : 1 }}
                                            whileTap={{ scale: isUnlocked ? 0.95 : 1 }}
                                            onClick={() => handleItemSelect(item)}
                                            className={cn(
                                                'relative aspect-square rounded-lg overflow-hidden border-2 transition-all',
                                                isSelected
                                                    ? 'border-primary ring-2 ring-primary ring-offset-2'
                                                    : 'border-gray-200 dark:border-gray-600',
                                                !isUnlocked && 'opacity-50 cursor-not-allowed'
                                            )}
                                        >
                                            {/* Item Preview */}
                                            <div
                                                className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                                                style={{
                                                    backgroundImage: item.preview ? `url(${item.preview})` : undefined,
                                                    backgroundSize: 'cover',
                                                }}
                                            >
                                                {!item.preview && (
                                                    <span className="text-2xl">
                                                        {item.type === 'face' && '😊'}
                                                        {item.type === 'hair' && '💇'}
                                                        {item.type === 'outfit' && '👔'}
                                                        {item.type === 'accessory' && '🎀'}
                                                        {item.type === 'background' && '🎨'}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Selected Indicator */}
                                            {isSelected && (
                                                <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-white" />
                                                </div>
                                            )}

                                            {/* Locked Indicator */}
                                            {!isUnlocked && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <Lock className="w-5 h-5 text-white" />
                                                </div>
                                            )}

                                            {/* Premium Indicator */}
                                            {item.isPremium && isUnlocked && (
                                                <div className="absolute top-1 left-1 px-1 py-0.5 bg-yellow-400 rounded text-[8px] font-bold">
                                                    PRO
                                                </div>
                                            )}
                                        </motion.button>
                                    )
                                })}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Item Info */}
                    <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        {categoryItems.filter(i => unlockedItems.has(i.id)).length} / {categoryItems.length} items unlocked
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <Button
                            variant="outline"
                            icon={<RotateCcw className="w-4 h-4" />}
                            onClick={handleReset}
                            disabled={!hasChanges}
                        >
                            Reset
                        </Button>
                        <Button
                            variant="primary"
                            icon={<Save className="w-4 h-4" />}
                            onClick={handleSave}
                            loading={saving}
                            disabled={!hasChanges}
                            fullWidth
                        >
                            Save Avatar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AvatarBuilder
