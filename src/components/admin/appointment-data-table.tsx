

import { addDays, addHours, format, isSameDay, startOfDay } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarIcon, ChevronRight, Phone, Plus, PlusIcon, Scissors, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";


export const MOCK_APPOINTMENTS = [
    {
        id: "booking_1",
        barberId: "Saqo Master",
        customerName: "Vedat Muriqi",
        customerPhone: "+389 70 123 456",
        serviceIds: ["haircut", "beard"],
        // Set for 2 hours from now today
        scheduledAt: Timestamp.fromDate(addHours(new Date(), 2)),
        readableTime: "Today @ 17:00",
        totalPrice: 600,
        status: "pending",
        createdAt: Timestamp.now(),
    },
    {
        id: "booking_2",
        barberId: "Leon",
        customerName: "Besart Ibishi",
        customerPhone: "+389 71 999 888",
        serviceIds: ["all-inclusive"],
        // Set for 4 hours from now today
        scheduledAt: Timestamp.fromDate(addHours(new Date(), 4)),
        readableTime: "Today @ 19:00",
        totalPrice: 1200,
        status: "confirmed",
        createdAt: Timestamp.now(),
    },
    {
        id: "booking_3",
        barberId: "Saqo Master",
        customerName: "Shkupi FC",
        customerPhone: "+389 72 444 555",
        serviceIds: ["haircut"],
        // Tomorrow
        scheduledAt: Timestamp.fromDate(addDays(addHours(startOfDay(new Date()), 10), 1)),
        readableTime: "Tomorrow @ 10:00",
        totalPrice: 450,
        status: "pending",
        createdAt: Timestamp.now(),
    }
];

function AppointmentDataTable() {
    const [selectedDate, setSelectedDate] = useState(new Date());

    // 1. Generate our 14-day window (skipping Sundays)
    const sidebarDates = useMemo(() => {
        return Array.from({ length: 20 }, (_, i) => addDays(new Date(), i))
            .filter(d => d.getDay() !== 0)
            .slice(0, 14);
    }, []);

    // 2. Filter Mock Data for the selected day
    const dailyAppointments = useMemo(() => {
        return MOCK_APPOINTMENTS.filter(app =>
            isSameDay(app.scheduledAt.toDate(), selectedDate)
        );
    }, [selectedDate]);

    return (
        <div className="flex h-screen bg-[#FDFDFD] text-black">
            {/* LEFT SIDE: 14-DAY CALENDAR STRIP */}
            <aside className="w-80 border-r border-zinc-100 bg-white flex flex-col">
                <div className="p-8 pb-4">
                    <h1 className="text-3xl font-black uppercase tracking-tighter">Saqo</h1>
                    <p className="text-xxs font-bold text-zinc-400 uppercase tracking-widest mt-1">Schedule Manager</p>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-10 space-y-2">
                    {sidebarDates.map((date) => {
                        const isSelected = isSameDay(date, selectedDate);
                        const isTodayDate = isSameDay(date, new Date());

                        return (
                            <button
                                type="button"
                                key={date.toISOString()}
                                onClick={() => setSelectedDate(date)}
                                className={cn(
                                    "w-full flex items-center gap-4 p-4 rounded-[2rem] transition-all group",
                                    isSelected
                                        ? "bg-black/30 text-white shadow-xl shadow-black/10 scale-[1.02]"
                                        : "hover:bg-zinc-50 text-zinc-500"
                                )}
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex flex-col items-center justify-center border",
                                    isSelected ? "border-zinc-800 bg-zinc-600" : "border-zinc-100 bg-zinc-50"
                                )}>
                                    <span className="text-xxs font-black uppercase">{format(date, "MMM")}</span>
                                    <span className="text-lg font-black leading-none">{format(date, "d")}</span>
                                </div>
                                <div className="text-left">
                                    <p className={cn("text-base font-black uppercase tracking-widest mb-1", isSelected ? "text-white" : "text-black")}>
                                        {isTodayDate ? "Today" : format(date, "EEEE")}
                                    </p>
                                    <p className="text-xxs font-bold opacity-70 uppercase tracking-tight text-red-500">8 Slots Available</p>
                                </div>
                                {isSelected && <ChevronRight size={14} className="ml-auto opacity-50" />}
                            </button>
                        );
                    })}
                </div>
            </aside>

            {/* RIGHT SIDE: DAILY APPOINTMENTS FEED */}
            <main className="flex-1 flex flex-col overflow-hidden bg-zinc-50/30">
                <header className="p-8 flex justify-between items-center bg-white/50 backdrop-blur-md border-b border-zinc-100">
                    <div>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Viewing Schedule For</p>
                        <h2 className="text-4xl font-black uppercase tracking-tighter">
                            {isSameDay(selectedDate, new Date()) ? "Today" : format(selectedDate, "EEEE, MMMM do")}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                            <input
                                placeholder="Search Client..."
                                className="pl-12 pr-6 py-3 bg-white border border-zinc-100 rounded-full text-xs font-bold focus:outline-none focus:ring-2 focus:ring-black/5 w-64"
                            />
                        </div>
                        <button
                            type="button"
                            className="p-3 mr-4 bg-primary/60 border border-zinc-100 rounded-full hover:bg-primary hover:text-white transition-all cursor-pointer">
                            <PlusIcon size={18} />
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedDate.toISOString()}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4 max-w-4xl mx-auto"
                        >
                            {dailyAppointments.length > 0 ? (
                                dailyAppointments.map(app => (
                                    <AppointmentRow key={app.id} appointment={app} />
                                ))
                            ) : (
                                <EmptyState date={selectedDate} />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

function AppointmentRow({ appointment, onCancel }: any) {
    const time = format(appointment.scheduledAt.toDate(), "HH:mm");

    return (
        <div className="group bg-white border border-zinc-100 p-5 rounded-[2rem] flex items-center justify-between hover:shadow-lg hover:shadow-black/5 transition-all">
            <div className="flex items-center gap-8">
                <span className="text-2xl font-black italic w-16">{time}</span>

                <div className="h-10 w-0.5 bg-zinc-100" />

                <div>
                    <h4 className="font-black text-lg uppercase tracking-tight">{appointment.customerName}</h4>
                    <div className="flex gap-4 items-center">
                        <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1 uppercase tracking-widest">
                            <Phone size={10} /> {appointment.customerPhone}
                        </span>
                        <span className="text-[10px] font-bold text-zinc-800 flex items-center gap-1 uppercase tracking-widest bg-zinc-100 px-2 py-0.5 rounded-md">
                            <Scissors size={10} /> {appointment.barberId}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-base font-black mr-4 w-20 text-right">{appointment.totalPrice} den</span>
                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => onCancel(appointment.id)}
                        className="min-w-15 min-h-15 p-4 rounded-2xl border border-zinc-100 text-zinc-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all"
                    >
                        <X size={24} className="min-w-6 min-h-6" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

function EmptyState({ date }: any) {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
                <CalendarIcon className="text-zinc-300" size={32} />
            </div>
            <h3 className="font-black uppercase tracking-tight text-xl">No Bookings Found</h3>
            <p className="text-zinc-400 text-sm font-medium mt-1">There are no appointments scheduled for {format(date, "MMMM do")}.</p>
        </div>
    );
}

export default AppointmentDataTable;