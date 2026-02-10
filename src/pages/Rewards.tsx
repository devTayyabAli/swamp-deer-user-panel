import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Trophy,
    Gift,
    CheckCircle2,
    Lock,
    Clock,
    ArrowRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';
import { fetchDashboardStats, claimReward } from '../redux/slices/dashboardSlice';
import type { RootState, AppDispatch } from '../redux/store';

export default function Rewards() {
    const dispatch = useDispatch<AppDispatch>();
    const { stats, loading } = useSelector((state: RootState) => state.dashboard);

    React.useEffect(() => {
        dispatch(fetchDashboardStats());
    }, [dispatch]);

    const handleClaim = async (rankId: number, reward: string) => {
        const promise = dispatch(claimReward(rankId)).unwrap();
        toast.promise(promise, {
            loading: `Claiming ${reward}...`,
            success: (data: any) => data.message || 'Claim request submitted!',
            error: (err: any) => err || 'Failed to claim reward'
        });
    };

    const formatCurrency = (amount: number) => {
        return `Rs ${amount.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })}`;
    };

    if (loading && !stats) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="space-y-8 pb-20">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-swamp-deer rounded-3xl p-8 text-white shadow-2xl">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                            <Trophy className="w-6 h-6 text-accent-gold" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tighter">Rank Rewards</h1>
                    </div>
                    <p className="text-white/80 max-w-xl font-medium">
                        Achieve business targets to unlock premium rewards, from northern area tours to luxury cars and villas.
                    </p>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/20 rounded-full -ml-24 -mb-24 blur-3xl" />
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-border-light shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Direct Business</span>
                        <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase tracking-tighter">Without Product</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-gray-900">{formatCurrency(stats.kpis.totalDirectBusiness)}</span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-border-light shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Total Team Business</span>
                        <span className="text-[9px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded uppercase tracking-tighter">With Product</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-gray-900">{formatCurrency(stats.kpis.totalBusinessVolume)}</span>
                        <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-0.5 rounded">Cumulative</span>
                    </div>
                </div>
            </div>

            {/* Rewards Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {stats.levels.map((level) => {
                    const isAchieved = level.status === 'achieved';
                    const isClaimed = level.isClaimed;

                    return (
                        <div
                            key={level.no}
                            className={cn(
                                "group relative bg-white rounded-3xl border transition-all duration-500 overflow-hidden",
                                isAchieved
                                    ? "border-emerald-200 shadow-lg shadow-emerald-500/5 rotate-0"
                                    : "border-border-light shadow-sm translate-y-0"
                            )}
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex gap-4">
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                                            isAchieved
                                                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                                                : "bg-neutral-light text-gray-400"
                                        )}>
                                            <Gift className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Level {level.no}</span>
                                                {isAchieved && (
                                                    <span className="flex items-center gap-0.5 text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                                                        <CheckCircle2 className="w-2.5 h-2.5" />
                                                        Achieved
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-xl font-black text-gray-900 leading-tight">{level.name}</h3>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Reward Value</span>
                                        <span className="text-lg font-black text-accent-gold italic">{level.reward}</span>
                                    </div>
                                </div>

                                {/* Target Section */}
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Main Target</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-gray-600 tracking-tight">{level.criteria}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-black text-primary italic">{Math.round(level.progress)}%</span>
                                        </div>
                                    </div>

                                    {/* Progress Bar Container */}
                                    <div className="relative">
                                        <div className="w-full h-3 bg-neutral-light rounded-full overflow-hidden shadow-inner border border-gray-100/50">
                                            <div
                                                className={cn(
                                                    "h-full transition-all duration-1000 relative overflow-hidden",
                                                    isAchieved ? "bg-emerald-500" : "bg-primary"
                                                )}
                                                style={{ width: `${level.progress}%` }}
                                            >
                                                <div className="absolute inset-0 bg-white/20 animate-shimmer" style={{ backgroundSize: '1000px 100%' }} />
                                            </div>
                                        </div>

                                        {!isAchieved && (
                                            <div className="mt-3 flex flex-col gap-1.5">
                                                <div className="flex justify-between items-center text-[10px] font-bold">
                                                    <span className="text-gray-400">Remaining (Without Product):</span>
                                                    <span className="text-primary tracking-tight">{formatCurrency(level.remainingDirect)}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-[10px] font-bold">
                                                    <span className="text-gray-400">Remaining (With Product):</span>
                                                    <span className="text-primary tracking-tight">{formatCurrency(level.remainingTotal)}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Area */}
                                <div className="pt-6 border-t border-gray-100">
                                    {isAchieved ? (
                                        <div className="flex items-center justify-between">
                                            {level.claimStatus === 'not_claimed' ? (
                                                <button
                                                    onClick={() => handleClaim(level.id, level.reward)}
                                                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
                                                >
                                                    Claim This Reward <ArrowRight className="w-4 h-4" />
                                                </button>
                                            ) : (
                                                <div className={cn(
                                                    "w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 border-2 border-dashed",
                                                    isClaimed
                                                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                                        : "bg-amber-50 border-amber-200 text-amber-700"
                                                )}>
                                                    {isClaimed ? (
                                                        <>
                                                            <CheckCircle2 className="w-5 h-5" />
                                                            Reward Approved & Issued
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Clock className="w-5 h-5 animate-pulse" />
                                                            Pending Admin Approval
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3 p-4 bg-neutral-light rounded-2xl opacity-60">
                                            <Lock className="w-5 h-5 text-gray-400" />
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Achieve targets to unlock</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Hover Overlay */}
                            {!isAchieved && (
                                <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                    <div className="bg-white/90 px-6 py-3 rounded-2xl shadow-xl border border-border-light scale-90 group-hover:scale-100 transition-transform">
                                        <span className="text-xs font-black text-primary uppercase tracking-widest">Keep growing!</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
