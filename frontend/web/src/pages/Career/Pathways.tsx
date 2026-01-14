import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  TrendingUp,
  DollarSign,
  Clock,
  MapPin,
  Briefcase,
  GraduationCap,
  Star,
  ChevronRight,
  BarChart3,
  Users,
  Laptop,
  Building,
  ArrowRight,
  Check,
  X,
  Layers,
} from 'lucide-react'
import { toast } from 'react-hot-toast'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import Modal from '@/components/ui/Modal'
import FadeIn from '@/components/animations/FadeIn'
import StaggerChildren from '@/components/animations/StaggerChildren'
import careerService, { CareerRole } from '@/services/career'
import { cn } from '@/utils/cn'

const demandColors = {
  low: 'text-gray-500 bg-gray-100 dark:bg-gray-800',
  medium: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30',
  high: 'text-green-600 bg-green-100 dark:bg-green-900/30',
  very_high: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
}

const demandLabels = {
  low: 'Low Demand',
  medium: 'Medium Demand',
  high: 'High Demand',
  very_high: 'Very High Demand',
}

// Mock data for production - would come from API
const mockRoles: CareerRole[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    field: 'Web Development',
    description: 'Build user interfaces and interactive web applications using modern JavaScript frameworks.',
    shortDescription: 'Create stunning user interfaces',
    salary: { min: 70000, max: 140000, median: 95000, currency: 'USD' },
    demand: 'very_high',
    growthRate: 22,
    skills: [
      { id: 's1', name: 'React', level: 'advanced', required: true },
      { id: 's2', name: 'TypeScript', level: 'intermediate', required: true },
      { id: 's3', name: 'CSS/Tailwind', level: 'advanced', required: true },
      { id: 's4', name: 'Testing', level: 'intermediate', required: false },
    ],
    certifications: [
      { id: 'c1', name: 'AWS Certified Developer', provider: 'Amazon', required: false },
      { id: 'c2', name: 'Meta Front-End Developer', provider: 'Meta', required: false },
    ],
    education: [
      { level: "Bachelor's", field: 'Computer Science', required: false },
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
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    field: 'Web Development',
    description: 'Develop both frontend and backend of web applications, handling everything from UI to databases.',
    shortDescription: 'Master both sides of web development',
    salary: { min: 85000, max: 160000, median: 115000, currency: 'USD' },
    demand: 'very_high',
    growthRate: 20,
    skills: [
      { id: 's1', name: 'React/Vue', level: 'advanced', required: true },
      { id: 's2', name: 'Node.js', level: 'advanced', required: true },
      { id: 's3', name: 'PostgreSQL', level: 'intermediate', required: true },
      { id: 's4', name: 'Docker', level: 'intermediate', required: false },
    ],
    certifications: [
      { id: 'c1', name: 'AWS Solutions Architect', provider: 'Amazon', required: false },
    ],
    education: [
      { level: "Bachelor's", field: 'Computer Science', required: false },
    ],
    dayInLife: [
      { time: '9:00 AM', activity: 'Team sync and sprint planning' },
      { time: '10:00 AM', activity: 'API development' },
      { time: '12:00 PM', activity: 'Lunch' },
      { time: '1:00 PM', activity: 'Frontend integration' },
      { time: '3:00 PM', activity: 'Database optimization' },
      { time: '5:00 PM', activity: 'Deployment and monitoring' },
    ],
    relatedRoles: ['1', '4'],
    averageTimeToAchieve: '12-18 months',
    remoteAvailability: 'hybrid',
  },
  {
    id: '3',
    title: 'UX Engineer',
    field: 'Design Engineering',
    description: 'Bridge the gap between design and development, creating seamless user experiences.',
    shortDescription: 'Where design meets code',
    salary: { min: 80000, max: 150000, median: 105000, currency: 'USD' },
    demand: 'high',
    growthRate: 18,
    skills: [
      { id: 's1', name: 'Figma', level: 'advanced', required: true },
      { id: 's2', name: 'React', level: 'intermediate', required: true },
      { id: 's3', name: 'CSS Animation', level: 'advanced', required: true },
      { id: 's4', name: 'User Research', level: 'intermediate', required: false },
    ],
    certifications: [
      { id: 'c1', name: 'Google UX Design', provider: 'Google', required: false },
    ],
    education: [
      { level: "Bachelor's", field: 'Design or Computer Science', required: false },
    ],
    dayInLife: [
      { time: '9:00 AM', activity: 'Design system review' },
      { time: '10:00 AM', activity: 'Prototype development' },
      { time: '12:00 PM', activity: 'Lunch' },
      { time: '1:00 PM', activity: 'User testing sessions' },
      { time: '3:00 PM', activity: 'Component library updates' },
      { time: '5:00 PM', activity: 'Design handoff documentation' },
    ],
    relatedRoles: ['1'],
    averageTimeToAchieve: '9-15 months',
    remoteAvailability: 'full',
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    field: 'Infrastructure',
    description: 'Automate and streamline software development and deployment processes.',
    shortDescription: 'Automate the software lifecycle',
    salary: { min: 90000, max: 170000, median: 125000, currency: 'USD' },
    demand: 'very_high',
    growthRate: 25,
    skills: [
      { id: 's1', name: 'Docker/Kubernetes', level: 'advanced', required: true },
      { id: 's2', name: 'CI/CD', level: 'advanced', required: true },
      { id: 's3', name: 'AWS/GCP/Azure', level: 'advanced', required: true },
      { id: 's4', name: 'Terraform', level: 'intermediate', required: false },
    ],
    certifications: [
      { id: 'c1', name: 'AWS DevOps Engineer', provider: 'Amazon', required: false },
      { id: 'c2', name: 'CKA', provider: 'CNCF', required: false },
    ],
    education: [
      { level: "Bachelor's", field: 'Computer Science', required: false },
    ],
    dayInLife: [
      { time: '9:00 AM', activity: 'Infrastructure monitoring' },
      { time: '10:00 AM', activity: 'Pipeline optimization' },
      { time: '12:00 PM', activity: 'Lunch' },
      { time: '1:00 PM', activity: 'Security audits' },
      { time: '3:00 PM', activity: 'Automation scripting' },
      { time: '5:00 PM', activity: 'On-call handoff' },
    ],
    relatedRoles: ['2'],
    averageTimeToAchieve: '12-24 months',
    remoteAvailability: 'full',
  },
]

