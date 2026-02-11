
import React from 'react';
import { Wallet, PieChart, TrendingUp, DollarSign, Calendar, ArrowUpRight, ChevronLeft, ChevronRight, Filter, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRewardSummary, fetchRewards } from '../redux/slices/rewardsSlice';
import type { RootState, AppDispatch } from '../redux/store';

export default function Income() {
    const [activeSubTab, setActiveSubTab] = React.useState<'summary' | 'levels'>('summary');
    const dispatch = useDispatch<AppDispatch>();
    const { summary, items, loading, page, pages, total, filteredTotal } = useSelector((state: RootState) => state.rewards);

    // Filters
    const [startDate, setStartDate] = React.useState('');
    const [endDate, setEndDate] = React.useState('');
    const [filterType, setFilterType] = React.useState('');

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pages) {
            dispatch(fetchRewards({
                page: newPage,
                startDate,
                endDate,
                type: filterType || undefined
            }));
        }
    };

    React.useEffect(() => {
        dispatch(fetchRewardSummary());
    }, [dispatch]);

    React.useEffect(() => {
        if (activeSubTab === 'levels') {
            dispatch(fetchRewards({
                page: 1,
                startDate,
                endDate,
                type: filterType || undefined
            }));
        }
    }, [activeSubTab, startDate, endDate, filterType, dispatch]);

    const profitSummary = [
        { label: 'Level Income', value: summary.level, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Referral Income', value: summary.referral, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Staking Income', value: summary.staking, icon: Wallet, color: 'text-accent-gold', bg: 'bg-accent-gold/5' },
    ];

    const stakingPercent = summary.total > 0 ? Math.round((summary.staking / summary.total) * 100) : 0;
    const levelPercent = summary.total > 0 ? Math.round((summary.level / summary.total) * 100) : 0;
    const referralPercent = summary.total > 0 ? Math.max(0, 100 - stakingPercent - levelPercent) : 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-main tracking-tight">Earnings & Profit</h1>
                    <p className="text-text-muted">Track your referral income and investment ROI.</p>
                </div>
                <div className="flex items-center gap-2 bg-card-bg p-1 rounded-xl border border-border-subtle transition-colors">
                    <button
                        onClick={() => setActiveSubTab('summary')}
                        className={cn(
                            "px-4 py-2 text-sm font-bold rounded-lg transition-all",
                            activeSubTab === 'summary' ? "bg-primary text-white" : "text-text-muted hover:text-primary dark:hover:text-primary"
                        )}
                    >
                        Profit Summary
                    </button>
                    <button
                        onClick={() => setActiveSubTab('levels')}
                        className={cn(
                            "px-4 py-2 text-sm font-bold rounded-lg transition-all",
                            activeSubTab === 'levels' ? "bg-primary text-white" : "text-text-muted hover:text-primary dark:hover:text-primary"
                        )}
                    >
                        Level Income
                    </button>
                </div>
            </div>

            {activeSubTab === 'summary' ? (
                <div className="space-y-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {profitSummary.map((item) => (
                            <div key={item.label} className="bg-card-bg p-8 rounded-2xl border border-border-subtle shadow-sm flex items-center gap-6">
                                <div className={cn("p-4 rounded-2xl", item.bg, "dark:bg-opacity-10")}>
                                    <item.icon className={cn("w-8 h-8", item.color)} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-text-muted/60 uppercase tracking-widest mb-1">{item.label}</p>
                                    <h3 className="text-2xl font-black text-text-main tracking-tight">Rs {item.value.toLocaleString()}</h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-card-bg p-8 rounded-2xl border border-border-light dark:border-white/5 shadow-sm">
                        <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
                            <PieChart className="w-5 h-5 text-primary" />
                            Total Earnings Breakdown
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-4xl font-black text-text-main">Rs {summary.total.toLocaleString()}</span>
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold border border-emerald-200 dark:border-emerald-800/50">
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                    Live Data
                                </div>
                            </div>

                            <div className="w-full h-3 bg-soft rounded-full flex overflow-hidden">
                                <div className="h-full bg-accent-gold" style={{ width: `${stakingPercent}% ` }} />
                                <div className="h-full bg-primary" style={{ width: `${levelPercent}% ` }} />
                                <div className="h-full bg-blue-500" style={{ width: `${referralPercent}% ` }} />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-accent-gold" />
                                    <span className="text-sm font-bold text-text-muted">Staking ({stakingPercent}%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-primary" />
                                    <span className="text-sm font-bold text-text-muted">Level ({levelPercent}%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                                    <span className="text-sm font-bold text-text-muted">Referral ({referralPercent}%)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Filters & Total */}
                    <div className="bg-card-bg p-6 rounded-2xl border border-border-subtle shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <div className="flex items-center gap-1.5">
                                    <Filter className="w-4 h-4 text-text-muted/60" />
                                    <span className="text-sm font-bold text-text-muted">Filters:</span>
                                </div>
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="px-3 py-2 rounded-lg border border-border-subtle bg-soft text-sm font-bold text-text-main focus:ring-2 focus:ring-primary/20 outline-none dark:[color-scheme:dark]"
                                >
                                    <option value="" className="dark:bg-dark-surface">All Types</option>
                                    <option value="level_income" className="dark:bg-dark-surface">Level Income</option>
                                    <option value="staking" className="dark:bg-dark-surface">Staking Bonus</option>
                                    <option value="direct_income" className="dark:bg-dark-surface">Referral Bonus</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="px-3 py-2 rounded-lg border border-border-subtle bg-soft text-sm font-bold text-text-main focus:ring-2 focus:ring-primary/20 outline-none dark:[color-scheme:dark]"
                                />
                                <span className="text-text-muted">-</span>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="px-3 py-2 rounded-lg border border-border-subtle bg-soft text-sm font-bold text-text-main focus:ring-2 focus:ring-primary/20 outline-none dark:[color-scheme:dark]"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-emerald-50 dark:bg-emerald-950/20 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
                            <span className="text-sm font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest">Total Filtered:</span>
                            <span className="text-xl font-black text-emerald-600 dark:text-emerald-500">Rs {(filteredTotal || 0).toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="bg-card-bg rounded-2xl border border-border-subtle shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-soft/50 border-b border-border-subtle">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Type / Source</th>
                                        <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Income Amount</th>
                                        <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Date Earned</th>
                                        <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-subtle">
                                    {items.map((reward, idx) => (
                                        <tr key={idx} className="hover:bg-soft/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-primary/5 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary-light font-bold text-sm border border-primary/10 capitalize">
                                                        {reward.type ? reward.type.charAt(0) : 'R'}
                                                    </div>
                                                    <div>
                                                        <span className="block text-sm font-bold text-text-main capitalize mb-0.5">
                                                            {reward.type ? reward.type.replace('_', ' ') : 'Reward'}
                                                        </span>
                                                        {reward.stakeId?.user && (
                                                            <div className="flex items-center gap-1.5 text-xs text-text-muted font-medium">
                                                                <User className="w-3 h-3" />
                                                                from {reward.stakeId.user.name} ({reward.stakeId.user.userName || 'Unknown'})
                                                            </div>
                                                        )}
                                                        {reward.stakeId?.productStatus && (
                                                            <span className={cn(
                                                                "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border ml-2",
                                                                reward.stakeId.productStatus === 'with_product'
                                                                    ? "bg-primary/10 text-primary border-primary/20"
                                                                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                                            )}>
                                                                {reward.stakeId.productStatus.replace('_', ' ')}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-black text-emerald-600 dark:text-emerald-500">+Rs {reward.amount.toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-sm text-text-muted font-medium">
                                                    <Calendar className="w-4 h-4 dark:text-text-muted" />
                                                    {new Date(reward.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/30">
                                                    Processed
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {items.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-text-muted font-medium">
                                                No reward records found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        {items.length > 0 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-border-subtle bg-soft/50">
                                <p className="text-sm text-text-muted">
                                    Showing {items.length} of {total} records
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 1 || loading}
                                        className="p-2 rounded-lg hover:bg-soft border border-transparent hover:border-border-subtle disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronLeft className="w-5 h-5 text-text-muted" />
                                    </button>
                                    <span className="text-sm font-bold text-text-main/80">
                                        Page {page} of {pages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={page === pages || loading}
                                        className="p-2 rounded-lg hover:bg-soft border border-transparent hover:border-border-subtle disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronRight className="w-5 h-5 text-text-muted" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
