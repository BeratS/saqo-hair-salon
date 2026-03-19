import { format, isSameDay } from "date-fns";
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarIcon, ChevronRight, Phone, PlusIcon, Scissors, Search, X } from "lucide-react";

import useAppointments from "@/hooks/useAppointments";
import { useBerberData } from "@/hooks/useBerberData";
import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import ConfirmDelete from "../widgets/confirm-delete";

function AppointmentDataTable() {

    const {
        appointments, allAppointments, selectedDate, sidebarDates, setSelectedDate, handleCancelAppointment
    } = useAppointments()

    const { barbers, services } = useBerberData()

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
                        const hasBookings = allAppointments.some(app => isSameDay(app.scheduledAt.toDate(), date));
                        const selectedBookingLength = allAppointments.map(app => isSameDay(app.scheduledAt.toDate(), date) ? app : null).filter(Boolean);

                        return (
                            <button
                                type="button"
                                key={date.toISOString()}
                                onClick={() => setSelectedDate(date)}
                                className={cn(
                                    "w-full flex items-center gap-4 p-4 rounded-[2rem] transition-all group cursor-pointer",
                                    isSelected
                                        ? "bg-zinc-100 text-white shadow-xl shadow-black/10 scale-[1.02]"
                                        : "hover:bg-zinc-50 text-zinc-500"
                                )}
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex flex-col items-center justify-center border",
                                    isSelected ? "border-yellow-300 bg-[#e7e7c5] text-black" : "border-zinc-100 bg-zinc-50"
                                )}>
                                    <span className="text-xxs font-black uppercase">{format(date, "MMM")}</span>
                                    <span className="text-lg font-black leading-none">{format(date, "d")}</span>
                                </div>
                                <div className="text-left">
                                    <p className={cn("text-base font-black uppercase tracking-widest mb-1 text-black")}>
                                        {isTodayDate ? "Today" : format(date, "EEEE")}
                                    </p>
                                    <p className={cn("text-xs opacity-70 uppercase tracking-tight text-black/70")}>
                                        <b>{selectedBookingLength?.length ?? 0}</b> reservations
                                    </p>
                                </div>
                                {isSelected && <ChevronRight size={14} className="ml-auto opacity-50" />}
                                {hasBookings && <div className="ml-auto h-1 w-1 bg-black rounded-full mt-1" />}
                            </button>
                        );
                    })}
                </div>
            </aside>

            {/* RIGHT SIDE: DAILY APPOINTMENTS FEED */}
            <main className="flex-1 flex flex-col overflow-hidden bg-zinc-50/30">
                <header className="p-8 flex justify-between items-center bg-white/50 backdrop-blur-md border-b border-zinc-100">
                    <div>
                        <p className="text-xxs font-black text-zinc-400 uppercase tracking-[0.2em]">Viewing Schedule For</p>
                        <h2 className="text-4xl font-black uppercase tracking-tighter">
                            {isSameDay(selectedDate, new Date()) ? "Today" : format(selectedDate, "dd - EEEE, MMM")}
                        </h2>
                        <h3 className="text-base font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                            {appointments.length} {appointments.length === 1 ? "Booking" : "Bookings"}
                        </h3>
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
                            {appointments.length > 0 ? (
                                appointments.map(app => (
                                    <AppointmentRow
                                        key={app.id}
                                        appointment={app}
                                        {...{ barbers, services }}
                                        onCancel={handleCancelAppointment} />
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

interface IAppointmentRowProps {
    appointment: IAppointment;
    barbers: IBarber[];
    services: IServiceMenu[];
    onCancel: (id: string) => void;
}

function AppointmentRow({ appointment, barbers, services, onCancel }: IAppointmentRowProps) {
    const time = format(appointment.scheduledAt.toDate(), "HH:mm");

    const serviceIds = appointment.serviceIds;
    const allServices = services.filter(s => serviceIds.includes(s.id!));

    const berber = barbers.find(b => b.id === appointment.barberId);

    return (
        <div className={cn(
            "group bg-white border border-zinc-100 p-4 rounded-[2rem] flex items-center justify-between hover:shadow-lg hover:shadow-black/5 transition-all",
            appointment.isPast && "opacity-70 grayscale"
        )}>
            <div className="flex items-center gap-8">
                <span className="text-2xl font-black italic w-16">{time}</span>

                <div className="h-10 w-0.5 bg-zinc-100" />

                <div className="flex flex-col gap-1">
                    <div className="flex gap-4 items-center">
                        <h4 className="font-black text-lg uppercase tracking-tight">{appointment.customerName}</h4>
                        <span className="text-xs font-bold text-zinc-800 flex items-center gap-1 uppercase tracking-widest bg-zinc-100 px-2 py-0.5 rounded-md">
                            <Phone size={10} /> {appointment.customerPhone}
                        </span>
                    </div>
                    <div className="flex gap-2 items-center">
                        <span className="text-xs font-bold text-zinc-800 flex items-center gap-1 uppercase tracking-widest bg-blue-200 px-2 py-0.5 rounded-md">
                            <Scissors size={10} /> {berber?.name}
                        </span>
                        {allServices.map(service => (
                            <span key={service.id} className="text-xs font-bold text-zinc-800 flex items-center gap-1 uppercase tracking-widest bg-primary/50 px-2 py-0.5 rounded-md">
                                <Scissors size={10} /> {service.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-base font-black mr-4 w-20 text-right">{appointment.totalPrice} den</span>
                {/* Action Buttons */}
                {!appointment.isPast && (
                    <div className="flex gap-2">
                        <ConfirmDelete onConfirm={() => onCancel(appointment.id)}>
                            <Button
                                type="button"
                                variant="secondary"
                                className="min-w-15 min-h-15 p-4 rounded-2xl border border-zinc-100 text-zinc-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all"
                            >
                                <X size={24} className="min-w-6 min-h-6" />
                            </Button>
                        </ConfirmDelete>
                    </div>
                )}
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