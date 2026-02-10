import React, { useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import type { RootState } from '../redux/store';
import {
    LayoutDashboard,
    Wallet,
    TrendingUp,
    Users,
    History,
    UserCircle,
    LogOut,
    Menu,
    X,
    Search,
    Gift
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Team', href: '/team', icon: Users },
    { name: 'Investment', href: '/investment', icon: TrendingUp },
    { name: 'Income', href: '/income', icon: Wallet },
    { name: 'Rewards', href: '/rewards', icon: Gift },
    { name: 'Withdrawal', href: '/withdrawal', icon: History },
    { name: 'Profile', href: '/profile', icon: UserCircle },
];

export default function UserLayout() {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleLogout = () => {
        dispatch(logout());
        toast.success('Logged out successfully');
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-neutral-light">
            {/* Mobile/Tablet Sidebar Drawer */}
            <div
                className={cn(
                    "fixed inset-0 z-50 lg:hidden transition-opacity duration-300",
                    sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
            >
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />

                {/* Drawer Content */}
                <div
                    className={cn(
                        "fixed inset-y-0 left-0 flex w-[280px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out transform",
                        sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    <div className="flex items-center justify-between px-6 h-20 border-b border-border-light bg-swamp-deer text-white">
                        <span className="text-xl font-black tracking-tighter">SWAMP DEER</span>
                    </div>

                    <div className="flex-1 overflow-y-auto pt-6 px-4 pb-20">
                        <nav className="space-y-1.5">
                            {navigation.map((item) => {
                                const isActive = location.pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={cn(
                                            "flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                                            isActive
                                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                                : "text-gray-600 hover:bg-neutral-light hover:text-primary"
                                        )}
                                    >
                                        <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-400")} />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Mobile Drawer Footer */}
                    <div className="p-4 border-t border-border-light bg-neutral-light/30">
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full gap-4 px-4 py-3 text-sm font-bold text-red-600 transition-all rounded-xl hover:bg-red-50 active:scale-[0.98]"
                        >
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            {/* Static sidebar for desktop */}
            <div className={cn(
                "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300 ease-in-out border-r border-border-light bg-white shadow-xl shadow-gray-200/20",
                sidebarOpen ? "w-72" : "w-20"
            )}>
                <div className="flex flex-col flex-1 min-h-0">
                    <div className={cn(
                        "flex items-center h-20 px-6 border-b border-border-light transition-all duration-300 overflow-hidden",
                        sidebarOpen ? "bg-swamp-deer text-white justify-between" : "bg-white text-primary justify-center px-0"
                    )}>
                        <div className={cn(
                            "flex items-center gap-3 transition-opacity duration-300",
                            !sidebarOpen && "hidden"
                        )}>
                            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                                <Search className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xl font-black tracking-tighter whitespace-nowrap">SWAMP DEER</span>
                        </div>
                        {!sidebarOpen && (
                            <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary font-black shadow-sm">
                                SD
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col flex-1 pt-6 pb-4 overflow-y-auto px-3 overflow-x-hidden">
                        <nav className="flex-1 space-y-2">
                            {navigation.map((item) => {
                                const isActive = location.pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={cn(
                                            "flex items-center rounded-xl text-sm font-bold transition-all group relative overflow-hidden",
                                            sidebarOpen ? "px-4 py-3 gap-4" : "justify-center aspect-square",
                                            isActive
                                                ? "bg-primary text-white shadow-lg shadow-primary/25"
                                                : "text-gray-500 hover:bg-neutral-light hover:text-primary"
                                        )}
                                    >
                                        <item.icon className={cn(
                                            "w-6 h-6 shrink-0 transition-transform duration-300",
                                            isActive ? "scale-110" : "group-hover:scale-110"
                                        )} />
                                        <span className={cn(
                                            "transition-all duration-300 whitespace-nowrap",
                                            sidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 absolute -translate-x-10 pointer-events-none"
                                        )}>
                                            {item.name}
                                        </span>
                                        {!sidebarOpen && (
                                            <div className="absolute left-full ml-6 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl">
                                                {item.name}
                                            </div>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="p-3 border-t border-border-light bg-neutral-light/10">
                        <button
                            onClick={handleLogout}
                            className={cn(
                                "flex items-center w-full transition-all rounded-xl font-bold text-red-600 hover:bg-red-50",
                                sidebarOpen ? "px-4 py-3 gap-4 text-sm" : "justify-center aspect-square"
                            )}
                        >
                            <LogOut className="w-5 h-5 shrink-0" />
                            <span className={cn(
                                "transition-all duration-300 whitespace-nowrap",
                                sidebarOpen ? "opacity-100" : "opacity-0 absolute -translate-x-10 pointer-events-none"
                            )}>
                                Sign Out
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content area */}
            <div className={cn(
                "flex flex-col min-h-screen transition-all duration-300 ease-in-out",
                sidebarOpen ? "lg:pl-72" : "lg:pl-20"
            )}>
                <header className="sticky top-0 z-40 flex items-center justify-between h-20 px-4 bg-white/80 backdrop-blur-md border-b border-border-light lg:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            className="p-2 -ml-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all flex items-center gap-2 group border border-transparent hover:border-primary/10"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <div className="relative">
                                <Menu className={cn(
                                    "w-6 h-6 transition-all duration-300",
                                    sidebarOpen ? "rotate-90 opacity-0 scale-0" : "rotate-0 opacity-100 scale-100"
                                )} />
                                <X className={cn(
                                    "w-6 h-6 absolute top-0 left-0 transition-all duration-300",
                                    sidebarOpen ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-0"
                                )} />
                            </div>
                            <span className={cn(
                                "text-[10px] font-black uppercase tracking-widest hidden sm:block overflow-hidden transition-all duration-300",
                                sidebarOpen ? "w-0 opacity-0" : "w-12 opacity-100 ml-1"
                            )}>
                                Mini
                            </span>
                        </button>
                        <h2 className="hidden sm:block text-lg font-bold text-gray-900 capitalize tracking-tight">
                            {location.pathname.split('/')[1] || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden xs:flex flex-col items-end">
                            <span className="text-sm font-bold text-gray-900 leading-none mb-1">{user?.name}</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-1.5 py-0.5 rounded">ID: {user?.userName}</span>
                        </div>
                        <div className="flex items-center justify-center w-10 h-10 border-2 rounded-xl border-accent-gold/20 bg-accent-gold/5 shadow-inner">
                            <UserCircle className="w-6 h-6 text-accent-gold" />
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 lg:p-8">
                    <div className="mx-auto max-w-7xl">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
