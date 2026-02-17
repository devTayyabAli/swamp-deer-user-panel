import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeamMembers } from '../redux/slices/teamSlice';
import type { RootState, AppDispatch } from '../redux/store';
import { Users } from 'lucide-react';

interface TeamMember {
    _id: string;
    name: string;
    email: string;
    phone: string;
    amount: number;
    profit: number;
    date: string;
    upline: string;
    uplineId?: string;
    type: 'direct' | 'indirect';
}

interface MemberNodeProps {
    member: TeamMember;
    level: number;
}

const MemberNode: React.FC<MemberNodeProps> = ({ member, level }) => {
    return (
        <div className="relative group">
            {/* Member Box */}
            <div className="px-4 py-2 bg-gradient-to-br from-primary to-primary/80 text-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer min-w-[140px] text-center">
                <div className="font-bold text-sm truncate">{member.name}</div>
                <div className="text-[10px] opacity-80">Level {level}</div>
            </div>

            {/* Hover Tooltip */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 bg-card-bg border-2 border-primary/20 rounded-xl shadow-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="space-y-3">
                    {/* Header */}
                    <div className="border-b border-border-subtle pb-2">
                        <h3 className="font-bold text-text-main">{member.name}</h3>
                        <p className="text-xs text-text-muted">{member.email}</p>
                        <p className="text-xs text-text-muted">{member.phone}</p>
                    </div>

                    {/* Stats */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Investment</span>
                            <span className="text-sm font-black text-primary">Rs {member.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Level</span>
                            <span className="text-sm font-black text-text-main">{level}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Reward</span>
                            <span className="text-sm font-black text-emerald-600">Rs {member.profit.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Type</span>
                            <span className={`text-xs font-black uppercase px-2 py-0.5 rounded ${member.type === 'direct'
                                ? 'bg-emerald-500/10 text-emerald-600'
                                : 'bg-blue-500/10 text-blue-600'
                                }`}>
                                {member.type}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Joined</span>
                            <span className="text-xs font-medium text-text-muted">
                                {new Date(member.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tooltip Arrow */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-card-bg border-t-2 border-l-2 border-primary/20 rotate-45"></div>
            </div>
        </div>
    );
};

export default function Tree() {
    const dispatch = useDispatch<AppDispatch>();
    const { all, loading } = useSelector((state: RootState) => state.team);
    const { user } = useSelector((state: RootState) => state.auth);

    React.useEffect(() => {
        dispatch(fetchTeamMembers());
    }, [dispatch]);

    const MAX_LEVELS = 8; // Business plan supports only 8 levels

    // Organize members by level
    const organizeByLevels = () => {
        const levels: TeamMember[][] = [];
        const processed = new Set<string>();

        // Level 1: Direct members (children of current user)
        const level1 = all.filter(m => m.uplineId === user?._id);
        if (level1.length > 0) {
            levels.push(level1);
            level1.forEach(m => processed.add(m._id));
        }

        // Build subsequent levels (limited to MAX_LEVELS)
        let currentLevel = level1;
        while (currentLevel.length > 0 && levels.length < MAX_LEVELS) {
            const nextLevel: TeamMember[] = [];
            currentLevel.forEach(parent => {
                const children = all.filter(m => m.uplineId === parent._id && !processed.has(m._id));
                children.forEach(child => {
                    nextLevel.push(child);
                    processed.add(child._id);
                });
            });
            if (nextLevel.length > 0) {
                levels.push(nextLevel);
            }
            currentLevel = nextLevel;
        }

        return levels;
    };

    const levels = organizeByLevels();

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-main tracking-tight">Team Tree</h1>
                    <p className="text-text-muted">Visualize your referral network hierarchy level by level.</p>
                </div>
            </div>

            {/* Tree Container */}
            <div className="bg-gradient-to-br from-card-bg to-soft rounded-2xl border border-border-subtle shadow-sm p-8 overflow-x-auto">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                            <p className="text-sm font-bold text-text-muted">Loading team data...</p>
                        </div>
                    </div>
                ) : levels.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-20 text-text-muted">
                        <Users className="w-16 h-16 opacity-20" />
                        <p className="font-bold">No team members yet</p>
                        <p className="text-sm">Start building your network by referring new members.</p>
                    </div>
                ) : (
                    <div className="min-w-max">
                        {/* Root Node (Current User) */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="px-6 py-3 bg-gradient-to-br from-accent-gold to-warm-gold text-gray-900 rounded-xl shadow-xl font-black text-base">
                                {user?.name || 'You'}
                            </div>
                            <div className="text-xs font-bold text-text-muted mt-1 uppercase tracking-wider">Team Leader</div>
                        </div>

                        {/* Levels */}
                        {levels.map((levelMembers, levelIndex) => (
                            <div key={levelIndex} className="mb-12">
                                {/* Level Header */}
                                <div className="flex items-center justify-center mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-sm font-black text-primary">{levelIndex + 1}</span>
                                        </div>
                                        <span className="text-sm font-black text-text-muted uppercase tracking-widest">
                                            Level {levelIndex + 1}
                                        </span>
                                        <div className="px-2 py-0.5 bg-primary/10 rounded text-xs font-bold text-primary">
                                            {levelMembers.length} {levelMembers.length === 1 ? 'Member' : 'Members'}
                                        </div>
                                    </div>
                                </div>

                                {/* Connecting Line from Previous Level */}
                                {levelIndex > 0 && (
                                    <div className="flex justify-center mb-4">
                                        <div className="w-0.5 h-8 bg-gradient-to-b from-primary/40 to-primary/10"></div>
                                    </div>
                                )}

                                {/* Members Grid */}
                                <div className="flex justify-center">
                                    <div className="flex flex-wrap gap-6 justify-center max-w-6xl">
                                        {levelMembers.map((member) => (
                                            <div key={member._id} className="relative">
                                                {/* Connecting Line to Parent */}
                                                {levelIndex > 0 && (
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gradient-to-t from-primary/40 to-transparent"></div>
                                                )}
                                                <MemberNode member={member} level={levelIndex + 1} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
