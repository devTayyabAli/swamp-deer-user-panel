import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [loading, setLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate password reset
        setTimeout(() => {
            setLoading(false);
            toast.success('Password reset successfully!');
            navigate('/login');
        }, 1500);
    };

    if (!token) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-page-bg p-4 sm:p-6">
                <div className="max-w-md w-full text-center space-y-6 bg-card-bg p-8 sm:p-12 rounded-[32px] border border-red-500/20 shadow-xl shadow-red-500/5">
                    <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-black text-text-main">Invalid Reset Link</h2>
                    <p className="text-text-muted font-medium">This password reset link is invalid or has expired. Please request a new one.</p>
                    <button
                        onClick={() => navigate('/forgot-password')}
                        className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:bg-deep-green transition-all"
                    >
                        Go to Forgot Password
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-forest-green">
            <div className="w-full flex items-center justify-center p-6 sm:p-12 bg-page-bg">
                <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-top-8 duration-700">
                    <div className="text-center space-y-2">
                        <div className="flex justify-center mb-6">
                            <img src="/favicon.png" alt="Swamp Deer Logo" className="h-12 w-auto" />
                        </div>
                        <h2 className="text-3xl font-bold text-text-main tracking-tight">Set New Password</h2>
                        <p className="text-text-muted">Your new password must be different from previous ones.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                        <div className="space-y-4">
                            <div className="group space-y-1">
                                <label className="text-sm font-semibold text-text-main ml-1">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        className="w-full pl-11 pr-4 py-3 bg-card-bg border border-border-subtle rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-bold text-text-main"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="group space-y-1">
                                <label className="text-sm font-semibold text-text-main ml-1">Confirm New Password</label>
                                <div className="relative">
                                    <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        className="w-full pl-11 pr-4 py-3 bg-card-bg border border-border-subtle rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-bold text-text-main"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <ul className="space-y-2 ml-1">
                            <li className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> At least 8 characters
                            </li>
                            <li className="flex items-center gap-2 text-xs font-bold text-text-muted">
                                <div className="w-1.5 h-1.5 rounded-full bg-soft" /> Must include a symbol
                            </li>
                        </ul>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white font-bold rounded-xl hover:bg-deep-green disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20 group"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Reset Password
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
