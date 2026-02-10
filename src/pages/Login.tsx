import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { login, clearError } from '../redux/slices/authSlice';
import type { RootState, AppDispatch } from '../redux/store';

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { user, loading, error } = useSelector((state: RootState) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [user, error, navigate, dispatch]);

    const onSubmit = (data: any) => {
        dispatch(login(data));
    };

    return (
        <div className="flex min-h-screen bg-forest-green">
            {/* Left side - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-swamp-deer items-center justify-center p-12 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-accent-gold rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2" />
                </div>

                <div className="relative z-10 text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="w-32 h-32 mx-auto bg-white/5 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl">
                        <span className="text-4xl font-black text-accent-gold tracking-tighter italic">SD</span>
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-5xl font-extrabold text-white tracking-tight">
                            Grow Your <span className="text-accent-gold">Investment</span>
                        </h1>
                        <p className="text-lg text-neutral-light/70 max-w-md mx-auto leading-relaxed">
                            Experience the next generation of referral-based staking. Transparent, secure, and rewarding.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-neutral-light">
                <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                    <div className="text-center lg:text-left space-y-2">
                        <div className="flex lg:hidden justify-center mb-6">
                            <span className="text-3xl font-black text-primary tracking-tighter italic">SWAMP DEER</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
                        <p className="text-gray-500">Enter your credentials to access your portal</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8">
                        <div className="space-y-4">
                            <div className="group space-y-1">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Invalid email address',
                                            },
                                        })}
                                        type="email"
                                        className={`w-full pl-11 pr-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none ${errors.email ? "border-red-500" : "border-gray-200"}`}
                                        placeholder="name@example.com"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-xs text-red-500 ml-1 mt-1">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="group space-y-1">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-sm font-semibold text-gray-700">Password</label>
                                    <Link to="/forgot-password" title="Recover account" className="text-xs font-semibold text-primary hover:text-deep-green transition-colors">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        {...register('password', {
                                            required: 'Password is required',
                                            minLength: {
                                                value: 6,
                                                message: 'Password must be at least 6 characters',
                                            },
                                        })}
                                        type="password"
                                        className={
                                            `w-full pl-11 pr-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none ${errors.password ? "border-red-500" : "border-gray-200"}`}

                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.password && (
                                    <p className="text-xs text-red-500 ml-1 mt-1">{errors.password.message}</p>
                                )}
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
                                    <LogIn className="w-5 h-5" />
                                    Sign In
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 font-medium">
                        New here?{' '}
                        <Link to="/signup" className="text-primary hover:text-deep-green font-bold transition-colors">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
