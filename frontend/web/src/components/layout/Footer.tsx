import React from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="container-custom py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center space-x-2">
                            <span className="text-xl font-bold gradient-text">FutureSkills</span>
                        </Link>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Empowering the next generation with essential skills for success.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/explore" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                                    Explore
                                </Link>
                            </li>
                            <li>
                                <Link to="/career" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                                    Career
                                </Link>
                            </li>
                            <li>
                                <Link to="/mentorship" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                                    Mentorship
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Support</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/help" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        © {currentYear} FutureSkillsSyntax. All rights reserved.
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-4 md:mt-0">
                        Made with <Heart className="w-4 h-4 text-red-500" /> for the community
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
