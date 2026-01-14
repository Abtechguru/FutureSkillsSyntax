import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Calendar,
    Clock,
    Video,
    MessageSquare,
    Phone,
    ChevronLeft,
    ChevronRight,
    Check,
} from 'lucide-react'
import { toast } from 'react-hot-toast'

import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import mentorshipService, { Mentor } from '@/services/mentorship'
import { cn } from '@/utils/cn'

interface BookingModalProps {
    isOpen: boolean
    onClose: () => void
    mentor: Mentor
    onBooked?: () => void
}

const sessionTypes = [
    { id: 'video', icon: Video, label: 'Video Call', description: 'Face-to-face virtual meeting' },
    { id: 'chat', icon: MessageSquare, label: 'Chat', description: 'Text-based conversation' },
    { id: 'phone', icon: Phone, label: 'Phone Call', description: 'Voice call' },
] as const

const durations = [30, 45, 60, 90]

const BookingModal: React.FC<BookingModalProps> = ({
    isOpen,
    onClose,
    mentor,
    onBooked,
}) => {
    const [step, setStep] = useState(1)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [selectedType, setSelectedType] = useState<'video' | 'chat' | 'phone'>('video')
    const [selectedDuration, setSelectedDuration] = useState(60)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [availableSlots, setAvailableSlots] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [currentMonth, setCurrentMonth] = useState(new Date())

    useEffect(() => {
        if (selectedDate) {
            loadAvailability()
        }
    }, [selectedDate])

    const loadAvailability = async () => {
        if (!selectedDate) return
        try {
            const dateStr = selectedDate.toISOString().split('T')[0]
            const slots = await mentorshipService.getMentorAvailability(mentor.id, dateStr)
            setAvailableSlots(slots)
        } catch (error) {
            toast.error('Failed to load availability')
        }
    }

    const handleBook = async () => {
        if (!selectedDate || !selectedTime || !title.trim()) {
            toast.error('Please fill in all required fields')
            return
        }

        setLoading(true)
        try {
            await mentorshipService.bookSession({
                mentorId: mentor.id,
                date: selectedDate.toISOString().split('T')[0],
                startTime: selectedTime,
                duration: selectedDuration,
                type: selectedType,
                title,
                description,
            })
            toast.success('Session booked successfully!')
            onBooked?.()
            onClose()
        } catch (error) {
            toast.error('Failed to book session')
        } finally {
            setLoading(false)
        }
    }

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const days: (Date | null)[] = []

        // Add empty slots for days before the first day
        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push(null)
        }

        // Add all days in the month
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i))
        }

        return days
    }

    const isDateDisabled = (date: Date) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return date < today
    }

    const isDateSelected = (date: Date) => {
        return selectedDate?.toDateString() === date.toDateString()
    }

    const formatMonthYear = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }

    const days = getDaysInMonth(currentMonth)
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Book a Session" size="lg">
            <div className="space-y-6">
                {/* Mentor Info */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <Avatar src={mentor.avatar} alt={mentor.name} size="lg" />
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            {mentor.name}
                        </h3>
                        <p className="text-sm text-gray-500">{mentor.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">${mentor.hourlyRate}/hr</Badge>
                        </div>
                    </div>
                </div>

                {/* Steps */}
                <div className="flex items-center gap-2">
                    {[1, 2, 3].map((s) => (
                        <React.Fragment key={s}>
                            <div className={cn(
                                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                                step >= s
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                            )}>
                                {step > s ? <Check className="w-4 h-4" /> : s}
                            </div>
                            {s < 3 && (
                                <div className={cn(
                                    'flex-1 h-1 rounded',
                                    step > s ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                                )} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Step 1: Date & Time */}
                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                            Select Date & Time
                        </h4>

                        {/* Calendar */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="font-medium">{formatMonthYear(currentMonth)}</span>
                                <button
                                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                                {weekDays.map((day) => (
                                    <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                                        {day}
                                    </div>
                                ))}
                                {days.map((day, index) => (
                                    <div key={index} className="aspect-square">
                                        {day && (
                                            <button
                                                onClick={() => setSelectedDate(day)}
                                                disabled={isDateDisabled(day)}
                                                className={cn(
                                                    'w-full h-full rounded-lg flex items-center justify-center text-sm transition-colors',
                                                    isDateDisabled(day)
                                                        ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                                        : isDateSelected(day)
                                                            ? 'bg-primary text-white'
                                                            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white'
                                                )}
                                            >
                                                {day.getDate()}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Time Slots */}
                        {selectedDate && (
                            <div>
                                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Available Times
                                </h5>
                                {availableSlots.length === 0 ? (
                                    <p className="text-sm text-gray-500">No available slots for this date</p>
                                ) : (
                                    <div className="grid grid-cols-4 gap-2">
                                        {availableSlots.map((slot) => (
                                            <button
                                                key={slot}
                                                onClick={() => setSelectedTime(slot)}
                                                className={cn(
                                                    'px-3 py-2 text-sm rounded-lg transition-colors',
                                                    selectedTime === slot
                                                        ? 'bg-primary text-white'
                                                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                )}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Step 2: Session Type */}
                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                            Session Type & Duration
                        </h4>

                        {/* Type Selection */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {sessionTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => setSelectedType(type.id)}
                                    className={cn(
                                        'p-4 rounded-lg border-2 transition-colors text-center',
                                        selectedType === type.id
                                            ? 'border-primary bg-primary/5'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                    )}
                                >
                                    <type.icon className={cn(
                                        'w-6 h-6 mx-auto mb-2',
                                        selectedType === type.id ? 'text-primary' : 'text-gray-500'
                                    )} />
                                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                                        {type.label}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {type.description}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Duration Selection */}
                        <div>
                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Duration
                            </h5>
                            <div className="flex gap-2">
                                {durations.map((duration) => (
                                    <button
                                        key={duration}
                                        onClick={() => setSelectedDuration(duration)}
                                        className={cn(
                                            'flex-1 py-2 text-sm rounded-lg transition-colors',
                                            selectedDuration === duration
                                                ? 'bg-primary text-white'
                                                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        )}
                                    >
                                        {duration} min
                                    </button>
                                ))}
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                Cost: ${(mentor.hourlyRate * selectedDuration / 60).toFixed(2)}
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Details */}
                {step === 3 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                            Session Details
                        </h4>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Session Title *
                                </label>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., Code Review, Career Guidance"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    What would you like to discuss?
                                </label>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe the topics you'd like to cover..."
                                    rows={4}
                                />
                            </div>

                            {/* Summary */}
                            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Date</span>
                                    <span className="font-medium">{selectedDate?.toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Time</span>
                                    <span className="font-medium">{selectedTime}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Type</span>
                                    <span className="font-medium capitalize">{selectedType}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Duration</span>
                                    <span className="font-medium">{selectedDuration} minutes</span>
                                </div>
                                <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-700">
                                    <span className="text-gray-500">Total</span>
                                    <span className="font-semibold text-primary">
                                        ${(mentor.hourlyRate * selectedDuration / 60).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Navigation */}
                <div className="flex gap-3">
                    {step > 1 && (
                        <Button variant="outline" onClick={() => setStep(step - 1)}>
                            Back
                        </Button>
                    )}
                    <Button
                        variant="primary"
                        fullWidth
                        onClick={() => {
                            if (step < 3) {
                                setStep(step + 1)
                            } else {
                                handleBook()
                            }
                        }}
                        loading={loading}
                        disabled={
                            (step === 1 && (!selectedDate || !selectedTime)) ||
                            (step === 3 && !title.trim())
                        }
                    >
                        {step === 3 ? 'Confirm Booking' : 'Continue'}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default BookingModal
