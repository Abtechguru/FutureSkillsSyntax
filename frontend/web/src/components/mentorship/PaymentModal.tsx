import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X,
    CreditCard,
    Smartphone,
    Building2,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Lock
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { cn } from '@/utils/cn'

interface PaymentModalProps {
    isOpen: boolean
    onClose: () => void
    amount: number
    purpose: string
    onSuccess: (reference: string) => void
}

type PaymentMethod = 'paystack' | 'paypal' | 'local'

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, amount, purpose, onSuccess }) => {
    const [method, setMethod] = useState<PaymentMethod | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [step, setStep] = useState<'selection' | 'processing' | 'local_instructions' | 'success'>('selection')

    const handlePayment = async () => {
        if (!method) return

        setIsProcessing(true)
        setStep('processing')

        // Mocking payment integration logic
        setTimeout(() => {
            if (method === 'local') {
                setStep('local_instructions')
            } else {
                setStep('success')
                setTimeout(() => {
                    onSuccess(`MOCK-${Date.now()}`)
                    onClose()
                }, 2000)
            }
            setIsProcessing(false)
        }, 2000)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-[#111114] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-white">Complete Payment</h3>
                                <p className="text-sm text-gray-400">{purpose}</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <div className="p-8">
                            {step === 'selection' && (
                                <div className="space-y-6">
                                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center justify-between mb-8">
                                        <span className="text-gray-300">Total Amount</span>
                                        <span className="text-2xl font-bold text-primary">${amount.toFixed(2)}</span>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider ml-1">Select Payment Method</p>

                                        {[
                                            { id: 'paystack', name: 'Paystack', icon: CreditCard, desc: 'Cards, Bank, USSD' },
                                            { id: 'paypal', name: 'PayPal', icon: Smartphone, desc: 'International Credit/Debit Card' },
                                            { id: 'local', name: 'Local Transfer', icon: Building2, desc: 'Bank Transfer (Naira/Local currency)' },
                                        ].map((m) => (
                                            <button
                                                key={m.id}
                                                onClick={() => setMethod(m.id as PaymentMethod)}
                                                className={cn(
                                                    "w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300",
                                                    method === m.id
                                                        ? "bg-primary/10 border-primary shadow-lg shadow-primary/10"
                                                        : "bg-white/5 border-white/5 hover:border-white/20"
                                                )}
                                            >
                                                <div className="flex items-center gap-4 text-left">
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-xl flex items-center justify-center",
                                                        method === m.id ? "bg-primary text-white" : "bg-white/10 text-gray-400"
                                                    )}>
                                                        <m.icon className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white">{m.name}</p>
                                                        <p className="text-xs text-gray-400">{m.desc}</p>
                                                    </div>
                                                </div>
                                                <div className={cn(
                                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                                    method === m.id ? "border-primary bg-primary" : "border-white/10"
                                                )}>
                                                    {method === m.id && <div className="w-2 h-2 bg-white rounded-full" />}
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    <Button
                                        variant="primary"
                                        fullWidth
                                        size="lg"
                                        disabled={!method}
                                        onClick={handlePayment}
                                        className="h-14 text-lg rounded-2xl"
                                    >
                                        Pay Now <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>

                                    <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                                        <Lock className="w-3 h-3" /> Secure checkout powered by SSL
                                    </p>
                                </div>
                            )}

                            {step === 'processing' && (
                                <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="relative">
                                        <div className="w-20 h-20 border-4 border-primary/20 rounded-full animate-spin border-t-primary" />
                                        <CreditCard className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white">Initializing Gateway</h4>
                                        <p className="text-gray-400 mt-2">Connecting to {method} secure serves...</p>
                                    </div>
                                </div>
                            )}

                            {step === 'local_instructions' && (
                                <div className="space-y-6">
                                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <Building2 className="w-6 h-6 text-blue-500" />
                                            <h4 className="font-bold text-white text-lg">Bank Transfer Details</h4>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-widest font-black">Bank Name</p>
                                                <p className="text-white font-medium">FutureSkills Bank PLC</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-widest font-black">Account Number</p>
                                                <p className="text-2xl font-mono font-bold text-white flex items-center gap-2 tracking-tighter">
                                                    0123456789
                                                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded uppercase font-bold tracking-normal italic cursor-pointer">Copy</span>
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-widest font-black">Account Name</p>
                                                <p className="text-white font-medium italic">FUTURE SKILLS SYNTAX LTD</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                                        <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                                        <p className="text-sm text-gray-300">
                                            Please upload your proof of payment on the dashboard after transfer. Your session will be activated once verified by our admin.
                                        </p>
                                    </div>

                                    <Button variant="primary" fullWidth onClick={onClose} className="h-12">
                                        I've made the transfer
                                    </Button>
                                </div>
                            )}

                            {step === 'success' && (
                                <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="w-12 h-12 text-success" />
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-bold text-white">Payment Successful!</h4>
                                        <p className="text-gray-400 mt-2 italic">Your transaction has been processed successfully.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default PaymentModal
