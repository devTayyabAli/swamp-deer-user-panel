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
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            investorType: 'With Product',
            amount: '' as any, // Start as empty string for better placeholder handling
            paymentMethod: 'Cash in hand',
        },
    });

    const formatWithCommas = (value: string) => {
        const cleanValue = value.replace(/\D/g, '');
        return cleanValue ? parseInt(cleanValue).toLocaleString() : '';
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatWithCommas(e.target.value);
        setValue('amount', formatted as any);
    };

    const [receipt, setReceipt] = useState<File | null>(null);
    const paymentMethod = watch('paymentMethod');

    useEffect(() => {
        dispatch(getSales({}));
    }, [dispatch]);

    useEffect(() => {
        if (activeTab === 'history') {
            dispatch(getSales({}));
        }
    }, [activeTab, dispatch]);

    const hasPendingInvestment = sales.some(sale => sale.status === 'pending');

    useEffect(() => {
        if (success) {
            toast.success('Investment submitted successfully!');
            setSuccessInvestment({ id: 'NEW' });
            dispatch(resetSalesState());
            reset();
            setReceipt(null);
        }
        if (error) {
            toast.error(error);
            dispatch(resetSalesState());
        }
    }, [success, error, dispatch, reset]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setReceipt(e.target.files[0]);
        }
    };

    const onSubmit = async (data: any) => {
        if (!user) {
            toast.error('You must be logged in to invest.');
            return;
        }

        if (paymentMethod === 'Bank account' && !receipt) {
            toast.error('Please upload bank transition receipt');
            return;
        }

        const formData = new FormData();
        const numericAmount = data.amount.toString().replace(/,/g, '');
        formData.append('amount', numericAmount);
        formData.append('paymentMethod', data.paymentMethod);
        formData.append('productStatus', data.investorType === 'With Product' ? 'with_product' : 'without_product');

        if (receipt) {
            formData.append('receipt', receipt);
        }

        dispatch(createSale(formData));
    };

    if (successInvestment) {
        return (
            <div className="max-w-[520px] w-full mx-auto py-12 sm:py-24 px-4 sm:px-6 animate-in fade-in zoom-in duration-700 font-display">
                <div className="bg-card-bg rounded-[32px] shadow-[0_25px_60px_-15px_rgba(0,104,32,0.12)] border border-border-subtle overflow-hidden text-center p-8 sm:p-14 relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#006820]/40 to-transparent"></div>
                    <div className="size-20 bg-[#f0f7f2] dark:bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <span className="material-symbols-outlined text-[#006820] dark:text-primary text-4xl font-black">check_circle</span>
                    </div>
                    <h1 className="text-text-main text-2xl sm:text-3xl font-black mb-4 tracking-tight leading-[1.1]">Investment Successful!</h1>
                    <p className="text-[#61896f] dark:text-text-muted text-sm sm:text-[15px] font-medium mb-12 leading-relaxed px-2">
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
                            className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border-2 border-[#f0f4f2] dark:border-white/5 text-[#4a5f52] dark:text-text-muted text-sm sm:text-[15px] font-bold hover:bg-[#fbfcfa] dark:hover:bg-white/5 hover:border-[#dbe6df] dark:hover:border-white/10 transition-all active:scale-[0.98]"
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
                    <h1 className="text-2xl sm:text-3xl font-black text-text-main tracking-tight">Investment Management</h1>
                    <p className="text-sm sm:text-base text-text-muted font-medium">Invest and track your financial growth.</p>
                </div>
                <div className="bg-card-bg p-1 rounded-xl border border-border-subtle flex items-center gap-1 overflow-x-auto no-scrollbar self-start sm:self-auto shadow-sm transition-colors">
                    <button
                        onClick={() => setActiveTab('create')}
                        className={cn(
                            "px-6 py-2.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap",
                            activeTab === 'create' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-text-muted hover:text-primary dark:hover:text-primary hover:bg-soft"
                        )}
                    >
                        New Investment
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={cn(
                            "px-6 py-2.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap",
                            activeTab === 'history' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-text-muted hover:text-primary dark:hover:text-primary hover:bg-neutral-light dark:hover:bg-white/5"
                        )}
                    >
                        History
                    </button>
                </div>
            </div>

            {activeTab === 'create' && (
                <div className="max-w-[840px] w-full mx-auto animate-in slide-in-from-bottom-8 duration-700">
                    <div className="bg-card-bg rounded-[24px] sm:rounded-[32px] shadow-2xl border border-border-subtle overflow-hidden transition-colors">
                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-12 space-y-10">
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-[#111813] dark:text-white uppercase tracking-widest ml-1 opacity-70">Amount (PKR)</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold text-sm pointer-events-none">
                                                Rs
                                            </div>
                                            <input
                                                {...register('amount', {
                                                    required: 'Amount is required',
                                                    validate: value => {
                                                        const num = parseInt(value.toString().replace(/,/g, ''));
                                                        return num > 0 || 'Amount must be greater than 0';
                                                    }
                                                })}
                                                onChange={handleAmountChange}
                                                className={cn(
                                                    "w-full rounded-xl border bg-soft focus:ring-4 focus:ring-[#006820]/5 focus:border-[#006820] text-sm pl-12 pr-4 py-4 font-bold text-text-main transition-all outline-none",
                                                    errors.amount ? "border-red-500" : "border-border-subtle"
                                                )}
                                                placeholder="0"
                                                type="text"
                                            />
                                        </div>
                                        {errors.amount && <p className="text-[10px] text-red-500 ml-1">{errors.amount.message?.toString()}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-[#111813] dark:text-white uppercase tracking-widest ml-1 opacity-70">Investor Type</label>
                                        <select
                                            {...register('investorType')}
                                            className="w-full rounded-xl border border-border-subtle bg-soft focus:ring-4 focus:ring-[#006820]/5 focus:border-[#006820] text-[13px] p-4 font-bold text-text-main outline-none transition-all"
                                        >
                                            <option value="With Product" className="dark:bg-dark-surface">With Product</option>
                                            <option value="Without Product" className="dark:bg-dark-surface">Without Product</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-[#111813] dark:text-white uppercase tracking-widest ml-1 opacity-70">Payment Method</label>
                                        <select
                                            {...register('paymentMethod')}
                                            className="w-full rounded-xl border border-border-subtle bg-soft focus:ring-4 focus:ring-[#006820]/5 focus:border-[#006820] text-[13px] p-4 font-bold text-text-main outline-none transition-all"
                                        >
                                            <option value="Cash in hand" className="dark:bg-dark-surface">Cash in hand</option>
                                            <option value="Bank account" className="dark:bg-dark-surface">Bank account</option>
                                        </select>
                                    </div>
                                </div>

                                {paymentMethod === 'Bank account' && (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                                        <label className="text-[11px] font-black text-[#111813] dark:text-white uppercase tracking-widest ml-1 opacity-70">Upload Receipt</label>
                                        <div className="relative group/upload">
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className={cn(
                                                "w-full rounded-2xl border-2 border-dashed p-8 transition-all flex flex-col items-center justify-center gap-3",
                                                receipt ? "border-[#006820] bg-[#006820]/5 dark:bg-primary/5" : "border-border-subtle bg-soft group-hover/upload:border-[#006820]/30"
                                            )}>
                                                <div className={cn(
                                                    "size-12 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover/upload:scale-110",
                                                    receipt ? "bg-[#006820] text-white" : "bg-white dark:bg-dark-surface text-text-muted/60"
                                                )}>
                                                    <span className="material-symbols-outlined">
                                                        {receipt ? 'check' : 'cloud_upload'}
                                                    </span>
                                                </div>
                                                <div className="text-center">
                                                    <p className={cn(
                                                        "text-[13px] font-black tracking-tight",
                                                        receipt ? "text-[#006820] dark:text-primary" : "text-text-muted dark:text-gray-300"
                                                    )}>
                                                        {receipt ? receipt.name : 'Click to upload transition receipt'}
                                                    </p>
                                                    <p className="text-[10px] text-text-muted font-bold mt-1 uppercase tracking-widest">
                                                        PNG, JPG or JPEG (Max 5MB)
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-10 border-t border-border-subtle flex flex-col md:flex-row items-center justify-between gap-8">
                                {hasPendingInvestment ? (
                                    <p className="text-[11px] text-amber-600 font-bold max-w-sm text-center md:text-left leading-relaxed">
                                        You already have a pending investment. Please wait for it to be approved before submitting a new one.
                                    </p>
                                ) : (
                                    <p className="text-[11px] text-[#61896f] font-medium max-w-sm text-center md:text-left leading-relaxed opacity-60">
                                        Confirm the accuracy of details before submission. All investments are subject to branch policies.
                                    </p>
                                )}
                                <div className="flex items-center justify-center md:justify-end gap-10 w-full md:w-auto">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/dashboard')}
                                        className="text-[15px] font-black text-text-muted/60 hover:text-primary transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || hasPendingInvestment}
                                        className={cn(
                                            "flex items-center justify-center gap-3 px-10 py-4 rounded-xl text-white text-[15px] font-black transition-all shadow-2xl active:scale-[0.98] whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed",
                                            hasPendingInvestment ? "bg-gray-400 dark:bg-gray-700 shadow-none" : "bg-[#006820] hover:bg-black shadow-[#006820]/20 dark:shadow-none"
                                        )}
                                    >
                                        <span>{loading ? 'Submitting...' : 'Submit Investment'}</span>
                                        <ChevronRight />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {activeTab === 'history' && (
                <div className="bg-card-bg rounded-2xl sm:rounded-3xl border border-border-subtle shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500 transition-colors">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-soft/50 border-b border-border-subtle">
                                <tr>
                                    <th className="px-6 py-5 text-xs font-bold text-text-muted uppercase tracking-widest whitespace-nowrap">Sale Details</th>
                                    <th className="px-6 py-5 text-xs font-bold text-text-muted uppercase tracking-widest whitespace-nowrap">Amount</th>
                                    <th className="px-6 py-5 text-xs font-bold text-text-muted uppercase tracking-widest whitespace-nowrap">Date</th>
                                    <th className="px-6 py-5 text-xs font-bold text-text-muted uppercase tracking-widest whitespace-nowrap">Investor Type</th>
                                    <th className="px-6 py-5 text-xs font-bold text-text-muted uppercase tracking-widest text-right whitespace-nowrap">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-subtle">
                                {sales.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-text-muted font-medium">No investments found.</td>
                                    </tr>
                                )}
                                {sales.map((inv) => (
                                    <tr key={inv._id} className="hover:bg-soft/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-text-main text-sm">{inv.description}</span>
                                                <span className="text-[10px] text-text-muted/60 font-black tracking-wider uppercase">{inv._id.slice(-8)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="font-black text-text-main text-sm">Rs {inv.amount.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-text-muted text-sm font-medium">
                                                {new Date(inv.createdAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="font-bold text-primary text-sm">
                                                {inv?.productStatus
                                                    ?.replace(/_/g, " ")
                                                    .replace(/\b\w/g, c => c.toUpperCase())}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <span className={cn(
                                                "inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                inv.status === 'completed' ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50" :
                                                    inv.status === 'pending' ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50" :
                                                        "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50"
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
