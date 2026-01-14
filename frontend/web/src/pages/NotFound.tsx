import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import Button from '@/components/ui/Button'

const NotFound: React.FC = () => {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-9xl font-bold text-primary opacity-20">404</h1>
                    <div className="mt-[-4rem]">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Page Not Found
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                            Oops! The page you're looking for doesn't exist or has been moved.
                            Let's get you back on track.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                variant="outline"
                                icon={<ArrowLeft />}
                                onClick={() => window.history.back()}
                            >
                                Go Back
                            </Button>
                            <Button
                                variant="primary"
                                icon={<Home />}
                                as={Link}
                                to="/"
                            >
                                Back to Home
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default NotFound
