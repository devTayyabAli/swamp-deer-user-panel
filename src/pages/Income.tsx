
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
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Earnings & Profit</h1>
                    <p className="text-gray-500">Track your referral income and investment ROI.</p>
                </div>
                <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-border-light">
                    <button
                        onClick={() => setActiveSubTab('summary')}
                        className={cn(
                            "px-4 py-2 text-sm font-bold rounded-lg transition-all",
                            activeSubTab === 'summary' ? "bg-primary text-white" : "text-gray-500 hover:text-primary"
                        )}
                    >
                        Profit Summary
                    </button>
                    <button
                        onClick={() => setActiveSubTab('levels')}
                        className={cn(
                            "px-4 py-2 text-sm font-bold rounded-lg transition-all",
                            activeSubTab === 'levels' ? "bg-primary text-white" : "text-gray-500 hover:text-primary"
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
                            <div key={item.label} className="bg-white p-8 rounded-2xl border border-border-light shadow-sm flex items-center gap-6">
                                <div className={cn("p-4 rounded-2xl", item.bg)}>
                                    <item.icon className={cn("w-8 h-8", item.color)} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Rs {item.value.toLocaleString()}</h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-border-light shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <PieChart className="w-5 h-5 text-primary" />
                            Total Earnings Breakdown
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-4xl font-black text-gray-900">Rs {summary.total.toLocaleString()}</span>
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                    Live Data
                                </div>
                            </div>

                            <div className="w-full h-3 bg-gray-100 rounded-full flex overflow-hidden">
                                <div className="h-full bg-accent-gold" style={{ width: `${stakingPercent}% ` }} />
                                <div className="h-full bg-primary" style={{ width: `${levelPercent}% ` }} />
                                <div className="h-full bg-blue-500" style={{ width: `${referralPercent}% ` }} />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-accent-gold" />
                                    <span className="text-sm font-bold text-gray-600">Staking ({stakingPercent}%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-primary" />
                                    <span className="text-sm font-bold text-gray-600">Level ({levelPercent}%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                                    <span className="text-sm font-bold text-gray-600">Referral ({referralPercent}%)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Filters & Total */}
                    <div className="bg-white p-6 rounded-2xl border border-border-light shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <div className="flex items-center gap-1.5">
                                    <Filter className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm font-bold text-gray-500">Filters:</span>
                                </div>
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                                >
                                    <option value="">All Types</option>
                                    <option value="level_income">Level Income</option>
                                    <option value="staking">Staking Bonus</option>
                                    <option value="direct_income">Referral Bonus</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                                <span className="text-gray-400">-</span>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                            <span className="text-sm font-bold text-emerald-800 uppercase tracking-widest">Total Filtered:</span>
                            <span className="text-xl font-black text-emerald-600">Rs {(filteredTotal || 0).toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-border-light shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-neutral-light/50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type / Source</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Income Amount</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date Earned</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {items.map((reward, idx) => (
                                        <tr key={idx} className="hover:bg-neutral-light/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-bold text-sm border border-primary/10 capitalize">
                                                        {reward.type ? reward.type.charAt(0) : 'R'}
                                                    </div>
                                                    <div>
                                                        <span className="block text-sm font-bold text-gray-900 capitalize mb-0.5">
                                                            {reward.type ? reward.type.replace('_', ' ') : 'Reward'}
                                                        </span>
                                                        {reward.stakeId?.user && (
                                                            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                                                <User className="w-3 h-3" />
                                                                from {reward.stakeId.user.name} ({reward.stakeId.user.userName || 'Unknown'})
                                                            </div>
                                                        )}
                                                        {reward.productStatus && (
                                                            <span className="text-[10px] text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded ml-1 border border-blue-100 capitalize">
                                                                {reward.productStatus.replace('_', ' ')}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-black text-emerald-600">+Rs {reward.amount.toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(reward.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                    Processed
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {items.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-medium">
                                                No reward records found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        {items.length > 0 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                                <p className="text-sm text-gray-500">
                                    Showing {items.length} of {total} records
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 1 || loading}
                                        className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <span className="text-sm font-bold text-gray-700">
                                        Page {page} of {pages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={page === pages || loading}
                                        className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronRight className="w-5 h-5 text-gray-600" />
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
