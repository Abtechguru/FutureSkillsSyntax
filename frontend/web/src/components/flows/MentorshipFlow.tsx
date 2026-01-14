import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  Video, 
  MessageSquare, 
  Star, 
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Mic,
  MicOff,
  VideoOff,
  Monitor,
  Send,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { PageTransition } from '@/components/transitions/PageTransitions'
import { LoadingOverlay, LoadingButton } from '@/components/loading/LoadingStates'
import { ModalTransition } from '@/components/transitions/PageTransitions'
import mentorshipService, { Mentor, MentorSession } from '@/services/mentorship'
import { toast } from 'react-hot-toast'

// Mentorship Flow Steps
type MentorshipStep = 'browse' | 'schedule' | 'confirm' | 'session' | 'feedback'

interface MentorshipFlowProps {
  initialStep?: MentorshipStep
  mentorId?: string
  sessionId?: string
}

const MentorshipFlow: React.FC<MentorshipFlowProps> = ({
  initialStep = 'browse',
  mentorId,
  sessionId,
}) => {
  const navigate = useNavigate()
  const [step, setStep] = useState<MentorshipStep>(initialStep)
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [sessionTopic, setSessionTopic] = useState('')
  const [currentSession, setCurrentSession] = useState<MentorSession | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingState, setLoadingState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  // Session Controls
  const [micEnabled, setMicEnabled] = useState(true)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [screenSharing, setScreenSharing] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<{ text: string; sender: string; time: Date }[]>([])
  const [newMessage, setNewMessage] = useState('')

  // Feedback
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')

  // Generate available times (mock)
  const availableTimes = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM']

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = []
    const today = new Date()
    for (let i = 0; i < 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      days.push(date)
    }
    return days
  }

  const calendarDays = generateCalendarDays()

  const handleBookSession = async () => {
    if (!selectedMentor || !selectedDate || !selectedTime) return

    setLoadingState('loading')
    try {
      const session = await mentorshipService.bookSession({
        mentorId: selectedMentor.id,
        date: selectedDate.toISOString(),
        time: selectedTime,
        topic: sessionTopic,
      })
      setCurrentSession(session)
      setLoadingState('success')
      setTimeout(() => {
        setStep('confirm')
        setLoadingState('idle')
      }, 1500)
    } catch (error) {
      setLoadingState('error')
    }
  }

  const handleJoinSession = () => {
    setStep('session')
  }

  const handleEndSession = async () => {
    setStep('feedback')
  }

  const handleSubmitFeedback = async () => {
    if (!currentSession) return

    setLoadingState('loading')
    try {
      await mentorshipService.submitReview(currentSession.id, {
        rating,
        feedback,
      })
      setLoadingState('success')
      setTimeout(() => {
        navigate('/mentorship')
      }, 1500)
    } catch (error) {
      setLoadingState('error')
    }
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return
    setChatMessages([
      ...chatMessages,
      { text: newMessage, sender: 'You', time: new Date() },
    ])
    setNewMessage('')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <LoadingOverlay
        state={loadingState}
        message={
          loadingState === 'loading'
            ? step === 'schedule'
              ? 'Booking your session...'
              : 'Submitting feedback...'
            : 'Done!'
        }
      />

      <AnimatePresence mode="wait">
        {/* Browse/Schedule Step */}
        {(step === 'browse' || step === 'schedule') && (
          <PageTransition key="schedule" transition="fade">
            <div className="max-w-4xl mx-auto p-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Book a Mentorship Session
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Select your mentor, pick a date and time that works for you
              </p>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Select Date
                  </h2>

                  <div className="grid grid-cols-7 gap-2 mb-6">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="text-center text-xs text-gray-500 font-medium">
                        {day}
                      </div>
                    ))}
                    {calendarDays.map((date, i) => {
                      const isSelected = selectedDate?.toDateString() === date.toDateString()
                      const isToday = new Date().toDateString() === date.toDateString()
                      return (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedDate(date)}
                          className={cn(
                            'aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all',
                            isSelected
                              ? 'bg-primary text-white'
                              : isToday
                                ? 'bg-primary/20 text-primary'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                          )}
                        >
                          {date.getDate()}
                        </motion.button>
                      )
                    })}
                  </div>

                  {/* Time Slots */}
                  {selectedDate && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        Available Times
                      </h3>
                      <div className="grid grid-cols-3 gap-2">
                        {availableTimes.map((time) => (
                          <motion.button
                            key={time}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedTime(time)}
                            className={cn(
                              'py-2 px-3 rounded-lg text-sm font-medium transition-all',
                              selectedTime === time
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-primary/20'
                            )}
                          >
                            {time}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Session Topic */}
                  {selectedTime && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6"
                    >
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        What would you like to discuss?
                      </label>
                      <textarea
                        value={sessionTopic}
                        onChange={(e) => setSessionTopic(e.target.value)}
                        placeholder="Describe the topics or questions you'd like to cover..."
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-primary focus:outline-none"
                        rows={3}
                      />
                    </motion.div>
                  )}
                </div>

                {/* Summary Sidebar */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg h-fit sticky top-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Session Summary
                  </h2>

                  <div className="space-y-4">
                    {selectedDate && (
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-primary" />
                        <span className="text-gray-900 dark:text-white">
                          {selectedDate.toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    )}

                    {selectedTime && (
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-primary" />
                        <span className="text-gray-900 dark:text-white">{selectedTime}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <Video className="w-5 h-5 text-primary" />
                      <span className="text-gray-900 dark:text-white">60 min video call</span>
                    </div>
                  </div>

                  <LoadingButton
                    variant="primary"
                    onClick={handleBookSession}
                    disabled={!selectedDate || !selectedTime}
                    className="w-full mt-6"
                    isLoading={loadingState === 'loading'}
                  >
                    Book Session
                  </LoadingButton>
                </div>
              </div>
            </div>
          </PageTransition>
        )}

        {/* Confirmation Step */}
        {step === 'confirm' && (
          <PageTransition key="confirm" transition="slide-left">
            <div className="max-w-lg mx-auto p-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center"
              >
                <Check className="w-10 h-10 text-white" />
              </motion.div>

              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Session Booked!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                You'll receive a confirmation email with the meeting link.
              </p>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8 text-left">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedDate?.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Time</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Duration</span>
                    <span className="font-medium text-gray-900 dark:text-white">60 minutes</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <LoadingButton variant="outline" onClick={() => navigate('/mentorship')}>
                  View All Sessions
                </LoadingButton>
                <LoadingButton variant="primary" onClick={handleJoinSession} className="flex-1">
                  Join Session Now
                </LoadingButton>
              </div>
            </div>
          </PageTransition>
        )}

        {/* Session Step */}
        {step === 'session' && (
          <PageTransition key="session" transition="fade">
            <div className="h-screen flex flex-col bg-gray-900">
              {/* Video Area */}
              <div className="flex-1 relative">
                {/* Remote Video */}
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-32 h-32 rounded-full bg-gray-700 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-4xl">👤</span>
                    </div>
                    <p>Mentor's Video</p>
                  </div>
                </div>

                {/* Local Video */}
                <motion.div
                  drag
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  className="absolute bottom-4 right-4 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden shadow-lg"
                >
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    {videoEnabled ? 'Your Video' : <VideoOff className="w-8 h-8" />}
                  </div>
                </motion.div>

                {/* Session Timer */}
                <div className="absolute top-4 left-4 bg-gray-800/80 rounded-lg px-4 py-2">
                  <span className="text-white font-mono">45:32</span>
                </div>
              </div>

              {/* Controls */}
              <div className="bg-gray-800 p-4">
                <div className="flex items-center justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMicEnabled(!micEnabled)}
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
                      micEnabled ? 'bg-gray-700 text-white' : 'bg-red-500 text-white'
                    )}
                  >
                    {micEnabled ? <Mic /> : <MicOff />}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setVideoEnabled(!videoEnabled)}
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
                      videoEnabled ? 'bg-gray-700 text-white' : 'bg-red-500 text-white'
                    )}
                  >
                    {videoEnabled ? <Video /> : <VideoOff />}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setScreenSharing(!screenSharing)}
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
                      screenSharing ? 'bg-primary text-white' : 'bg-gray-700 text-white'
                    )}
                  >
                    <Monitor />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setChatOpen(!chatOpen)}
                    className="w-12 h-12 rounded-full bg-gray-700 text-white flex items-center justify-center"
                  >
                    <MessageSquare />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleEndSession}
                    className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center"
                  >
                    <X />
                  </motion.button>
                </div>
              </div>

              {/* Chat Sidebar */}
              <AnimatePresence>
                {chatOpen && (
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    className="absolute right-0 top-0 bottom-0 w-80 bg-gray-800 shadow-lg flex flex-col"
                  >
                    <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                      <h3 className="font-semibold text-white">Chat</h3>
                      <button onClick={() => setChatOpen(false)} className="text-gray-400 hover:text-white">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto space-y-3">
                      {chatMessages.map((msg, i) => (
                        <div
                          key={i}
                          className={cn(
                            'flex flex-col',
                            msg.sender === 'You' ? 'items-end' : 'items-start'
                          )}
                        >
                          <div
                            className={cn(
                              'px-3 py-2 rounded-lg max-w-[80%]',
                              msg.sender === 'You' ? 'bg-primary text-white' : 'bg-gray-700 text-white'
                            )}
                          >
                            {msg.text}
                          </div>
                          <span className="text-xs text-gray-500 mt-1">
                            {msg.time.toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 border-t border-gray-700">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          placeholder="Type a message..."
                          className="flex-1 px-3 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                          onClick={sendMessage}
                          className="p-2 bg-primary text-white rounded-lg hover:bg-primary-600"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </PageTransition>
        )}

        {/* Feedback Step */}
        {step === 'feedback' && (
          <PageTransition key="feedback" transition="slide-up">
            <div className="max-w-lg mx-auto p-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                How was your session?
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
                Your feedback helps mentors improve
              </p>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                {/* Star Rating */}
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-500 mb-3">Rate your experience</p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setRating(star)}
                        className="p-1"
                      >
                        <Star
                          className={cn(
                            'w-10 h-10 transition-colors',
                            star <= rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          )}
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Feedback Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Share your thoughts (optional)
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="What went well? What could be improved?"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-primary focus:outline-none"
                    rows={4}
                  />
                </div>

                <LoadingButton
                  variant="primary"
                  onClick={handleSubmitFeedback}
                  disabled={rating === 0}
                  isLoading={loadingState === 'loading'}
                  className="w-full mt-6"
                >
                  Submit Feedback
                </LoadingButton>
              </div>
            </div>
          </PageTransition>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MentorshipFlow
