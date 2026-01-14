import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Users, Zap, TrendingUp, Target, BookOpen, Award } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import FadeIn from '@/components/animations/FadeIn'
import StaggerChildren from '@/components/animations/StaggerChildren'
import LottieAnimation from '@/components/animations/LottieAnimation'
import type { RootState } from '@/store/store'

// Import Lottie animations
import heroAnimation from '@/assets/lottie/hero-animation.json'
import learningAnimation from '@/assets/lottie/learning.json'
import mentorshipAnimation from '@/assets/lottie/mentorship.json'
import gamificationAnimation from '@/assets/lottie/gamification.json'

const Home: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  const features = [
    {
      icon: Target,
      title: 'Personalized Career Paths',
      description: 'AI-powered career recommendations based on your skills and interests',
    },
    {
      icon: BookOpen,
      title: 'Structured Learning',
      description: 'Curated learning resources and guided pathways',
    },
    {
      icon: Users,
      title: 'Expert Mentorship',
      description: 'Connect with industry professionals for guidance',
    },
    {
      icon: Award,
      title: 'Gamified Learning',
      description: 'Earn badges, level up, and track your progress',
    },
    {
      icon: TrendingUp,
      title: 'Skill Gap Analysis',
      description: 'Identify and bridge your skill gaps',
    },
    {
      icon: Zap,
      description: 'Special mentorship for boys (10-18)',
    },
  ]

  const testimonials = [
    {
      name: 'Alex Johnson',
      role: 'Career Switcher',
      content: 'OnaAseyori helped me transition from marketing to software development. The personalized roadmap was exactly what I needed!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    },
    {
      name: 'Maria Garcia',
      role: 'Student',
      content: 'The mentorship program connected me with an amazing mentor who helped me build my first mobile app. Life-changing experience!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    },
    {
      name: 'David Chen',
      role: 'FutureSyntax Mentee',
      content: 'As someone without a father figure, this platform gave me both technical skills and life guidance. I feel empowered and supported.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    },
  ]

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn delay={0.1}>
              <div className="space-y-8">
                <motion.h1
                  className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="block">Build Your</span>
                  <span className="block gradient-text">Tech Career</span>
                  <span className="block">With Confidence</span>
                </motion.h1>

                <motion.p
                  className="text-xl text-gray-600 dark:text-gray-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Personalized career guidance + structured mentorship that turns uncertainty into skills, character, and opportunity.
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {isAuthenticated ? (
                    <>
                      <Button
                        size="lg"
                        variant="primary"
                        icon={<ArrowRight />}
                        iconPosition="right"
                        as={Link}
                        to="/dashboard"
                      >
                        Go to Dashboard
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        as={Link}
                        to="/career/assessment"
                      >
                        Career Assessment
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="lg"
                        variant="primary"
                        icon={<ArrowRight />}
                        iconPosition="right"
                        as={Link}
                        to="/register"
                      >
                        Get Started Free
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        as={Link}
                        to="/login"
                      >
                        Sign In
                      </Button>
                    </>
                  )}
                </motion.div>

                {/* Stats */}
                <motion.div
                  className="grid grid-cols-3 gap-6 pt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">10,000+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Users Empowered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary">500+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Expert Mentors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-success">95%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction Rate</div>
                  </div>
                </motion.div>
              </div>
            </FadeIn>

            <FadeIn delay={0.4} direction="right">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
                <LottieAnimation
                  animation={heroAnimation}
                  className="w-full h-full"
                  loop={true}
                  autoplay={true}
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="container-custom">
          <FadeIn direction="up">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Everything You Need for Your{' '}
                <span className="gradient-text">Career Journey</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                From discovery to mastery, we guide you every step of the way
              </p>
            </div>
          </FadeIn>

          <StaggerChildren staggerDelay={0.1}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} hover className="p-6" animate>
                  <div className="space-y-4">
                    <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </StaggerChildren>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 bg-gradient-to-b from-transparent to-gray-100 dark:to-gray-900/50">
        <div className="container-custom">
          <FadeIn direction="up">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                How <span className="gradient-text">OnaAseyori</span> Works
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Your journey to career success in four simple steps
              </p>
            </div>
          </FadeIn>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-success transform -translate-x-1/2 hidden lg:block" />

            <div className="space-y-12 lg:space-y-0">
              {[
                {
                  step: '01',
                  title: 'Take Career Assessment',
                  description: 'Complete our AI-powered assessment to understand your skills, interests, and personality.',
                  icon: '📊',
                  animation: learningAnimation,
                },
                {
                  step: '02',
                  title: 'Get Personalized Roadmap',
                  description: 'Receive a customized learning path with recommended courses, projects, and milestones.',
                  icon: '🗺️',
                  animation: mentorshipAnimation,
                },
                {
                  step: '03',
                  title: 'Connect with Mentors',
                  description: 'Get matched with experienced mentors who guide you through your learning journey.',
                  icon: '👥',
                  animation: gamificationAnimation,
                },
                {
                  step: '04',
                  title: 'Track Progress & Earn Rewards',
                  description: 'Monitor your growth, earn badges, and level up as you complete milestones.',
                  icon: '🏆',
                  animation: heroAnimation,
                },
              ].map((item, index) => (
                <FadeIn key={index} delay={index * 0.2} direction="up">
                  <div
                    className={`
                      relative lg:w-1/2
                      ${index % 2 === 0 ? 'lg:pr-12 lg:text-right' : 'lg:pl-12 lg:ml-auto'}
                    `}
                  >
                    <Card className="p-6" hover animate>
                      <div className={`flex flex-col lg:flex-row items-center gap-6 ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''
                        }`}>
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl">
                            {item.icon}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-primary">
                              Step {item.step}
                            </span>
                            <CheckCircle className="h-4 w-4 text-success" />
                          </div>
                          <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12">
        <div className="container-custom">
          <FadeIn direction="up">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Success <span className="gradient-text">Stories</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Hear from our community of learners and mentors
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <FadeIn key={index} delay={index * 0.2} direction="up">
                <Card className="p-6" hover animate>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex text-yellow-500">
                      {'★'.repeat(5)}
                    </div>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12">
        <div className="container-custom">
          <Card className="p-12 text-center bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent" animate>
            <FadeIn direction="up">
              <div className="space-y-6 max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold">
                  Ready to Transform Your{' '}
                  <span className="gradient-text">Career?</span>
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Join thousands of learners who have found their path with OnaAseyori
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {isAuthenticated ? (
                    <Button
                      size="lg"
                      variant="primary"
                      icon={<ArrowRight />}
                      iconPosition="right"
                      as={Link}
                      to="/dashboard"
                    >
                      Continue Learning
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="lg"
                        variant="primary"
                        icon={<ArrowRight />}
                        iconPosition="right"
                        as={Link}
                        to="/register"
                      >
                        Start Free Trial
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        as={Link}
                        to="/login"
                      >
                        Sign In
                      </Button>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  No credit card required • 14-day free trial • Cancel anytime
                </p>
              </div>
            </FadeIn>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default Home