import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'

const AdminLogin: React.FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login, isLoading } = useAuth()
    const navigate = useNavigate()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const result = await login({ username: email, password })
            if (result.user?.role === 'admin') {
                toast.success('Admin authenticated')
                navigate('/admin')
            } else {
                toast.error('Access denied: Admin credentials required')
            }
        } catch (error) {
            // Error handled by useAuth toast
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[25%] -left-[25%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[25%] -right-[25%] w-[50%] h-[50%] bg-secondary/20 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-[#111114] border border-white/5 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Admin OS Login</h1>
                        <p className="text-gray-400 text-sm mt-2">Authorized Personnel Only</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Terminal ID (Email)</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@futuresyntax.com"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Access Key</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            size="lg"
                            className="h-12 text-base font-semibold"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <div className="flex items-center gap-2">
                                    Authenticate <ArrowRight className="w-4 h-4" />
                                </div>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5">
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                            <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                            System Secure • AES-256 Encrypted
                        </div>
                    </div>
                </div>

                <p className="text-center mt-6 text-gray-500 text-xs uppercase tracking-widest font-medium">
                    © 2026 FutureSkillsSyntax Operations
                </p>
            </motion.div>
        </div>
    )
}

export default AdminLogin
