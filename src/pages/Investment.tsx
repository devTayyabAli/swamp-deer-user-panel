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
            investorType: 'With Product',
            amount: 0,
            paymentMethod: 'Cash in hand',
        },
    });

    const [receipt, setReceipt] = useState<File | null>(null);
    const paymentMethod = watch('paymentMethod');

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
        formData.append('amount', data.amount.toString());
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
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-[#111813] uppercase tracking-widest ml-1 opacity-70">Amount (PKR)</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm pointer-events-none">
                                                Rs
                                            </div>
                                            <input
                                                {...register('amount', {
                                                    required: 'Amount is required',
                                                    min: { value: 1, message: 'Amount must be greater than 0' }
                                                })}
                                                className={cn(
                                                    "w-full rounded-xl border bg-white focus:ring-4 focus:ring-[#006820]/5 focus:border-[#006820] text-sm pl-12 pr-4 py-4 font-bold text-gray-900 transition-all outline-none",
                                                    errors.amount ? "border-red-500" : "border-[#dbe6df]"
                                                )}
                                                placeholder="0"
                                                type="number"
                                            />
                                        </div>
                                        {errors.amount && <p className="text-[10px] text-red-500 ml-1">{errors.amount.message}</p>}
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

                                {paymentMethod === 'Bank account' && (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                                        <label className="text-[11px] font-black text-[#111813] uppercase tracking-widest ml-1 opacity-70">Upload Receipt</label>
                                        <div className="relative group/upload">
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className={cn(
                                                "w-full rounded-2xl border-2 border-dashed p-8 transition-all flex flex-col items-center justify-center gap-3",
                                                receipt ? "border-[#006820] bg-[#006820]/5" : "border-[#dbe6df] bg-gray-50 group-hover/upload:border-[#006820]/30"
                                            )}>
                                                <div className={cn(
                                                    "size-12 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover/upload:scale-110",
                                                    receipt ? "bg-[#006820] text-white" : "bg-white text-gray-400"
                                                )}>
                                                    <span className="material-symbols-outlined">
                                                        {receipt ? 'check' : 'cloud_upload'}
                                                    </span>
                                                </div>
                                                <div className="text-center">
                                                    <p className={cn(
                                                        "text-[13px] font-black tracking-tight",
                                                        receipt ? "text-[#006820]" : "text-gray-600"
                                                    )}>
                                                        {receipt ? receipt.name : 'Click to upload transition receipt'}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">
                                                        PNG, JPG or JPEG (Max 5MB)
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
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
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-border-light shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-light/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Sale Details</th>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Amount</th>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Date</th>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Investor Type</th>
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
                                            <span className="font-bold text-primary text-sm">
                                                {inv?.productStatus
                                                    ?.replace(/_/g, " ")
                                                    .replace(/\b\w/g, c => c.toUpperCase())}
                                            </span>
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
