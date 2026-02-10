import React, { useEffect, useState } from 'react';
import { Wallet, ArrowDownCircle, Calendar, CheckCircle, Clock, Landmark, Banknote } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { cn } from '../lib/utils';
import type { RootState, AppDispatch } from '../redux/store';
import { fetchBalance, fetchWithdrawalHistory, submitWithdrawalRequest } from '../redux/slices/withdrawalSlice';

export default function Withdrawal() {
    const dispatch = useDispatch<AppDispatch>();
    const { balance, history, loading } = useSelector((state: RootState) => state.withdrawal);

    const [activeTab, setActiveTab] = useState<'request' | 'history'>('request');
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState<'USDT' | 'BANK'>('USDT');

    useEffect(() => {
        dispatch(fetchBalance());
        dispatch(fetchWithdrawalHistory());
    }, [dispatch]);

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();

        const withdrawAmount = parseFloat(amount);

        if (isNaN(withdrawAmount) || withdrawAmount < 50) {
            toast.error('Minimum withdrawal amount is $50');
            return;
        }

        if (withdrawAmount > balance) {
            toast.error('Insufficient balance');
            return;
        }

        const toastId = toast.loading('Processing withdrawal request...');
        try {
            await dispatch(submitWithdrawalRequest(withdrawAmount)).unwrap();
            toast.success('Withdrawal request submitted successfully!', { id: toastId });
            setAmount('');
            setActiveTab('history');
        } catch (error: any) {
            toast.error(error || 'Failed to submit withdrawal request', { id: toastId });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Withdrawal</h1>
                    <p className="text-gray-500">Access your earnings and manage withdrawal requests.</p>
                </div>
                <div className="bg-white p-1 rounded-xl border border-border-light flex items-center gap-1 overflow-x-auto no-scrollbar shadow-sm">
                    <button
                        onClick={() => setActiveTab('request')}
                        className={cn(
                            "px-6 py-2.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap",
                            activeTab === 'request' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-500 hover:text-primary hover:bg-neutral-light"
                        )}
                    >
                        Request
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={cn(
                            "px-6 py-2.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap",
                            activeTab === 'history' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-500 hover:text-primary hover:bg-neutral-light"
                        )}
                    >
                        History
                    </button>
                </div>
            </div>

            {activeTab === 'request' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8 animate-in slide-in-from-left-4 duration-500">
                        {/* Balance Card */}
                        <div className="bg-primary p-6 sm:p-10 rounded-[24px] sm:rounded-[32px] text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 p-8 sm:p-12 opacity-10">
                                <Wallet className="w-32 h-32 sm:w-48 sm:h-48" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4 opacity-80">
                                    <Wallet className="w-5 h-5" />
                                    <span className="text-xs font-black uppercase tracking-[0.2em]">Available Balance</span>
                                </div>
                                <div className="flex items-baseline gap-2 mb-10">
                                    <span className="text-2xl sm:text-3xl font-bold opacity-60">Rs</span>
                                    <h2 className="text-5xl sm:text-7xl font-black tracking-tighter leading-none">{balance.toLocaleString()}</h2>
                                </div>

                                <div className="flex flex-wrap gap-3 sm:gap-4">
                                    <div className="px-5 py-3 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md shadow-inner">
                                        <p className="text-[10px] sm:text-[11px] font-black opacity-60 uppercase tracking-widest mb-1">Min. Withdrawal</p>
                                        <p className="text-base sm:text-lg font-black">Rs 50.00</p>
                                    </div>
                                    <div className="px-5 py-3 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md shadow-inner">
                                        <p className="text-[10px] sm:text-[11px] font-black opacity-60 uppercase tracking-widest mb-1">Processing Time</p>
                                        <p className="text-base sm:text-lg font-black whitespace-nowrap">24-48 Hours</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Request Form */}
                        <div className="bg-white p-8 rounded-2xl border border-border-light shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Request Withdrawal</h3>
                            <form onSubmit={handleWithdraw} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Withdrawal Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rs</span>
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3.5 bg-neutral-light border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-bold text-lg"
                                            required
                                            min="50"
                                            step="0.01"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 italic font-medium">Fee: 5% Gross withdrawal amount will be deducted.</p>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-gray-700">Withdrawal Method</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div
                                            onClick={() => setMethod('USDT')}
                                            className={cn(
                                                "p-4 rounded-2xl relative cursor-pointer transition-all border-2",
                                                method === 'USDT' ? "bg-primary/5 border-primary ring-2 ring-primary/10" : "bg-white border-gray-100 hover:border-gray-200"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center mb-4",
                                                method === 'USDT' ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
                                            )}>
                                                <Banknote className="w-6 h-6" />
                                            </div>
                                            <h4 className={cn("font-bold mb-1 text-sm", method === 'USDT' ? "text-primary" : "text-gray-900")}>Cash hand over</h4>
                                            <p className={cn("text-xs font-medium", method === 'USDT' ? "text-primary/60" : "text-gray-500")}>Cash hand over</p>
                                            {method === 'USDT' && (
                                                <div className="absolute top-4 right-4 text-primary">
                                                    <CheckCircle className="w-5 h-5 fill-primary text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div
                                            onClick={() => setMethod('BANK')}
                                            className={cn(
                                                "p-4 rounded-2xl relative cursor-pointer transition-all border-2",
                                                method === 'BANK' ? "bg-primary/5 border-primary ring-2 ring-primary/10" : "bg-white border-gray-100 hover:border-gray-200"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center mb-4",
                                                method === 'BANK' ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
                                            )}>
                                                <Landmark className="w-6 h-6" />
                                            </div>
                                            <h4 className={cn("font-bold mb-1 text-sm", method === 'BANK' ? "text-primary" : "text-gray-900")}>Bank Transfer</h4>
                                            <p className={cn("text-xs font-medium", method === 'BANK' ? "text-primary/60" : "text-gray-500")}>Internal Review Req.</p>
                                            {method === 'BANK' && (
                                                <div className="absolute top-4 right-4 text-primary">
                                                    <CheckCircle className="w-5 h-5 fill-primary text-white" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !amount}
                                    className="w-full py-4 bg-primary text-white font-black rounded-xl hover:bg-deep-green shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Submit Request
                                            <ArrowDownCircle className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                        <div className="bg-accent-gold/5 p-6 rounded-2xl border border-accent-gold/10">
                            <h4 className="text-sm font-bold text-accent-gold uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Important Notes
                            </h4>
                            <ul className="space-y-3">
                                <li className="flex gap-3 text-xs font-medium text-gray-600 leading-relaxed">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent-gold shrink-0 mt-1" />
                                    Withdrawals are processed within 24 to 48 working hours.
                                </li>
                                <li className="flex gap-3 text-xs font-medium text-gray-600 leading-relaxed">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent-gold shrink-0 mt-1" />
                                    Maximum 5% service charge applies to all methods.
                                </li>
                                <li className="flex gap-3 text-xs font-medium text-gray-600 leading-relaxed">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent-gold shrink-0 mt-1" />
                                    Ensure your wallet addresses are correct before submitting.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-border-light shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-light/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Request Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Transaction Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {history.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-medium">
                                            No withdrawal history found.
                                        </td>
                                    </tr>
                                ) : (
                                    history.map((item) => (
                                        <tr key={item._id} className="hover:bg-neutral-light/50 transition-colors group text-sm">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-gray-900 font-bold">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-black text-gray-900">Rs {item.amount.toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.status === 'completed' || item.status === 'approved' ? (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Success
                                                    </span>
                                                ) : item.status === 'rejected' ? (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-100 text-red-700 border border-red-200">
                                                        <Clock className="w-3 h-3" />
                                                        Rejected
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 border border-amber-200">
                                                        <Clock className="w-3 h-3" />
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {item.txId ? (
                                                    <code className="text-[10px] font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">{item.txId}</code>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">Processing...</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

