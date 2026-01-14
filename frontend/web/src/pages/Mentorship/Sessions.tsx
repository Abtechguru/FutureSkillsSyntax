import React from 'react'
import { Calendar, Clock, Video, ChevronRight } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'

const MentorshipSessions: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mentorship Sessions</h1>
                <Button variant="primary">Schedule New Session</Button>
            </div>

            <div className="grid gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold">Upcoming Sessions</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                            <div className="flex-shrink-0">
                                <div className="p-3 rounded-full bg-primary/10 text-primary">
                                    <Calendar className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium text-gray-900 dark:text-white">No upcoming sessions</h3>
                                <p className="text-sm text-gray-500">You haven't scheduled any sessions yet.</p>
                            </div>
                            <Button variant="outline" size="sm">Schedule One</Button>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Past Sessions</h2>
                    <div className="text-center py-12 text-gray-500">
                        <Clock className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No past sessions recorded.</p>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default MentorshipSessions
