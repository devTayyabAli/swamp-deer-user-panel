import React from 'react';
import { User, Mail, Shield, Calendar, MapPin, Phone, Edit, Save, Camera, Link2, Copy, Lock, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { updateProfile, updatePassword, clearError } from '../redux/slices/authSlice';
import type { RootState, AppDispatch } from '../redux/store';
import { cn } from '../lib/utils';

export default function Profile() {
    const dispatch = useDispatch<AppDispatch>();
    const { user, loading, error } = useSelector((state: RootState) => state.auth);
    const [editing, setEditing] = React.useState(false);
    const [showPasswordModal, setShowPasswordModal] = React.useState(false);
    const [profilePicBase64, setProfilePicBase64] = React.useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const {
        register: profileRegister,
        handleSubmit: handleProfileSubmit,
        reset: resetProfile,
        formState: { errors: profileErrors },
    } = useForm({
        defaultValues: {
            name: user?.name || '',
            phone: user?.phone || '',
            address: user?.address || '',
        },
    });

    const {
        register: passwordRegister,
        handleSubmit: handlePasswordSubmit,
        watch: watchPassword,
        reset: resetPasswordForm,
        formState: { errors: passwordErrors },
    } = useForm({
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    React.useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const onProfileSubmit = async (data: any) => {
        const result = await dispatch(updateProfile({
            ...data,
            profilePic: profilePicBase64 || user?.profilePic
        }));
        if (updateProfile.fulfilled.match(result)) {
            toast.success('Profile updated successfully!');
            setEditing(false);
            setProfilePicBase64(null);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                toast.error('Image size should be less than 2MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicBase64(reader.result as string);
                setEditing(true); // Auto-enable editing mode when a new picture is chosen
            };
            reader.readAsDataURL(file);
        }
    };

    const onPasswordSubmit = async (data: any) => {
        const result = await dispatch(updatePassword({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword
        }));
        if (updatePassword.fulfilled.match(result)) {
            toast.success('Password changed successfully!');
            setShowPasswordModal(false);
            resetPasswordForm();
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    const signupLink = `${window.location.origin}/signup?ref=${user?.userName}`;
    const formattedJoinedDate = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : 'Jan 2024';

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-main tracking-tight">Your Profile</h1>
                    <p className="text-text-muted">Manage your account settings and personal information.</p>
                </div>
                {!editing ? (
                    <button
                        onClick={() => setEditing(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-deep-green shadow-lg shadow-primary/20 transition-all"
                    >
                        <Edit className="w-4 h-4" /> Edit Profile
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                setEditing(false);
                                resetProfile();
                            }}
                            className="px-6 py-2.5 bg-soft text-text-muted font-bold rounded-xl hover:bg-soft/70 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleProfileSubmit(onProfileSubmit)}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-deep-green shadow-lg shadow-primary/20 transition-all disabled:opacity-70"
                        >
                            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Card - User Info */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-card-bg p-8 rounded-2xl border border-border-subtle shadow-sm text-center transition-colors">
                        <div className="relative inline-block mb-4">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-page-bg shadow-lg mx-auto overflow-hidden">
                                {profilePicBase64 || user?.profilePic ? (
                                    <img src={profilePicBase64 || user?.profilePic} alt={user?.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-12 h-12 text-primary" />
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 p-1.5 bg-card-bg rounded-full shadow-md border border-border-subtle text-primary hover:text-deep-green transition-colors"
                            >
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>
                        <h3 className="text-lg font-bold text-text-main">{user?.name}</h3>
                        <p className="text-xs font-bold text-text-muted/60 uppercase tracking-widest mb-6">
                            {user?.role === 'super_admin' ? 'Administrator' : (user?.currentLevel ? `Level ${user.currentLevel} Investor` : 'Platinum Investor')}
                        </p>

                        <div className="pt-6 border-t border-border-subtle flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-sm text-text-muted">
                                <Calendar className="w-4 h-4 text-text-muted/60" />
                                {`Joined ${formattedJoinedDate}`}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-text-muted">
                                <Shield className="w-4 h-4 text-emerald-500" />
                                Account Verified
                            </div>
                        </div>
                    </div>

                    <div className="bg-swamp-deer p-6 rounded-2xl text-white shadow-xl">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] opacity-40 mb-4">Referral Tools</h4>
                        <div className="space-y-4">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-[10px] font-bold opacity-60 mb-1">Your ID</p>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-accent-gold">{user?.userName}</span>
                                    <button onClick={() => handleCopy(user?.userName || '')} className="hover:text-accent-gold transition-colors"><Copy className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-[10px] font-bold opacity-60 mb-1">Signup Link</p>
                                <div className="flex items-center justify-between gap-2 overflow-hidden">
                                    <span className="text-[10px] truncate opacity-80 italic">{signupLink}</span>
                                    <button onClick={() => handleCopy(signupLink)} className="shrink-0 hover:text-accent-gold transition-colors"><Link2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Card - Form */}
                <div className="md:col-span-2">
                    <div className="bg-card-bg p-8 rounded-2xl border border-border-subtle shadow-sm transition-colors">
                        <h3 className="text-lg font-bold text-text-main mb-8 border-b border-border-subtle pb-4">Personal Information</h3>
                        <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-muted/60 uppercase tracking-widest">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                    <input
                                        {...profileRegister('name', { required: 'Full name is required' })}
                                        disabled={!editing}
                                        type="text"
                                        className={cn(
                                            "w-full pl-10 pr-4 py-3 bg-soft border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-bold text-sm disabled:opacity-70 transition-all text-text-main",
                                            profileErrors.name ? "border-red-500" : "border-border-subtle"
                                        )}
                                    />
                                </div>
                                {profileErrors.name && <p className="text-[10px] text-red-500">{profileErrors.name.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-muted/60 uppercase tracking-widest">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                    <input
                                        disabled
                                        type="email"
                                        value={user?.email}
                                        className="w-full pl-10 pr-4 py-3 bg-soft border border-border-subtle rounded-xl font-bold text-sm opacity-50 cursor-not-allowed text-text-main"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-muted/60 uppercase tracking-widest">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                    <input
                                        {...profileRegister('phone')}
                                        disabled={!editing}
                                        type="text"
                                        className="w-full pl-10 pr-4 py-3 bg-soft border border-border-subtle rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-bold text-sm disabled:opacity-70 transition-all text-text-main"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-muted/60 uppercase tracking-widest">Location / Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                    <input
                                        {...profileRegister('address')}
                                        disabled={!editing}
                                        type="text"
                                        placeholder="Enter your location"
                                        className="w-full pl-10 pr-4 py-3 bg-soft border border-border-subtle rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-bold text-sm disabled:opacity-70 transition-all text-text-main"
                                    />
                                </div>
                            </div>
                        </form>

                        <h3 className="text-lg font-bold text-text-main mt-12 mb-8 border-b border-border-subtle pb-4">Security</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20 italic">
                                <span className="text-sm font-bold text-red-700 dark:text-red-400">Change Password</span>
                                <button
                                    onClick={() => setShowPasswordModal(true)}
                                    className="text-xs font-black text-red-700 underline uppercase tracking-widest"
                                >
                                    Secure Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-card-bg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 bg-soft/50 border-b border-border-subtle flex items-center justify-between">
                            <h3 className="font-bold text-text-main">Change Password</h3>
                            <button onClick={() => setShowPasswordModal(false)} className="text-text-muted hover:text-text-muted dark:hover:text-gray-300"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Current Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/60" />
                                    <input
                                        {...passwordRegister('currentPassword', { required: 'Current password is required' })}
                                        type="password"
                                        className={cn(
                                            "w-full pl-10 pr-4 py-2.5 bg-soft border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm text-text-main",
                                            passwordErrors.currentPassword ? "border-red-500" : "border-border-subtle"
                                        )}
                                        placeholder="••••••••"
                                    />
                                </div>
                                {passwordErrors.currentPassword && <p className="text-[10px] text-red-500">{passwordErrors.currentPassword.message}</p>}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/60" />
                                    <input
                                        {...passwordRegister('newPassword', {
                                            required: 'New password is required',
                                            minLength: { value: 8, message: 'Password must be at least 8 characters' }
                                        })}
                                        type="password"
                                        className={cn(
                                            "w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm text-text-main",
                                            passwordErrors.newPassword ? "border-red-500" : "border-gray-200 dark:border-white/10"
                                        )}
                                        placeholder="••••••••"
                                    />
                                </div>
                                {passwordErrors.newPassword && <p className="text-[10px] text-red-500">{passwordErrors.newPassword.message}</p>}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Confirm New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/60" />
                                    <input
                                        {...passwordRegister('confirmPassword', {
                                            required: 'Please confirm your new password',
                                            validate: (val) => val === watchPassword('newPassword') || 'Passwords do not match'
                                        })}
                                        type="password"
                                        className={cn(
                                            "w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm dark:text-white",
                                            passwordErrors.confirmPassword ? "border-red-500" : "border-gray-200 dark:border-white/10"
                                        )}
                                        placeholder="••••••••"
                                    />
                                </div>
                                {passwordErrors.confirmPassword && <p className="text-[10px] text-red-500">{passwordErrors.confirmPassword.message}</p>}
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-deep-green shadow-lg shadow-primary/20 transition-all disabled:opacity-70 mt-4"
                            >
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
