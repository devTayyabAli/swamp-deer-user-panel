import React from 'react';
import { Users, Search, Filter, Calendar, Wallet } from 'lucide-react';
import { cn } from '../lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeamMembers } from '../redux/slices/teamSlice';
import type { RootState, AppDispatch } from '../redux/store';

type TeamType = 'direct' | 'indirect' | 'all';

export default function Team() {
    const [activeTab, setActiveTab] = React.useState<TeamType>('all');
    const [searchTerm, setSearchTerm] = React.useState('');
    const dispatch = useDispatch<AppDispatch>();
    const { direct, indirect, all, loading } = useSelector((state: RootState) => state.team);

    React.useEffect(() => {
        dispatch(fetchTeamMembers());
    }, [dispatch]);

    // Get the appropriate team list based on active tab
    const getTeamList = () => {
        if (activeTab === 'direct') return direct;
        if (activeTab === 'indirect') return indirect;
        return all;
    };

    const filteredMembers = getTeamList().filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-main tracking-tight">Team Management</h1>
                    <p className="text-text-muted">Manage your direct and indirect referral network.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-card-bg p-1 rounded-xl border border-border-subtle shadow-sm flex items-center gap-1 overflow-x-auto no-scrollbar self-start">
                <button
                    onClick={() => setActiveTab('all')}
                    className={cn(
                        "px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
                        activeTab === 'all'
                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                            : "text-text-muted hover:text-primary dark:hover:text-primary hover:bg-page-bg dark:hover:bg-white/5"
                    )}
                >
                    All Members
                </button>
                <button
                    onClick={() => setActiveTab('direct')}
                    className={cn(
                        "px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
                        activeTab === 'direct'
                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                            : "text-text-muted hover:text-primary dark:hover:text-primary hover:bg-neutral-light dark:hover:bg-white/5"
                    )}
                >
                    Direct Team
                </button>
                <button
                    onClick={() => setActiveTab('indirect')}
                    className={cn(
                        "px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
                        activeTab === 'indirect'
                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                            : "text-text-muted hover:text-primary dark:hover:text-primary hover:bg-neutral-light dark:hover:bg-white/5"
                    )}
                >
                    Indirect Team
                </button>
            </div>

            {/* Search & Filters */}
            <div className="bg-card-bg p-4 rounded-2xl border border-border-subtle shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted/60" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-soft border border-border-subtle rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-text-main placeholder:text-text-muted/50"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-text-muted dark:text-gray-300 bg-soft rounded-xl hover:bg-soft/70 transition-colors">
                    <Filter className="w-4 h-4" />
                    Filter
                </button>
            </div>

            {/* Team Table */}
            <div className="bg-card-bg rounded-2xl border border-border-subtle shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-soft/50 border-b border-border-subtle">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider whitespace-nowrap">Member Details</th>
                                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider whitespace-nowrap">Sale Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider whitespace-nowrap">Join Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider whitespace-nowrap">Upline</th>
                                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider whitespace-nowrap">Profit Earned</th>
                                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Type</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle">
                            {filteredMembers.map((member) => (
                                <tr key={member._id} className="hover:bg-soft/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary-light font-bold">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-text-main">{member.name}</div>
                                                <div className="text-xs text-text-muted">{member.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-sm font-bold text-text-main">
                                            <Wallet className="w-4 h-4 text-emerald-500" />
                                            Rs {member.amount.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-text-muted font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4 text-text-muted" />
                                            {new Date(member.date).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold text-text-main opacity-80">{member.upline}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-primary">Rs {member.profit}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {member.type === 'direct' ? (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/30">
                                                Direct
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 dark:border-blue-500/30">
                                                Indirect
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredMembers.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3 text-text-muted">
                                            <Users className="w-12 h-12 opacity-20" />
                                            <p className="font-bold">No members found matching your criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 bg-soft/30 border-t border-border-subtle flex items-center justify-between">
                    <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Showing {filteredMembers.length} Members</span>
                    <div className="flex gap-2">
                        <button disabled className="px-3 py-1 rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-text-muted/60 text-xs font-bold disabled:opacity-50 transition-colors">Prev</button>
                        <button disabled className="px-3 py-1 rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-text-muted/60 text-xs font-bold disabled:opacity-50 transition-colors">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
