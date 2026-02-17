import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Users,
    UserCheck,
    CreditCard,
    TrendingUp,
    Plus,
    CheckCircle,
    XCircle,
    LayoutDashboard,
    Settings,
    Shield
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import adminService from '@/services/admin'
import type { AdminStats, UserSummary, Transaction, UserRole } from '@/services/admin'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { cn } from '@/utils/cn'

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<AdminStats | null>(null)
    const [users, setUsers] = useState<UserSummary[]>([])
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'payments' | 'mentors'>('overview')
    const [userRoleFilter, setUserRoleFilter] = useState<UserRole | 'all'>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedMentor, setSelectedMentor] = useState<UserSummary | null>(null)
    const [assignmentTarget, setAssignmentTarget] = useState<string>('')
    const [isAssigning, setIsAssigning] = useState(false)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            const [s, u, t] = await Promise.all([
                adminService.getStats(),
                adminService.getUsers(),
                adminService.getTransactions()
            ])
            setStats(s)
            setUsers(u)
            setTransactions(t)
        } catch (error) {
            toast.error('Failed to load admin data')
        } finally {
            setLoading(false)
        }
    }

    const verifyPayment = async (id: number, approve: boolean) => {
        try {
            await adminService.verifyTransaction(id, approve)
            toast.success(approve ? 'Payment approved' : 'Payment rejected')
            loadData()
        } catch (error) {
            toast.error('Verification failed')
        }
    }

    const handleAssign = async () => {
        if (!selectedMentor || !assignmentTarget) return
        setIsAssigning(true)
        try {
            await adminService.createAssignment({
                mentor_id: selectedMentor.id,
                mentee_id: parseInt(assignmentTarget),
                start_date: new Date().toISOString(),
                end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 days
            })
            toast.success('Mentor assigned successfully')
            setSelectedMentor(null)
            setAssignmentTarget('')
        } catch (error) {
            toast.error('Assignment failed')
        } finally {
            setIsAssigning(false)
        }
    }

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#0a0a0c]">
                <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-white flex">
            {/* Sidebar */}
            <aside className="w-64 bg-[#111114] border-r border-white/5 flex flex-col">
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">Admin OS</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {[
                        { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                        { id: 'users', icon: Users, label: 'User Base' },
                        { id: 'mentors', icon: UserCheck, label: 'Mentor Hub' },
                        { id: 'payments', icon: CreditCard, label: 'Transactions' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as any)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                                activeTab === item.id
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors">
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">Settings</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Admin Central</h1>
                        <p className="text-gray-400">Welcome back, Super Admin</p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" icon={<Plus />} onClick={() => setActiveTab('mentors')}>
                            Add Mentor
                        </Button>
                        <Button variant="primary" onClick={loadData}>
                            Refresh Data
                        </Button>
                    </div>
                </header>

                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Users', value: stats?.total_users, icon: Users, color: 'blue' },
                                { label: 'Active Mentors', value: stats?.total_mentors, icon: UserCheck, color: 'green' },
                                { label: 'Revenue', value: `$${stats?.total_revenue.toFixed(2)} `, icon: TrendingUp, color: 'purple' },
                                { label: 'Pending Payouts', value: stats?.pending_transactions, icon: CreditCard, color: 'orange' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-[#111114] p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center bg-opacity-10 transition-transform group-hover:scale-110",
                                            stat.color === 'blue' && "bg-blue-500 text-blue-500",
                                            stat.color === 'green' && "bg-green-500 text-green-500",
                                            stat.color === 'purple' && "bg-purple-500 text-purple-500",
                                            stat.color === 'orange' && "bg-orange-500 text-orange-500",
                                        )}>
                                            <stat.icon className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <h3 className="text-gray-400 text-sm font-medium">{stat.label}</h3>
                                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Recent Activity Rows */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-[#111114] rounded-2xl border border-white/5 p-6">
                                <h2 className="text-xl font-bold mb-6">Recent Transactions</h2>
                                <div className="space-y-4">
                                    {transactions.slice(0, 5).map((tx) => (
                                        <div key={tx.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                                    <CreditCard className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{tx.purpose}</p>
                                                    <p className="text-xs text-gray-500">{tx.provider.toUpperCase()} • {tx.reference}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-sm">${tx.amount}</p>
                                                <Badge variant={tx.status === 'successful' ? 'success' : 'warning'} size="sm">
                                                    {tx.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-[#111114] rounded-2xl border border-white/5 p-6">
                                <h2 className="text-xl font-bold mb-6">New User Registrations</h2>
                                <div className="space-y-4">
                                    {users.slice(0, 5).map((user) => (
                                        <div key={user.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                                                    <span className="text-xs font-bold">{user.full_name[0]}</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{user.full_name}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                            <Badge variant="info" size="sm">
                                                {user.role}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                            <div className="relative w-full md:w-96">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                    <Users size={18} />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search users by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-[#111114] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-primary outline-none transition-all"
                                />
                            </div>
                            <div className="flex gap-2">
                                {['all', 'mentor', 'mentee', 'career_seeker', 'parent', 'admin'].map((role) => (
                                    <button
                                        key={role}
                                        onClick={() => setUserRoleFilter(role as any)}
                                        className={cn(
                                            "px-4 py-2 rounded-lg text-xs font-medium transition-all",
                                            userRoleFilter === role
                                                ? "bg-primary text-white"
                                                : "bg-[#111114] border border-white/5 text-gray-400 hover:text-white"
                                        )}
                                    >
                                        {role.replace('_', ' ').toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#111114] rounded-2xl border border-white/5 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-gray-400 text-sm uppercase">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">User</th>
                                        <th className="px-6 py-4 font-medium">Email</th>
                                        <th className="px-6 py-4 font-medium">Role</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                        <th className="px-6 py-4 font-medium">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {users
                                        .filter(u => userRoleFilter === 'all' || u.role === userRoleFilter)
                                        .filter(u =>
                                            u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            u.email.toLowerCase().includes(searchQuery.toLowerCase())
                                        )
                                        .map((user) => (
                                            <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                                        {user.full_name[0]}
                                                    </div>
                                                    <span className="text-sm font-medium">{user.full_name}</span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-400">{user.email}</td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="info" size="sm" className="capitalize">{user.role}</Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className={cn("w-1.5 h-1.5 rounded-full pulse", user.is_active ? "bg-success" : "bg-gray-500")} />
                                                        <span className="text-xs text-gray-400">{user.is_active ? 'Active' : 'Inactive'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'payments' && (
                    <div className="bg-[#111114] rounded-2xl border border-white/5 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-gray-400 text-sm uppercase">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Reference</th>
                                    <th className="px-6 py-4 font-medium">User</th>
                                    <th className="px-6 py-4 font-medium">Amount</th>
                                    <th className="px-6 py-4 font-medium">Provider</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-primary">{tx.reference}</td>
                                        <td className="px-6 py-4 text-sm">User #{tx.user_id}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-white">${tx.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <Badge variant="secondary" size="sm" className="uppercase">{tx.provider}</Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={tx.status === 'successful' ? 'success' : tx.status === 'pending' ? 'warning' : 'error'}>
                                                {tx.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 flex gap-2">
                                            {tx.status === 'pending' && (
                                                <>
                                                    <IconButton icon={<CheckCircle size={18} />} onClick={() => verifyPayment(tx.id, true)} className="text-success hover:bg-success/10" />
                                                    <IconButton icon={<XCircle size={18} />} onClick={() => verifyPayment(tx.id, false)} className="text-error hover:bg-error/10" />
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'mentors' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {users.filter(u => u.role === 'mentor').map((mentor) => (
                                <div key={mentor.id} className="bg-[#111114] border border-white/5 p-6 rounded-2xl flex flex-col items-center text-center hover:border-primary/50 transition-all group">
                                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                                        <UserCheck className="w-10 h-10 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-bold">{mentor.full_name}</h3>
                                    <p className="text-sm text-gray-400 mb-6">{mentor.email}</p>
                                    <div className="flex gap-2 w-full">
                                        <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedMentor(mentor)}>Details</Button>
                                        <Button variant="primary" size="sm" className="flex-1" onClick={() => setSelectedMentor(mentor)}>Assign</Button>
                                    </div>
                                </div>
                            ))}
                            <button className="border-2 border-dashed border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-500 hover:border-primary/50 hover:text-primary transition-all group">
                                <div className="p-3 rounded-full bg-white/5 group-hover:bg-primary/10 mb-3">
                                    <Plus className="w-6 h-6" />
                                </div>
                                <span className="font-medium">Add New Mentor</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Mentor Assignment Modal */}
                {selectedMentor && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-[#111114] border border-white/10 rounded-3xl p-8 max-w-lg w-full shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold mb-2">Manage Mentor</h2>
                            <p className="text-gray-400 mb-6 font-medium">Mentor: <span className="text-white">{selectedMentor.full_name}</span></p>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Assign to Mentee</label>
                                    <select
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary outline-none"
                                        value={assignmentTarget}
                                        onChange={(e) => setAssignmentTarget(e.target.value)}
                                    >
                                        <option value="" className="bg-[#111114]">Select a mentee...</option>
                                        {users.filter(u => u.role === 'mentee').map(mentee => (
                                            <option key={mentee.id} value={mentee.id} className="bg-[#111114]">
                                                {mentee.full_name} ({mentee.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl">
                                    <p className="text-xs text-primary font-medium uppercase tracking-wider mb-2">Auto-Settings</p>
                                    <ul className="text-xs text-gray-400 space-y-1">
                                        <li>• Standard 90-day duration</li>
                                        <li>• Weekly progress tracking enabled</li>
                                        <li>• Direct messaging activated</li>
                                    </ul>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button variant="outline" fullWidth onClick={() => setSelectedMentor(null)}>Cancel</Button>
                                    <Button
                                        variant="primary"
                                        fullWidth
                                        onClick={handleAssign}
                                        disabled={!assignmentTarget || isAssigning}
                                    >
                                        {isAssigning ? 'Assigning...' : 'Confirm Assignment'}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </main>
        </div>
    )
}

const IconButton = ({ icon, onClick, className }: { icon: React.ReactNode, onClick: () => void, className?: string }) => (
    <button onClick={onClick} className={cn("p-2 rounded-lg transition-all", className)}>
        {icon}
    </button>
)

export default AdminDashboard
