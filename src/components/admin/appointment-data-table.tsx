

import { cn } from "@/lib/utils";
import { addDays, addHours, format, isToday, startOfDay } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { Phone, Scissors, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";


export const MOCK_APPOINTMENTS = [
    {
        id: "booking_1",
        barberId: "Saqo Master",
        customerName: "Viktor Arsov",
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
        customerName: "Stefan Kostovski",
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
        customerName: "Bojan Krstevski",
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
    const [filter, setFilter] = useState<'today' | 'all'>('today');

    // Logic to filter our mock data
    const filteredData = useMemo(() => {
        if (filter === 'today') {
            return MOCK_APPOINTMENTS.filter(app => isToday(app.scheduledAt.toDate()));
        }
        return MOCK_APPOINTMENTS;
    }, [filter]);

    return (
        <div className="min-h-screen">
            <div className="max-w-5xl mx-auto">
                {/* HEADER */}
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h1 className="text-5xl font-black uppercase tracking-tighter">All Bookings</h1>
                        <div className="flex gap-4 mt-4">
                            <button
                                onClick={() => setFilter('today')}
                                className={cn("text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all",
                                    filter === 'today' ? "border-black text-black" : "border-transparent text-zinc-400")}
                            >
                                Today
                            </button>
                            <button
                                onClick={() => setFilter('all')}
                                className={cn("text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all",
                                    filter === 'all' ? "border-black text-black" : "border-transparent text-zinc-400")}
                            >
                                All Upcoming
                            </button>
                        </div>
                    </div>
                </div>

                {/* LIST */}
                <div className="grid gap-4">
                    {filteredData.length > 0 ? (
                        filteredData.map((appointment) => (
                            <AppointmentCard key={appointment.id} appointment={appointment} />
                        ))
                    ) : (
                        <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-zinc-100">
                            <p className="text-zinc-400 font-bold uppercase text-xs tracking-widest">No appointments found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>


    );
}

export function AppointmentCard({ appointment, onApprove, onCancel }: any) {
    const date = appointment.scheduledAt.toDate();

    return (
        <div className="group bg-white border border-zinc-100 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
                {/* Time Badge */}
                <div className="flex flex-col items-center justify-center w-20 h-20 bg-zinc-50 rounded-[2rem] border border-zinc-100 group-hover:bg-black group-hover:text-white transition-colors">
                    <span className="text-[10px] font-black uppercase opacity-50">
                        {format(date, "MMM d")}
                    </span>
                    <span className="text-xl font-black italic">
                        {format(date, "HH:mm")}
                    </span>
                </div>

                <div>
                    <h4 className="text-xl font-black uppercase tracking-tight leading-none">
                        {appointment.customerName}
                    </h4>
                    <div className="flex items-center gap-3 mt-2 text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Phone size={12} /> {appointment.customerPhone}</span>
                        <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                        <span className="flex items-center gap-1 text-black"><Scissors size={12} /> {appointment.barberId}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Total Price</p>
                    <p className="text-lg font-black">{appointment.totalPrice} den</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    {appointment.status === 'pending' && (
                        <>
                            <Button
                                variant="secondary"
                                onClick={() => onCancel(appointment.id)}
                                className="min-w-15 min-h-15 p-4 rounded-2xl border border-zinc-100 text-zinc-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all"
                            >
                                <X size={24} className="min-w-6 min-h-6" />
                            </Button>
                            <Button
                                onClick={() => onApprove(appointment.id)}
                                className="min-h-15 px-8 py-4 bg-black text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:scale-105 active:scale-95 transition-all"
                            >
                                Confirm
                            </Button>
                        </>
                    )}
                    {appointment.status === 'confirmed' && (
                        <span className="inline-flex items-center min-h-13 px-6 py-3 bg-green-100 text-green-600 rounded-full font-black text-[10px] uppercase tracking-widest border border-green-100">
                            Confirmed
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AppointmentDataTable;