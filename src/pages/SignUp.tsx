import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, ChevronRight, Hash, Phone } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { register as registerUser, clearError } from '../redux/slices/authSlice';
import type { RootState, AppDispatch } from '../redux/store';
import { cn } from '../lib/utils';
import api from '../lib/axios';

export default function SignUp() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const referralId = searchParams.get('ref') || '';

    const dispatch = useDispatch<AppDispatch>();
    const { user, loading, error } = useSelector((state: RootState) => state.auth);
    const [branches, setBranches] = useState<any[]>([]);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            upline: referralId,
            userName: '',
            branch: '',
            password: '',
            confirmPassword: '',
        },
        mode: 'onBlur' // Validate on blur for better UX
    });

    // Fetch branches on mount
    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await api.get('/branches');
                setBranches(response.data);
            } catch (err) {
                console.error('Failed to fetch branches:', err);
            }
        };
        fetchBranches();
    }, []);

    // Update upline if URL changes
    useEffect(() => {
        if (referralId) {
            setValue('upline', referralId);
        }
    }, [referralId, setValue]);

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [user, error, navigate, dispatch]);

    const validateField = async (field: string, value: string) => {
        if (!value) return true;
        try {
            const response = await api.post('/auth/validate', { field, value });
            return response.data.success || response.data.message;
        } catch (err: any) {
            return err.response?.data?.message || 'Validation failed';
        }
    };

    const onSubmit = (data: any) => {
        const { confirmPassword, ...userData } = data;
        dispatch(registerUser(userData))
            .unwrap()
            .then((res: any) => {
                if (!res) {
                    toast.success('Account created! Please check your email to verify.');
                    navigate('/login');
                }
            })
            .catch(() => {
                // Error handled by useEffect
            });
    };

    return (
        <div className="flex min-h-screen bg-forest-green">
            {/* Left side - Decorative (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-swamp-deer items-center justify-center p-12 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-accent-gold rounded-full filter blur-3xl translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary rounded-full filter blur-3xl -translate-x-1/2 translate-y-1/2" />
                </div>

                <div className="relative z-10 text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="w-32 h-32 mx-auto bg-white/5 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl">
                        <span className="text-4xl font-black text-accent-gold tracking-tighter italic">SD</span>
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-5xl font-extrabold text-white tracking-tight leading-tight">
                            Start Your <br /> <span className="text-accent-gold">Journey</span> with Us
                        </h1>
                        <p className="text-lg text-neutral-light/70 max-sm mx-auto leading-relaxed">
                            Join thousands of investors earning daily profits and building successful global teams.
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
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create Account</h2>
                        <p className="text-gray-500">Join our community and start earning сегодня</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-8">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="group space-y-1">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        {...register('name', { required: 'Full Name is required' })}
                                        type="text"
                                        className={cn(
                                            "w-full pl-11 pr-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none",
                                            errors.name ? "border-red-500" : "border-gray-200"
                                        )}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                {errors.name && <p className="text-xs text-red-500 ml-1 mt-1">{errors.name.message}</p>}
                            </div>

                            <div className="group space-y-1">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Username</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        {...register('userName', {
                                            required: 'Username is required',
                                            validate: (val) => validateField('userName', val)
                                        })}
                                        type="text"
                                        className={cn(
                                            "w-full pl-11 pr-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none",
                                            errors.userName ? "border-red-500" : "border-gray-200"
                                        )}
                                        placeholder="Select a username"
                                    />
                                </div>
                                {errors.userName && <p className="text-xs text-red-500 ml-1 mt-1">{errors.userName.message}</p>}
                            </div>

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
                                            validate: (val) => validateField('email', val)
                                        })}
                                        type="email"
                                        className={cn(
                                            "w-full pl-11 pr-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none",
                                            errors.email ? "border-red-500" : "border-gray-200"
                                        )}
                                        placeholder="name@example.com"
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-red-500 ml-1 mt-1">{errors.email.message}</p>}
                            </div>

                            <div className="group space-y-1">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        {...register('phone', {
                                            required: 'Phone Number is required',
                                            validate: (val) => validateField('phone', val)
                                        })}
                                        type="tel"
                                        className={cn(
                                            "w-full pl-11 pr-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none",
                                            errors.phone ? "border-red-500" : "border-gray-200"
                                        )}
                                        placeholder="+1 234 567 890"
                                    />
                                </div>
                                {errors.phone && <p className="text-xs text-red-500 ml-1 mt-1">{errors.phone.message}</p>}
                            </div>

                            <div className="group space-y-1">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Select Branch</label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                    <select
                                        {...register('branch', { required: 'Please select a branch' })}
                                        className={cn(
                                            "w-full pl-11 pr-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none cursor-pointer",
                                            errors.branch ? "border-red-500" : "border-gray-200"
                                        )}
                                    >
                                        <option value="">Select a branch</option>
                                        {branches.map((b) => (
                                            <option key={b._id} value={b._id}>
                                                {b.name} ({b.city})
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <ChevronRight className="w-4 h-4 rotate-90 text-gray-400" />
                                    </div>
                                </div>
                                {errors.branch && <p className="text-xs text-red-500 ml-1 mt-1">{errors.branch.message}</p>}
                            </div>

                            <div className="group space-y-1">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Referral ID (Upline ID)</label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        {...register('upline', {
                                            validate: (val) => validateField('upline', val)
                                        })}
                                        type="text"
                                        className={cn(
                                            "w-full pl-11 pr-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none",
                                            errors.upline ? "border-red-500" : "border-gray-200"
                                        )}
                                        placeholder="Upline User ID"
                                    />
                                </div>
                                {errors.upline && <p className="text-xs text-red-500 ml-1 mt-1">{errors.upline.message}</p>}
                            </div>

                            <div className="group space-y-1">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Create Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        {...register('password', {
                                            required: 'Password is required',
                                            minLength: {
                                                value: 8,
                                                message: 'Password must be at least 8 characters',
                                            },
                                        })}
                                        type="password"
                                        className={cn(
                                            "w-full pl-11 pr-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none",
                                            errors.password ? "border-red-500" : "border-gray-200"
                                        )}
                                        placeholder="Min. 8 characters"
                                    />
                                </div>
                                {errors.password && <p className="text-xs text-red-500 ml-1 mt-1">{errors.password.message}</p>}
                            </div>

                            <div className="group space-y-1">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        {...register('confirmPassword', {
                                            required: 'Please confirm your password',
                                            validate: (val: string) => {
                                                if (watch('password') !== val) {
                                                    return "Your passwords do not match";
                                                }
                                            },
                                        })}
                                        type="password"
                                        className={cn(
                                            "w-full pl-11 pr-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none",
                                            errors.confirmPassword ? "border-red-500" : "border-gray-200"
                                        )}
                                        placeholder="Confirm your password"
                                    />
                                </div>
                                {errors.confirmPassword && <p className="text-xs text-red-500 ml-1 mt-1">{errors.confirmPassword.message}</p>}
                            </div>
                        </div>

                        <div className="flex items-start gap-2 ml-1">
                            <input type="checkbox" required id="terms" className="mt-1 accent-primary rounded cursor-pointer" />
                            <label htmlFor="terms" className="text-xs text-gray-500 leading-tight cursor-pointer">
                                By signing up, you agree to our <span className="text-primary font-bold">Terms of Service</span> and <span className="text-primary font-bold">Privacy Policy</span>.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white font-bold rounded-xl hover:bg-deep-green disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20 group mt-2"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    Sign Up
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 font-medium">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary hover:text-deep-green font-bold transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
