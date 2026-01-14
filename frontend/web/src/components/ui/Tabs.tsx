import React, { useState, createContext, useContext } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface TabsContextType {
    activeTab: string
    setActiveTab: (tab: string) => void
    orientation: 'horizontal' | 'vertical'
}

const TabsContext = createContext<TabsContextType>({
    activeTab: '',
    setActiveTab: () => { },
    orientation: 'horizontal',
})

export interface TabsProps {
    defaultValue?: string
    value?: string
    onValueChange?: (value: string) => void
    orientation?: 'horizontal' | 'vertical'
    children?: React.ReactNode
    className?: string
}

export const Tabs: React.FC<TabsProps> = ({
    defaultValue,
    value,
    onValueChange,
    orientation = 'horizontal',
    children,
    className,
}) => {
    const [internalValue, setInternalValue] = useState(defaultValue || '')
    const activeTab = value ?? internalValue
    const setActiveTab = onValueChange ?? setInternalValue

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab, orientation }}>
            <div
                className={cn(
                    orientation === 'horizontal' ? 'flex flex-col' : 'flex',
                    className
                )}
            >
                {children}
            </div>
        </TabsContext.Provider>
    )
}

// Tabs List
export interface TabsListProps {
    children?: React.ReactNode
    className?: string
}

export const TabsList: React.FC<TabsListProps> = ({ children, className }) => {
    const { orientation } = useContext(TabsContext)

    return (
        <div
            role="tablist"
            className={cn(
                'flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg',
                orientation === 'vertical' && 'flex-col w-48',
                className
            )}
        >
            {children}
        </div>
    )
}

// Tab Trigger
export interface TabsTriggerProps {
    value: string
    icon?: React.ReactNode
    disabled?: boolean
    children?: React.ReactNode
    className?: string
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
    value,
    icon,
    disabled = false,
    children,
    className,
}) => {
    const { activeTab, setActiveTab, orientation } = useContext(TabsContext)
    const isActive = activeTab === value

    return (
        <button
            role="tab"
            aria-selected={isActive}
            disabled={disabled}
            onClick={() => !disabled && setActiveTab(value)}
            className={cn(
                'relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200',
                isActive
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
                disabled && 'opacity-50 cursor-not-allowed',
                orientation === 'vertical' && 'w-full justify-start',
                className
            )}
        >
            {isActive && (
                <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white dark:bg-gray-700 rounded-md shadow-sm"
                    transition={{ type: 'spring', duration: 0.3 }}
                />
            )}
            <span className="relative z-10 flex items-center gap-2">
                {icon}
                {children}
            </span>
        </button>
    )
}

// Tab Content
export interface TabsContentProps {
    value: string
    children?: React.ReactNode
    className?: string
}

export const TabsContent: React.FC<TabsContentProps> = ({
    value,
    children,
    className,
}) => {
    const { activeTab, orientation } = useContext(TabsContext)

    if (activeTab !== value) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            role="tabpanel"
            className={cn(
                orientation === 'horizontal' ? 'pt-4' : 'pl-4 flex-1',
                className
            )}
        >
            {children}
        </motion.div>
    )
}

export default Tabs