const CareerPathways: React.FC = () => {
  const navigate = useNavigate()
  const [roles, setRoles] = useState<CareerRole[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedField, setSelectedField] = useState<string | null>(null)
  const [compareMode, setCompareMode] = useState(false)
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([])
  const [showDayInLife, setShowDayInLife] = useState<CareerRole | null>(null)

  const fields = ['Web Development', 'Design Engineering', 'Infrastructure', 'Data Science', 'Mobile Development']

  useEffect(() => {
    loadRoles()
  }, [selectedField])

  const loadRoles = async () => {
    setLoading(true)
    try {
      // Use mock data - in production this would be API call
      // const data = await careerService.getRoles(selectedField || undefined)
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
      let filtered = mockRoles
      if (selectedField) {
        filtered = mockRoles.filter(r => r.field === selectedField)
      }
      setRoles(filtered)
    } catch (error) {
      toast.error('Failed to load career roles')
    } finally {
      setLoading(false)
    }
  }

  const filteredRoles = roles.filter(role =>
    role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.field.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.skills.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const toggleCompareSelection = (roleId: string) => {
    if (selectedForCompare.includes(roleId)) {
      setSelectedForCompare(prev => prev.filter(id => id !== roleId))
    } else if (selectedForCompare.length < 3) {
      setSelectedForCompare(prev => [...prev, roleId])
    } else {
      toast.error('You can compare up to 3 roles')
    }
  }

  const formatSalary = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const comparedRoles = roles.filter(r => selectedForCompare.includes(r.id))

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Career Path Explorer
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Discover and compare career paths that match your interests
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={compareMode ? 'primary' : 'outline'}
              icon={<Layers />}
              onClick={() => {
                setCompareMode(!compareMode)
                if (compareMode) setSelectedForCompare([])
              }}
            >
              {compareMode ? `Compare (${selectedForCompare.length})` : 'Compare Mode'}
            </Button>
          </div>
        </div>
      </FadeIn>

      {/* Search and Filters */}
      <FadeIn delay={0.1}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roles, skills, or fields..."
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedField === null ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedField(null)}
            >
              All Fields
            </Button>
            {fields.map((field) => (
              <Button
                key={field}
                variant={selectedField === field ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedField(field)}
              >
                {field}
              </Button>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Compare Bar */}
      <AnimatePresence>
        {compareMode && selectedForCompare.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-900 dark:text-white">
                    Comparing {selectedForCompare.length} role{selectedForCompare.length > 1 ? 's' : ''}
                  </span>
                  <div className="flex gap-2">
                    {comparedRoles.map((role) => (
                      <Badge key={role.id} variant="primary">
                        {role.title}
                        <button
                          className="ml-1"
                          onClick={() => toggleCompareSelection(role.id)}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={selectedForCompare.length < 2}
                  onClick={() => navigate(`/career/compare?roles=${selectedForCompare.join(',')}`)}
                >
                  View Comparison
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Role Cards Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4" />
              <div className="flex gap-2 mb-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
              </div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
            </Card>
          ))}
        </div>
      ) : (
        <StaggerChildren staggerDelay={0.05}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoles.map((role) => (
              <motion.div
                key={role.id}
                whileHover={{ y: -4 }}
                className="relative"
              >
                {compareMode && (
                  <button
                    className={cn(
                      'absolute -top-2 -right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all',
                      selectedForCompare.includes(role.id)
                        ? 'bg-primary text-white'
                        : 'bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600'
                    )}
                    onClick={() => toggleCompareSelection(role.id)}
                  >
                    {selectedForCompare.includes(role.id) ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-sm">{selectedForCompare.indexOf(role.id) + 1 || '+'}</span>
                    )}
                  </button>
                )}

                <Card className="p-6 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {role.title}
                      </h3>
                      <p className="text-sm text-gray-500">{role.field}</p>
                    </div>
                    <Badge className={demandColors[role.demand]}>
                      {demandLabels[role.demand]}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                    {role.shortDescription}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatSalary(role.salary.median)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        +{role.growthRate}% growth
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {role.averageTimeToAchieve}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {role.remoteAvailability === 'full' ? (
                        <Laptop className="w-4 h-4 text-teal-500" />
                      ) : (
                        <Building className="w-4 h-4 text-orange-500" />
                      )}
                      <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {role.remoteAvailability}
                      </span>
                    </div>
                  </div>

                  {/* Required Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {role.skills.filter(s => s.required).slice(0, 3).map((skill) => (
                      <Badge key={skill.id} variant="secondary">{skill.name}</Badge>
                    ))}
                    {role.skills.filter(s => s.required).length > 3 && (
                      <Badge variant="secondary">+{role.skills.filter(s => s.required).length - 3}</Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setShowDayInLife(role)}
                    >
                      Day in Life
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1"
                      icon={<ArrowRight className="w-4 h-4" />}
                      iconPosition="right"
                      as={Link}
                      to={`/career/role/${role.id}`}
                    >
                      Explore
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </StaggerChildren>
      )}

      {/* Day in Life Modal */}
      <Modal
        isOpen={!!showDayInLife}
        onClose={() => setShowDayInLife(null)}
        title={`A Day as a ${showDayInLife?.title}`}
      >
        {showDayInLife && (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Here's what a typical day might look like:
            </p>
            <div className="space-y-3">
              {showDayInLife.dayInLife.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="text-sm font-medium text-primary min-w-[80px]">
                    {item.time}
                  </div>
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                  <div className="text-gray-600 dark:text-gray-400">
                    {item.activity}
                  </div>
                </motion.div>
              ))}
            </div>
            <Button
              variant="primary"
              fullWidth
              as={Link}
              to={`/career/role/${showDayInLife.id}`}
            >
              Learn More About This Role
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default CareerPathways
