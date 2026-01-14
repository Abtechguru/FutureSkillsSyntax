import React, { useState, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'
import { ChevronLeft, ChevronDown } from 'lucide-react'

interface SidebarContextType {
    collapsed: boolean
    setCollapsed: (collapsed: boolean) => void
}

const SidebarContext = createContext<SidebarContextType>({
    collapsed: false,
    setCollapsed: () => { },
})

export interface SidebarProps {
    collapsed?: boolean
    onCollapsedChange?: (collapsed: boolean) => void
    children?: React.ReactNode
    className?: string
}

export const Sidebar: React.FC<SidebarProps> = ({
    collapsed: controlledCollapsed,
    onCollapsedChange,
    children,
    className,
}) => {
    const [internalCollapsed, setInternalCollapsed] = useState(false)
    const collapsed = controlledCollapsed ?? internalCollapsed
    const setCollapsed = onCollapsedChange ?? setInternalCollapsed

    return (
        <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
            <motion.aside
                animate={{ width: collapsed ? 64 : 256 }}
                transition={{ duration: 0.2 }}
                className={cn(
                    'h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col',
                    className
                )}
            >
                <div className="flex-1 overflow-y-auto py-4">{children}</div>

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="flex items-center justify-center p-4 border-t border-gray-200 dark:border-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                    <motion.div animate={{ rotate: collapsed ? 180 : 0 }}>
                        <ChevronLeft className="w-5 h-5" />
                    </motion.div>
                </button>
            </motion.aside>
        </SidebarContext.Provider>
    )
}

// Sidebar Item
export interface SidebarItemProps {
    icon?: React.ReactNode
    label: string
    href?: string
    active?: boolean
    onClick?: () => void
    children?: React.ReactNode
    className?: string
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
    icon,
    label,
    href,
    active = false,
    onClick,
    children,
    className,
}) => {
    const { collapsed } = useContext(SidebarContext)
    const [expanded, setExpanded] = useState(false)
    const hasChildren = React.Children.count(children) > 0

    const Component = href ? 'a' : 'button'

    const handleClick = () => {
        if (hasChildren) {
            setExpanded(!expanded)
        }
        onClick?.()
    }

    return (
        <div className={className}>
            <Component
                href={href}
                onClick={handleClick}
                className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors duration-200',
                    active
                        ? 'text-primary bg-primary/10 border-r-2 border-primary'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800',
                    collapsed && 'justify-center'
                )}
            >
                {icon && <span className="flex-shrink-0">{icon}</span>}
                <AnimatePresence>
                    {!collapsed && (
                        <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            className="flex-1 text-left truncate"
                        >
                            {label}
                        </motion.span>
                    )}
                </AnimatePresence>
                {hasChildren && !collapsed && (
                    <ChevronDown
                        className={cn(
                            'w-4 h-4 transition-transform duration-200',
                            expanded && 'rotate-180'
                        )}
                    />
                )}
            </Component>

            {/* Nested items */}
            <AnimatePresence>
                {hasChildren && expanded && !collapsed && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-4"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// Sidebar Section
export interface SidebarSectionProps {
    title?: string
    children?: React.ReactNode
    className?: string
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({
    title,
    children,
    className,
}) => {
    const { collapsed } = useContext(SidebarContext)

    return (
        <div className={cn('mb-4', className)}>
            {title && !collapsed && (
                <h3 className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {title}
                </h3>
            )}
            <div className="space-y-1">{children}</div>
        </div>
    )
}

export default Sidebar
