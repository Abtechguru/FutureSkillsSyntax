import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    ArrowLeft,
    DollarSign,
    TrendingUp,
    Clock,
    MapPin,
    Briefcase,
    GraduationCap,
    Award,
    BookOpen,
    Users,
    Laptop,
    Building,
    ExternalLink,
    CheckCircle,
    Target,
    Star,
} from 'lucide-react'
import { toast } from 'react-hot-toast'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { Tabs, Tab, TabPanel } from '@/components/ui/Tabs'
import FadeIn from '@/components/animations/FadeIn'
import careerService, { CareerRole } from '@/services/career'
import { cn } from '@/utils/cn'

// Mock data matching the role from Pathways
const mockRoleData: CareerRole = {
    id: '1',
    title: 'Frontend Developer',
    field: 'Web Development',
    description: 'Frontend developers are responsible for building user interfaces and interactive web applications. They work closely with designers and backend developers to create seamless user experiences. The role requires strong skills in HTML, CSS, JavaScript, and modern frameworks like React or Vue.',
    shortDescription: 'Create stunning user interfaces',
    salary: { min: 70000, max: 140000, median: 95000, currency: 'USD' },
    demand: 'very_high',
    growthRate: 22,
    skills: [
        { id: 's1', name: 'React', level: 'advanced', required: true },
        { id: 's2', name: 'TypeScript', level: 'intermediate', required: true },
        { id: 's3', name: 'CSS/Tailwind', level: 'advanced', required: true },
        { id: 's4', name: 'Testing', level: 'intermediate', required: false },
        { id: 's5', name: 'Git', level: 'intermediate', required: true },
        { id: 's6', name: 'REST APIs', level: 'intermediate', required: true },
        { id: 's7', name: 'Performance Optimization', level: 'intermediate', required: false },
        { id: 's8', name: 'Accessibility', level: 'beginner', required: false },
    ],
    certifications: [
        { id: 'c1', name: 'AWS Certified Developer', provider: 'Amazon', required: false, url: 'https://aws.amazon.com/certification/' },
        { id: 'c2', name: 'Meta Front-End Developer', provider: 'Meta', required: false, url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer' },
        { id: 'c3', name: 'Google Mobile Web Specialist', provider: 'Google', required: false },
    ],
    education: [
        { level: "Bachelor's", field: 'Computer Science', required: false },
        { level: "Bootcamp", field: 'Web Development', required: false },
        { level: 'Self-taught', field: 'Various', required: false },
    ],
    dayInLife: [
        { time: '9:00 AM', activity: 'Stand-up meeting with team' },
        { time: '9:30 AM', activity: 'Code review and PR feedback' },
        { time: '10:00 AM', activity: 'Feature development' },
        { time: '12:00 PM', activity: 'Lunch break' },
        { time: '1:00 PM', activity: 'Design review with UX team' },
        { time: '2:00 PM', activity: 'Bug fixes and optimization' },
        { time: '4:00 PM', activity: 'Documentation and testing' },
        { time: '5:00 PM', activity: 'Planning for next day' },
    ],
    relatedRoles: ['2', '3'],
    averageTimeToAchieve: '6-12 months',
    remoteAvailability: 'full',
}

const skillLevelColors = {
    beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    advanced: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    expert: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const RoleDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [role, setRole] = useState<CareerRole | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState(0)

    useEffect(() => {
        loadRole()
    }, [id])

    const loadRole = async () => {
        setLoading(true)
        try {
            // In production: const data = await careerService.getRole(id!)
            await new Promise(resolve => setTimeout(resolve, 300))
            setRole(mockRoleData)
        } catch (error) {
            toast.error('Failed to load role details')
        } finally {
            setLoading(false)
        }
    }

    const formatSalary = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(value)
    }

    if (loading) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
        )
    }

    if (!role) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Role not found</h2>
                <Button variant="primary" className="mt-4" onClick={() => navigate('/career/pathways')}>
                    Back to Pathways
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Button variant="ghost" icon={<ArrowLeft />} onClick={() => navigate('/career/pathways')}>
                Back to Pathways
            </Button>

            {/* Hero Section */}
            <FadeIn>
                <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <Badge className="mb-3">{role.field}</Badge>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                {role.title}
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                                {role.description}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button
                                variant="primary"
                                size="lg"
                                icon={<Target />}
                                as={Link}
                                to={`/career/skill-gap/${role.id}`}
                            >
                                Analyze Skill Gap
                            </Button>
                            <Button
                                variant="outline"
                                as={Link}
                                to={`/learning?role=${role.id}`}
                            >
                                View Learning Paths
                            </Button>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
                        <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                                <DollarSign className="w-4 h-4" />
                                <span className="text-sm">Median Salary</span>
                            </div>
                            <div className="text-xl font-bold text-gray-900 dark:text-white">
                                {formatSalary(role.salary.median)}
                            </div>
                            <div className="text-xs text-gray-500">
                                {formatSalary(role.salary.min)} - {formatSalary(role.salary.max)}
                            </div>
                        </div>

                        <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-sm">Growth Rate</span>
                            </div>
                            <div className="text-xl font-bold text-green-600">
                                +{role.growthRate}%
                            </div>
                            <div className="text-xs text-gray-500">Expected demand</div>
                        </div>

                        <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">Time to Role</span>
                            </div>
                            <div className="text-xl font-bold text-gray-900 dark:text-white">
                                {role.averageTimeToAchieve}
                            </div>
                            <div className="text-xs text-gray-500">Average timeline</div>
                        </div>

                        <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                                {role.remoteAvailability === 'full' ? (
                                    <Laptop className="w-4 h-4" />
                                ) : (
                                    <Building className="w-4 h-4" />
                                )}
                                <span className="text-sm">Work Style</span>
                            </div>
                            <div className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                                {role.remoteAvailability}
                            </div>
                            <div className="text-xs text-gray-500">Remote availability</div>
                        </div>

                        <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                                <BookOpen className="w-4 h-4" />
                                <span className="text-sm">Skills Required</span>
                            </div>
                            <div className="text-xl font-bold text-gray-900 dark:text-white">
                                {role.skills.filter(s => s.required).length}
                            </div>
                            <div className="text-xs text-gray-500">Core skills</div>
                        </div>
                    </div>
                </Card>
            </FadeIn>

            {/* Tabs */}
            <FadeIn delay={0.1}>
                <Card className="p-6">
                    <Tabs value={activeTab} onChange={setActiveTab}>
                        <Tab label="Skills" icon={<Target className="w-4 h-4" />} />
                        <Tab label="Education & Certifications" icon={<GraduationCap className="w-4 h-4" />} />
                        <Tab label="Day in Life" icon={<Clock className="w-4 h-4" />} />
                    </Tabs>

                    {/* Skills Tab */}
                    <TabPanel value={activeTab} index={0}>
                        <div className="mt-6 space-y-6">
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                    Required Skills
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {role.skills.filter(s => s.required).map((skill) => (
                                        <div
                                            key={skill.id}
                                            className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                                        >
                                            <div className="flex items-center gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {skill.name}
                                                </span>
                                            </div>
                                            <Badge className={skillLevelColors[skill.level]}>
                                                {skill.level}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                    Nice to Have
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {role.skills.filter(s => !s.required).map((skill) => (
                                        <Badge key={skill.id} variant="secondary">
                                            {skill.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </TabPanel>

                    {/* Education Tab */}
                    <TabPanel value={activeTab} index={1}>
                        <div className="mt-6 space-y-6">
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                    Education Pathways
                                </h3>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {role.education.map((edu, index) => (
                                        <div
                                            key={index}
                                            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                                        >
                                            <GraduationCap className="w-8 h-8 text-primary mb-2" />
                                            <h4 className="font-medium text-gray-900 dark:text-white">
                                                {edu.level}
                                            </h4>
                                            <p className="text-sm text-gray-500">{edu.field}</p>
                                            <Badge className="mt-2" variant={edu.required ? 'primary' : 'secondary'}>
                                                {edu.required ? 'Required' : 'Optional'}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                    Recommended Certifications
                                </h3>
                                <div className="space-y-3">
                                    {role.certifications.map((cert) => (
                                        <div
                                            key={cert.id}
                                            className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Award className="w-5 h-5 text-yellow-500" />
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                                        {cert.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">{cert.provider}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={cert.required ? 'primary' : 'secondary'}>
                                                    {cert.required ? 'Required' : 'Optional'}
                                                </Badge>
                                                {cert.url && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        icon={<ExternalLink className="w-4 h-4" />}
                                                        as="a"
                                                        href={cert.url}
                                                        target="_blank"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </TabPanel>

                    {/* Day in Life Tab */}
                    <TabPanel value={activeTab} index={2}>
                        <div className="mt-6">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                A Typical Day as a {role.title}
                            </h3>
                            <div className="relative">
                                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
                                <div className="space-y-4">
                                    {role.dayInLife.map((item, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="relative pl-10"
                                        >
                                            <div className="absolute left-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full bg-white" />
                                            </div>
                                            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                                <div className="text-sm font-medium text-primary mb-1">
                                                    {item.time}
                                                </div>
                                                <div className="text-gray-600 dark:text-gray-400">
                                                    {item.activity}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                </Card>
            </FadeIn>
        </div>
    )
}

export default RoleDetails
