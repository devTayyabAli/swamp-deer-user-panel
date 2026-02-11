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
    UserCircle,
    LogOut,
    Menu,
    X,
    Gift,
    ArrowDownToLine,
    Sun,
    Moon
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';
import { useTheme } from '../context/ThemeContext';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Team', href: '/team', icon: Users },
    { name: 'Investment', href: '/investment', icon: TrendingUp },
    { name: 'Income', href: '/income', icon: Wallet },
    { name: 'Rewards', href: '/rewards', icon: Gift },
    { name: 'Withdrawal', href: '/withdrawal', icon: ArrowDownToLine },
    { name: 'Profile', href: '/profile', icon: UserCircle },
];

export default function UserLayout() {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const { theme, toggleTheme } = useTheme();

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
        <div className="min-h-screen bg-page-bg transition-colors duration-300">
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
                        "fixed inset-y-0 left-0 flex w-[280px] flex-col bg-card-bg shadow-2xl transition-transform duration-300 ease-in-out transform border-r border-border-subtle",
                        sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    <div className="flex items-center gap-3 px-6 h-20 border-b border-border-subtle bg-swamp-deer">
                        <img src="/favicon.png" alt="Swamp Deer Logo" className="h-8 w-auto" />
                        <span className="text-xl font-black tracking-tighter text-white">SWAMP DEER</span>
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
                                                : "text-text-muted hover:bg-soft hover:text-primary dark:hover:text-primary"
                                        )}
                                    >
                                        <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-text-muted")} />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Mobile Drawer Footer */}
                    <div className="p-4 border-t border-border-subtle bg-page-bg/50">
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full gap-4 px-4 py-3 text-sm font-bold text-red-600 transition-all rounded-xl hover:bg-red-500/10 active:scale-[0.98]"
                        >
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            {/* Static sidebar for desktop */}
            <div className={cn(
                "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300 ease-in-out border-r border-border-subtle bg-card-bg shadow-xl shadow-gray-200/20 dark:shadow-none",
                sidebarOpen ? "w-72" : "w-20"
            )}>
                <div className="flex flex-col flex-1 min-h-0">
                    <div className={cn(
                        "flex items-center h-20 px-6 border-b border-border-subtle transition-all duration-300 overflow-hidden",
                        sidebarOpen ? "bg-swamp-deer text-white justify-between" : "bg-card-bg text-primary justify-center px-0"
                    )}>
                        <div className={cn(
                            "flex items-center gap-3 transition-opacity duration-300",
                            !sidebarOpen && "hidden"
                        )}>
                            <img src="/favicon.png" alt="Swamp Deer Logo" className="h-8 w-auto" />
                            <span className="text-xl font-black tracking-tighter whitespace-nowrap">SWAMP DEER</span>
                        </div>
                        {!sidebarOpen && (
                            <img src="/favicon.png" alt="Swamp Deer Logo" className="w-10 h-10 object-contain" />
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
                                                : "text-text-muted hover:bg-soft hover:text-primary dark:hover:text-primary"
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

                    <div className="p-3 border-t border-border-subtle bg-page-bg/20">
                        <button
                            onClick={handleLogout}
                            className={cn(
                                "flex items-center w-full transition-all rounded-xl font-bold text-red-600 hover:bg-red-500/10",
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
                <header className="sticky top-0 z-40 flex items-center justify-between h-20 px-4 bg-card-bg/80 backdrop-blur-md border-b border-border-subtle lg:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            className="p-2 -ml-2 text-text-muted/60 hover:text-primary hover:bg-soft rounded-xl transition-all flex items-center gap-2 group border border-transparent hover:border-primary/10"
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
                        <h2 className="hidden sm:block text-lg font-bold text-text-main capitalize tracking-tight">
                            {location.pathname.split('/')[1] || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 text-text-muted hover:text-primary hover:bg-soft rounded-xl transition-all border border-transparent hover:border-primary/10 active:scale-95"
                            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                        >
                            {theme === 'light' ? (
                                <Moon className="w-5 h-5" />
                            ) : (
                                <Sun className="w-5 h-5 text-accent-gold" />
                            )}
                        </button>

                        <div className="hidden xs:flex flex-col items-end">
                            <span className="text-sm font-bold text-text-main leading-none mb-1">{user?.name}</span>
                            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest bg-page-bg px-1.5 py-0.5 rounded border border-border-subtle">ID: {user?.userName}</span>
                        </div>
                        <Link
                            to="/profile"
                            className="flex items-center justify-center w-10 h-10 border-2 rounded-xl border-accent-gold/20 bg-accent-gold/5 shadow-inner overflow-hidden hover:border-accent-gold/40 transition-all active:scale-95"
                        >
                            {user?.profilePic ? (
                                <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <UserCircle className="w-6 h-6 text-accent-gold" />
                            )}
                        </Link>
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
