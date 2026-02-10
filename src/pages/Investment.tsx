import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { createSale, getSales, resetSalesState } from '../redux/slices/salesSlice';
import type { RootState, AppDispatch } from '../redux/store';
import { cn } from '../lib/utils';

const Investment = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);
    const { sales, loading, success, error } = useSelector((state: RootState) => state.sales);

    const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
    const [successInvestment, setSuccessInvestment] = useState<{ id: string } | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            description: '',
            investorType: 'With Product',
            investorProfit: 0.05,
            amount: 0,
            commissionRate: 0.05,
            paymentMethod: 'Cash in hand',
        },
    });

    const amount = watch('amount') || 0;
    const commissionRate = watch('commissionRate');
    const calculatedCommission = Math.round(amount * (commissionRate || 0));

    useEffect(() => {
        if (activeTab === 'history') {
            dispatch(getSales({}));
        }
    }, [activeTab, dispatch]);

    useEffect(() => {
        if (success) {
            toast.success('Investment submitted successfully!');
            setSuccessInvestment({ id: 'NEW' });
            dispatch(resetSalesState());
            reset();
        }
        if (error) {
            toast.error(error);
            dispatch(resetSalesState());
        }
    }, [success, error, dispatch, reset]);

    const onSubmit = async (data: any) => {
        if (!user) {
            toast.error('You must be logged in to invest.');
            return;
        }

        const saleData = {
            description: data.description,
            amount: Number(data.amount),
            commission: Math.round(data.amount * data.commissionRate),
            investorProfit: Number(data.investorProfit),
            paymentMethod: data.paymentMethod,
            productStatus: data.investorType === 'With Product' ? 'with_product' : 'without_product'
        };

        dispatch(createSale(saleData));
    };

    if (successInvestment) {
        return (
            <div className="max-w-[520px] w-full mx-auto py-12 sm:py-24 px-4 sm:px-6 animate-in fade-in zoom-in duration-700 font-display">
                <div className="bg-white rounded-[32px] shadow-[0_25px_60px_-15px_rgba(0,104,32,0.12)] border border-[#dbe6df]/40 overflow-hidden text-center p-8 sm:p-14 relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#006820]/40 to-transparent"></div>
                    <div className="size-20 bg-[#f0f7f2] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <span className="material-symbols-outlined text-[#006820] text-4xl font-black">check_circle</span>
                    </div>
                    <h1 className="text-[#111813] text-2xl sm:text-3xl font-black mb-4 tracking-tight leading-[1.1]">Investment Successful!</h1>
                    <p className="text-[#61896f] text-sm sm:text-[15px] font-medium mb-12 leading-relaxed px-2">
                        Your investment has been recorded and is currently pending admin approval. You can track its status in the history tab.
                    </p>
                    <div className="space-y-4">
                        <button
                            onClick={() => {
                                setSuccessInvestment(null);
                                setActiveTab('history');
                            }}
                            className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#006820] hover:bg-black text-white text-sm sm:text-[15px] font-black transition-all shadow-xl shadow-[#006820]/15 active:scale-[0.98]"
                        >
                            <span className="material-symbols-outlined text-xl">history</span>
                            View History
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border-2 border-[#f0f4f2] text-[#4a5f52] text-sm sm:text-[15px] font-bold hover:bg-[#fbfcfa] hover:border-[#dbe6df] transition-all active:scale-[0.98]"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700 font-display">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Investment Management</h1>
                    <p className="text-sm sm:text-base text-gray-500 font-medium">Invest and track your financial growth.</p>
                </div>
                <div className="bg-white p-1 rounded-xl border border-border-light flex items-center gap-1 overflow-x-auto no-scrollbar self-start sm:self-auto shadow-sm">
                    <button
                        onClick={() => setActiveTab('create')}
                        className={cn(
                            "px-6 py-2.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap",
                            activeTab === 'create' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-500 hover:text-primary hover:bg-neutral-light"
                        )}
                    >
                        New Investment
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

            {activeTab === 'create' && (
                <div className="max-w-[840px] w-full mx-auto animate-in slide-in-from-bottom-8 duration-700">
                    <div className="bg-white rounded-[24px] sm:rounded-[32px] shadow-2xl border border-[#dbe6df]/60 overflow-hidden">
                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-12 space-y-10">
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2 col-span-1 md:col-span-1">
                                        <label className="text-[11px] font-black text-[#111813] uppercase tracking-widest ml-1 opacity-70">Sale Description</label>
                                        <input
                                            {...register('description', { required: 'Description is required' })}
                                            className={cn(
                                                "w-full rounded-xl border bg-white focus:ring-4 focus:ring-[#006820]/5 focus:border-[#006820] text-[13px] p-4 placeholder:text-gray-300 font-medium transition-all outline-none",
                                                errors.description ? "border-red-500" : "border-[#dbe6df]"
                                            )}
                                            placeholder="Enter specifics about the sale"
                                        />
                                        {errors.description && <p className="text-[10px] text-red-500 ml-1">{errors.description.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-[#111813] uppercase tracking-widest ml-1 opacity-70">Investor Type</label>
                                        <select
                                            {...register('investorType')}
                                            className="w-full rounded-xl border border-[#dbe6df] bg-white focus:ring-4 focus:ring-[#006820]/5 focus:border-[#006820] text-[13px] p-4 font-medium text-gray-700 outline-none transition-all"
                                        >
                                            <option value="With Product">With Product</option>
                                            <option value="Without Product">Without Product</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-[#111813] uppercase tracking-widest ml-1 opacity-70">Investor Profit Rate</label>
                                        <select
                                            {...register('investorProfit')}
                                            className="w-full rounded-xl border border-[#dbe6df] bg-white focus:ring-4 focus:ring-[#006820]/5 focus:border-[#006820] text-[13px] p-4 font-medium text-gray-700 outline-none transition-all"
                                        >
                                            <option value={0.05}>5% Profit Share</option>
                                            <option value={0.06}>6% Profit Share</option>
                                            <option value={0.07}>7% Profit Share</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-[#111813] uppercase tracking-widest ml-1 opacity-70">Amount (PKR)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-[13px]">Rs</span>
                                            <input
                                                {...register('amount', {
                                                    required: 'Amount is required',
                                                    min: { value: 1, message: 'Amount must be greater than 0' }
                                                })}
                                                className={cn(
                                                    "w-full rounded-xl border bg-white focus:ring-4 focus:ring-[#006820]/5 focus:border-[#006820] text-[13px] pl-10 p-4 font-bold text-gray-900 transition-all outline-none",
                                                    errors.amount ? "border-red-500" : "border-[#dbe6df]"
                                                )}
                                                placeholder="0.00"
                                                type="number"
                                            />
                                        </div>
                                        {errors.amount && <p className="text-[10px] text-red-500 ml-1">{errors.amount.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-[#111813] uppercase tracking-widest ml-1 opacity-70">Commission Rate</label>
                                        <select
                                            {...register('commissionRate')}
                                            className="w-full rounded-xl border border-[#dbe6df] bg-white focus:ring-4 focus:ring-[#006820]/5 focus:border-[#006820] text-[13px] p-4 font-medium text-gray-700 outline-none transition-all"
                                        >
                                            <option value={0.05}>5% Commission</option>
                                            <option value={0.06}>6% Commission</option>
                                            <option value={0.07}>7% Commission</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-[#111813] uppercase tracking-widest ml-1 opacity-70">Payment Method</label>
                                        <select
                                            {...register('paymentMethod')}
                                            className="w-full rounded-xl border border-[#dbe6df] bg-white focus:ring-4 focus:ring-[#006820]/5 focus:border-[#006820] text-[13px] p-4 font-medium text-gray-700 outline-none transition-all"
                                        >
                                            <option value="Cash in hand">Cash in hand</option>
                                            <option value="Bank account">Bank account</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Calculated Commission Card */}
                                <div className="p-6 sm:p-10 bg-white rounded-2xl sm:rounded-3xl border-[2px] border-[#D4AF37] relative overflow-hidden shadow-xl shadow-accent-gold/5 group/reward">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 relative z-10">
                                        <div className="flex items-center gap-6 sm:gap-8">
                                            <div className="size-14 sm:size-16 bg-[#D4AF37] rounded-2xl shadow-xl shadow-accent-gold/20 flex items-center justify-center shrink-0">
                                                <span className="material-symbols-outlined text-white text-3xl sm:text-4xl font-black">payments</span>
                                            </div>
                                            <div>
                                                <p className="text-[#61896f] text-[10px] font-black uppercase tracking-[0.25em] mb-1.5 opacity-60">Calculated Commission</p>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-[#D4AF37] text-2xl font-bold">Rs</span>
                                                    <span className="text-[#D4AF37] text-4xl sm:text-6xl font-black tracking-tighter tabular-nums leading-none">
                                                        {calculatedCommission.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-6 sm:pt-0 border-t sm:border-t-0 border-[#D4AF37]/10">
                                            <p className="text-[#61896f] text-[11px] font-bold italic tracking-tight opacity-50">Based on branch rate</p>
                                            <div className="flex items-center gap-2 text-[#006820] font-black text-[10px] sm:text-[11px] uppercase bg-[#006820]/5 px-4 py-2 rounded-full border border-[#006820]/10">
                                                <span className="material-symbols-outlined text-[16px]">verified</span>
                                                Verified
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-[#f0f4f2] flex flex-col md:flex-row items-center justify-between gap-8">
                                <p className="text-[11px] text-[#61896f] font-medium max-w-sm text-center md:text-left leading-relaxed opacity-60">
                                    Confirm the accuracy of details before submission. All investments are subject to branch policies.
                                </p>
                                <div className="flex items-center justify-center md:justify-end gap-10 w-full md:w-auto">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/dashboard')}
                                        className="text-[15px] font-black text-gray-400 hover:text-primary transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center justify-center gap-3 px-10 py-4 rounded-xl bg-[#006820] hover:bg-black text-white text-[15px] font-black transition-all shadow-2xl shadow-[#006820]/20 active:scale-[0.98] whitespace-nowrap disabled:opacity-70"
                                    >
                                        <span>{loading ? 'Submitting...' : 'Submit Sale'}</span>
                                        <ChevronRight />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {activeTab === 'history' && (
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-border-light shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-light/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Sale Details</th>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Amount</th>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Date</th>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Profit</th>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest text-right whitespace-nowrap">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {sales.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-gray-400 font-medium">No investments found.</td>
                                    </tr>
                                )}
                                {sales.map((inv) => (
                                    <tr key={inv._id} className="hover:bg-neutral-light/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 text-sm">{inv.description}</span>
                                                <span className="text-[10px] text-gray-400 font-black tracking-wider uppercase">{inv._id.slice(-8)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="font-black text-gray-900 text-sm">Rs {inv.amount.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-gray-500 text-sm font-medium">
                                                {new Date(inv.createdAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="font-bold text-primary text-sm">{(inv.investorProfit * 100).toFixed(0)}% Share</span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <span className={cn(
                                                "inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                inv.status === 'completed' ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                                                    inv.status === 'pending' ? "bg-amber-100 text-amber-700 border-amber-200" :
                                                        "bg-red-100 text-red-700 border-red-200"
                                            )}>
                                                {inv.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

const ChevronRight = () => (
    <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 9L5 5L1 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default Investment;
