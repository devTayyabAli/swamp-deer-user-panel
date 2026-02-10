import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ForgotPassword() {
    const [loading, setLoading] = React.useState(false);
    const [submitted, setSubmitted] = React.useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate forgot password request
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
            toast.success('Reset link sent to your email!');
        }, 1500);
    };

    return (
        <div className="flex min-h-screen bg-forest-green">
            <div className="w-full flex items-center justify-center p-6 sm:p-12 bg-neutral-light">
                <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="text-center space-y-2">
                        <div className="flex justify-center mb-6">
                            <span className="text-3xl font-black text-primary tracking-tighter italic">SWAMP DEER</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Forgot Password?</h2>
                        <p className="text-gray-500">No worries, we'll send you reset instructions.</p>
                    </div>

                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                            <div className="group space-y-1">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>

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
                    ) : (
                        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl text-center space-y-4">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-bold text-emerald-900">Check your email</h4>
                                <p className="text-sm text-emerald-700">We've sent a password reset link to your email address.</p>
                            </div>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="text-sm font-bold text-emerald-700 hover:underline"
                            >
                                Didn't receive the email? Click to retry
                            </button>
                        </div>
                    )}

                    <div className="text-center pt-4">
                        <Link to="/login" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary font-bold transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
