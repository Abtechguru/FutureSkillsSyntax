import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'
import { Menu, X } from 'lucide-react'

export interface NavbarProps {
    logo?: React.ReactNode
    children?: React.ReactNode
    actions?: React.ReactNode
    sticky?: boolean
    transparent?: boolean
    className?: string
}

export const Navbar: React.FC<NavbarProps> = ({
    logo,
    children,
    actions,
    sticky = false,
    transparent = false,
    className,
}) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <nav
            className={cn(
                'w-full z-50',
                sticky && 'sticky top-0',
                transparent
                    ? 'bg-transparent'
                    : 'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800',
                className
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">{logo}</div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">{children}</div>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-3">{actions}</div>

                    {/* Mobile menu button */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
                    >
                        <div className="px-4 py-4 space-y-2">{children}</div>
                        {actions && (
                            <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
                                {actions}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}

// NavLink
export interface NavLinkProps {
    href?: string
    active?: boolean
    onClick?: () => void
    children: React.ReactNode
    className?: string
}

export const NavLink: React.FC<NavLinkProps> = ({
    href,
    active = false,
    onClick,
    children,
    className,
}) => {
    const Component = href ? 'a' : 'button'

    return (
        <Component
            href={href}
            onClick={onClick}
            className={cn(
                'px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                active
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800',
                className
            )}
        >
            {children}
        </Component>
    )
}

export default Navbar
