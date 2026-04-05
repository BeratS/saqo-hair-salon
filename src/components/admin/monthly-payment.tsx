import { CalendarDays, CheckCircle2, ChevronDown, Circle, Euro, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { PaymentService } from '@/services/paymentService';

export default function MonthlyPayments() {
    const { user } = useAuth();

    const FIXED_PRICE = 15;
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [payments, setPayments] = useState<IPaymentMonth[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const availableYears = Array.from({ length: 50 }, (_, i) => 2024 + i);

    // Load data from service when year changes
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const data = await PaymentService.getYearlyPayments(selectedYear);
                setPayments(data);
            } catch (error) {
                console.error("Failed to load payments");
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [selectedYear]);

    // Handle Toggle with Service
    const togglePayment = async (id: number) => {
        if (user?.email !== 'berat_01993@hotmail.com') {
            return toast.error("Unauthorized: You don't have permission to update payments.");
        }
        // 1. Map updated state
        const updatedPayments = payments.map(p =>
            p.id === id ? { ...p, isPaid: !p.isPaid } : p
        );

        // 2. Optimistic Update (Update UI immediately)
        setPayments(updatedPayments);

        // 3. Save to Firebase via Service
        try {
            await PaymentService.updateYearlyPayments(selectedYear, updatedPayments);
        } catch (error) {
            toast.error("Failed to save to database. Please check connection.");
            // Optional: Rollback UI on error
        }
    };

    const paidCount = payments.filter(p => p.isPaid).length;
    const totalRevenue = paidCount * FIXED_PRICE;

    return (
        <div className="w-full mx-auto p-4 md:p-8 space-y-8 bg-zinc-50 rounded-2xl">

            {/* STATS STRIP */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 bg-zinc-900 text-white p-6 rounded-[2rem] flex justify-between items-center overflow-hidden relative shadow-xl">
                    <Euro className="absolute -right-2 -bottom-2 w-24 h-24 opacity-10 rotate-12" />
                    <div>
                        <p className="text-zinc-400 text-xxs font-black uppercase tracking-widest">Revenue {selectedYear}</p>
                        <h2 className="text-4xl font-black tracking-tighter">{totalRevenue}€</h2>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-black italic text-yellow-500">{paidCount}/12</p>
                        <p className="text-xxs font-bold text-zinc-500 uppercase">Paid Months</p>
                    </div>
                </div>

                <div className="flex-1 bg-white border border-zinc-200 p-6 rounded-[2rem] flex justify-between items-center shadow-sm">
                    <div>
                        <p className="text-zinc-400 text-xxs font-black uppercase tracking-widest">Fixed Fee</p>
                        <h2 className="text-4xl font-black tracking-tighter text-zinc-900">{FIXED_PRICE}€</h2>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger render={
                            <Button variant="outline" className="rounded-2xl border-2 font-black text-xs flex items-center gap-2 h-12 px-6 hover:bg-zinc-50" />
                        }>
                            {selectedYear}
                            <ChevronDown size={14} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="rounded-2xl p-2 min-w-30 font-bold max-h-60 overflow-y-auto">
                            {availableYears.map((year) => (
                                <DropdownMenuItem
                                    key={year}
                                    className={cn("rounded-xl cursor-pointer py-2", selectedYear === year && "bg-zinc-100")}
                                    onClick={() => setSelectedYear(year)}
                                >
                                    {year}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* GRID TABLE */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                        <CalendarDays size={18} />
                        <h3 className="font-black uppercase tracking-tight text-lg">Monthly Ledger</h3>
                    </div>
                    {isLoading && <Loader2 className="animate-spin text-zinc-400" size={20} />}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {isLoading ? (
                        // Skeleton Loading State
                        Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="h-44 bg-zinc-200/50 animate-pulse rounded-[2rem]" />
                        ))
                    ) : (
                        payments.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => togglePayment(item.id)}
                                className={cn(
                                    "relative overflow-hidden group flex flex-col p-6 rounded-[2rem] border-2 transition-all text-left active:scale-95",
                                    item.isPaid
                                        ? "bg-white border-green-500 shadow-md shadow-green-100/50"
                                        : "bg-white border-zinc-100 hover:border-zinc-300 shadow-sm"
                                )}
                            >
                                {item.isPaid && (
                                    <div className="absolute top-0 right-0 bg-green-500 text-white p-2 rounded-bl-2xl">
                                        <CheckCircle2 size={16} />
                                    </div>
                                )}

                                <h4 className={cn(
                                    "text-xl font-black uppercase tracking-tighter mb-2 transition-colors",
                                    item.isPaid ? "text-green-600" : "text-zinc-900"
                                )}>
                                    {item.month} - ({item.year})
                                </h4>

                                <div className="mt-auto flex items-end justify-between">
                                    <div>
                                        <p className="text-2xl font-black tracking-tighter">{FIXED_PRICE}€</p>
                                        <p className={cn(
                                            "text-[9px] font-black uppercase tracking-widest",
                                            item.isPaid ? "text-green-500" : "text-zinc-500"
                                        )}>
                                            {item.isPaid ? "Status: Paid" : "Status: Pending"}
                                        </p>
                                    </div>

                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                        item.isPaid ? "bg-green-100 text-green-600" : "bg-zinc-50 text-zinc-500 group-hover:bg-zinc-100"
                                    )}>
                                        {item.isPaid ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}