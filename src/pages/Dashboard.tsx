import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    TrendingUp,
    Users,
    UserPlus,
    Wallet,
    ArrowUpRight,
    BarChart3,
    ChevronRight,
    Target,
    Trophy,
    Copy,
    ExternalLink,
    Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';
import { fetchDashboardStats, claimReward } from '../redux/slices/dashboardSlice';
import type { RootState, AppDispatch } from '../redux/store';

export default function Dashboard() {
    const dispatch = useDispatch<AppDispatch>();
    const { stats, loading, error } = useSelector((state: RootState) => state.dashboard);

    React.useEffect(() => {
        dispatch(fetchDashboardStats());
    }, [dispatch]);

    const handleClaim = async (rankId: number, reward: string) => {
        const promise = dispatch(claimReward(rankId)).unwrap();
        toast.promise(promise, {
            loading: `Claiming ${reward}...`,
            success: (data) => data.message || 'Claim request submitted!',
            error: (err) => err || 'Failed to claim reward'
        });
    };

    const formatCurrency = (amount: number) => {
        return `Rs ${amount.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        })}`;
    };

    const referralLink = stats ? `${import.meta.env.VITE_REFERRAL_BASE_URL || 'http://localhost:5173/signup'}?ref=${stats.user.referralId}` : '';

    const copyReferral = () => {
        navigator.clipboard.writeText(referralLink);
        toast.success('Referral link copied!');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md">
                        <p className="text-red-600 font-semibold mb-2">Error loading dashboard</p>
                        <p className="text-red-500 text-sm">{error}</p>
                        <button
                            onClick={() => dispatch(fetchDashboardStats())}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!stats) return null;

    const kpis = [
        { label: 'Total Business Volume', value: formatCurrency(stats.kpis.totalBusinessVolume), icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Available Balance', value: formatCurrency(stats.kpis.availableBalance), icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-100' },
        { label: 'Total Direct Business', value: formatCurrency(stats.kpis.totalDirectBusiness), icon: UserPlus, color: 'text-emerald-300', bg: 'bg-emerald-50' },
        { label: 'Staking Bonus', value: formatCurrency(stats.kpis.stakingIncome), icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
        { label: 'Referral Bonus', value: formatCurrency(stats.kpis.referralIncome), icon: Target, color: 'text-orange-600', bg: 'bg-orange-100' },
        { label: 'Level Bonus', value: formatCurrency(stats.kpis.levelIncome), icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
        { label: 'Total Profit Earned', value: formatCurrency(stats.kpis.totalProfitEarned), icon: Trophy, color: 'text-accent-gold', bg: 'bg-accent-gold/10' },
    ];

    const teamStats = [
        { label: 'Total Team Size', value: stats.teamStats.totalTeamSize.toString(), icon: Users },
        { label: 'Direct Team', value: stats.teamStats.directTeam.toString(), icon: UserPlus },
        { label: 'Indirect Team', value: stats.teamStats.indirectTeam.toString(), icon: Users },
    ];

    return (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700">
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">User Dashboard</h1>
                    <p className="text-sm sm:text-base text-gray-500 font-medium">Welcome back, {stats.user.name}. Here's your overview.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] sm:text-xs font-black rounded-full border border-emerald-200 uppercase tracking-wider">
                        {stats.user.role === 'investor' ? 'Active Investor' : 'Active Referrer'}
                    </span>
                    <span className="px-3 py-1 bg-accent-gold/10 text-accent-gold text-[10px] sm:text-xs font-black rounded-full border border-accent-gold/20 uppercase tracking-wider">
                        Rank: {stats.user.rank}
                    </span>
                </div>
            </div>

            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kpis.map((kpi) => (
                    <div key={kpi.label} className="bg-white p-6 rounded-2xl border border-border-light shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={cn("p-3 rounded-xl", kpi.bg)}>
                                <kpi.icon className={cn("w-6 h-6", kpi.color)} />
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                        </div>
                        <p className="text-sm font-medium text-gray-500 mb-1">{kpi.label}</p>
                        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{kpi.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Team Stats & Referral */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Team Stats */}
                    <div className="bg-white p-6 rounded-2xl border border-border-light shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            Team Overview
                        </h3>
                        <div className="space-y-4">
                            {teamStats.map((stat) => (
                                <div key={stat.label} className="flex items-center justify-between p-4 bg-neutral-light rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <stat.icon className="w-5 h-5 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                                    </div>
                                    <span className="text-lg font-bold text-gray-900">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Referral Link */}
                    <div className="bg-swamp-deer p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden text-white group/referral">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/referral:scale-110 transition-transform duration-500">
                            <UserPlus className="w-24 h-24 sm:w-32 sm:h-32" />
                        </div>
                        <h3 className="text-xl font-black mb-4 relative z-10 tracking-tight">Invite Friends</h3>
                        <p className="text-sm text-neutral-light/70 mb-8 relative z-10 leading-relaxed font-medium">
                            Share your referral link with your network and earn level income and bonuses.
                        </p>
                        <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-inner">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-light/50">Your Referral ID</span>
                                <span className="text-sm font-black text-accent-gold tracking-widest">{stats.user.referralId}</span>
                            </div>
                            <div className="flex items-center gap-3 bg-black/20 rounded-xl p-3 overflow-hidden border border-white/5">
                                <p className="text-xs truncate flex-1 font-bold text-neutral-light/90">{referralLink}</p>
                                <button
                                    onClick={copyReferral}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-all active:scale-90 bg-white/5"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Level Progress & Investment Summary */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Investment & Profit Overview */}
                    <div className="bg-white p-8 rounded-2xl border border-border-light shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full translate-x-1/2 -translate-y-1/2 opacity-50" />

                        <div className="relative z-10">
                            <h3 className="text-lg font-bold text-gray-900 mb-8 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                Investment Overview
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Investment</p>
                                    <h4 className="text-3xl font-black text-primary tracking-tight">{formatCurrency(stats.investment.totalInvestment)}</h4>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Profit</p>
                                    <h4 className="text-3xl font-black text-accent-gold tracking-tight">{formatCurrency(stats.investment.totalProfit)}</h4>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Monthly Profit</p>
                                    <h4 className="text-3xl font-black text-gray-900 tracking-tight">{formatCurrency(stats.investment.monthlyProfit)}</h4>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Rate</p>
                                    <h4 className="text-3xl font-black text-blue-600 tracking-tight">
                                        {((stats.investment.profitRate || 0) * 100).toFixed(1)}% <span className="text-xs font-bold text-gray-400 ml-1">Phase {stats.investment.currentPhase || 1}</span>
                                    </h4>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-100 flex flex-wrap gap-6">
                                <div className="flex items-center gap-2">
                                    <div className={cn(
                                        "w-2 h-2 rounded-full",
                                        stats.investment.roiStatus === 'Growing' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                                    )} />
                                    <span className="text-sm font-bold text-gray-700">ROI Status: {stats.investment.roiStatus}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ExternalLink className="w-4 h-4 text-primary" />
                                    <button className="text-sm font-bold text-primary hover:underline">View History</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Levels & Achievements */}
                    <div className="bg-white rounded-2xl border border-border-light shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-accent-gold" />
                                Levels & Achievements
                            </h3>
                            <button className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                                View All <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-neutral-light/50">
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Lvl</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Rank</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Target (Cash/Prod)</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Reward</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Progress</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {stats.levels.map((level, index) => {
                                        const isAchieved = level.status === 'achieved';
                                        const isCurrent = isAchieved && (index === stats.levels.length - 1 || stats.levels[index + 1].status !== 'achieved');
                                        const isNext = !isAchieved && (index === 0 || stats.levels[index - 1].status === 'achieved');

                                        return (
                                            <tr key={level.no} className={cn(
                                                "hover:bg-neutral-light transition-colors group",
                                                isCurrent && "bg-emerald-50/50",
                                                isNext && "bg-primary/[0.02]"
                                            )}>
                                                <td className="px-6 py-4">
                                                    <span className={cn(
                                                        "text-sm font-bold transition-colors",
                                                        isAchieved ? "text-emerald-600" : "text-gray-400 group-hover:text-primary"
                                                    )}>{level.no}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-gray-900">{level.name}</span>
                                                        {isCurrent && (
                                                            <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-black rounded uppercase tracking-widest border border-emerald-200 shadow-sm animate-in fade-in zoom-in duration-500">
                                                                Current
                                                            </span>
                                                        )}
                                                        {isNext && (
                                                            <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[8px] font-black rounded uppercase tracking-widest border border-primary/20 shadow-sm animate-pulse">
                                                                Next Target
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Target className="w-3.5 h-3.5 text-gray-400" />
                                                        <span className="text-[11px] text-gray-600 font-bold">{level.criteria}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-accent-gold/10 text-accent-gold border border-accent-gold/20 italic">
                                                        {level.reward}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="w-full max-w-[100px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary transition-all duration-1000"
                                                            style={{ width: `${level.progress}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-[9px] font-black text-gray-400 uppercase mt-1 block">{Math.round(level.progress)}% Complete</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {level.status === 'achieved' ? (
                                                        <div className="flex flex-col items-end gap-1">
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                                Achieved
                                                            </span>
                                                            {level.claimStatus === 'not_claimed' && (
                                                                <button
                                                                    onClick={() => handleClaim(level.id, level.reward)}
                                                                    className="text-[10px] font-black text-primary hover:text-deep-green underline uppercase tracking-tighter"
                                                                >
                                                                    Claim Reward
                                                                </button>
                                                            )}
                                                            {level.claimStatus === 'pending' && (
                                                                <span className="text-[8px] font-black text-amber-600 uppercase tracking-tighter italic">Pending Approval</span>
                                                            )}
                                                            {level.claimStatus === 'approved' && (
                                                                <span className="text-[8px] font-black text-emerald-600 uppercase tracking-tighter italic">Reward Received</span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-500 border border-gray-200 opacity-60">
                                                            Locked
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
