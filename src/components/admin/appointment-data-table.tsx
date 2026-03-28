import { format, isSameDay } from "date-fns";
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarIcon, CheckIcon, ChevronDown, ChevronRight, Clock, MessageSquare, Phone, Scissors, Search, Star, Trash2, User, X } from "lucide-react";
import { useMemo, useState } from "react";

import useAppointments from "@/hooks/useAppointments";
import { useBerberData } from "@/hooks/useBerberData";
import { cn } from "@/lib/utils";
import { getSMSReminderHref, getWhatsappReminderHref } from "@/utils/helper";

import { Button } from "../ui/button";
import ConfirmDelete from "../widgets/confirm-delete";

interface IGroupedAppointments {
    upcoming: IAppointment[];
    past: IAppointment[];
}

function AppointmentDataTable() {

    const [searchTerm, setSearchTerm] = useState("");
    const [showPast, setShowPast] = useState(false);

    const {
        appointments, allAppointments, selectedDate, sidebarDates,
        setSelectedDate, handleCancelAppointment, deleteOldAppointments
    } = useAppointments()

    const { barbers, services } = useBerberData()

    const filteredAppointments = useMemo(() => {
        if (!searchTerm.trim()) return appointments;

        const lowerSearch = searchTerm.toLowerCase();

        return appointments.filter(app => {
            const nameMatch = app.customerName?.toLowerCase().includes(lowerSearch);
            const phoneMatch = app.customerPhone?.includes(lowerSearch);
            // You can also add Barber name match if you have the data joined
            return nameMatch || phoneMatch;
        });
    }, [appointments, searchTerm]);

    const { upcoming, past } = useMemo<IGroupedAppointments>(() => {
        const now = new Date();

        // If there are no appointments, return empty arrays immediately
        if (!filteredAppointments.length) {
            return { upcoming: [], past: [] };
        }

        return filteredAppointments.reduce<IGroupedAppointments>(
            (acc, app) => {
                // .toMillis() is a Firebase Timestamp method
                const isPast = app.scheduledAt.toMillis() < now;

                if (isPast) {
                    acc.past.push(app);
                } else {
                    acc.upcoming.push(app);
                }
                return acc;
            },
            { upcoming: [], past: [] } // Initial value matches IGroupedAppointments
        );
    }, [filteredAppointments]);

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-[#FDFDFD] text-black">
            {/* LEFT SIDE: 14-DAY CALENDAR STRIP */}
            <aside className="w-full md:w-80 border-b md:border-r border-zinc-100 bg-white flex flex-col sticky top-0 z-30">
                <div className="p-4 md:p-8 pb-4">
                    <h1 className="text-3xl font-black uppercase tracking-tighter">Saqo</h1>
                    <p className="text-xxs font-bold text-zinc-400 uppercase tracking-widest mt-1">Schedule Manager</p>
                </div>

                <div className="flex md:flex-col overflow-x-auto md:overflow-y-auto no-scrollbar px-1 pb-4 md:pb-10 gap-2 md:space-y-2">
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
                                    "border w-full flex items-center gap-2 md:gap-4 p-2 md:p-4 rounded-[2rem] transition-all group cursor-pointer",
                                    isSelected
                                        ? "bg-zinc-100 text-white shadow-md md:shadow-lg shadow-black/10 scale-[1.02]"
                                        : "border-zinc-100 hover:bg-zinc-50 text-zinc-500"
                                )}
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex flex-col items-center justify-center border",
                                    isSelected ? "border-yellow-300 bg-[#e7e7c5] text-black" : "border-zinc-100 bg-zinc-50"
                                )}>
                                    <span className="text-xxs font-black uppercase">{format(date, "MMM")}</span>
                                    <span className="text-lg font-black leading-none">{format(date, "d")}</span>
                                </div>
                                <div className="text-left hidden md:block">
                                    <p className={cn("text-base font-black uppercase tracking-widest mb-1 text-black")}>
                                        {isTodayDate ? "Today" : format(date, "EEEE")}
                                    </p>
                                    <p className={cn("text-xs opacity-70 uppercase tracking-tight text-black/70")}>
                                        <b>{selectedBookingLength?.length ?? 0}</b> reservations
                                    </p>
                                </div>
                                <p className={cn("text-xs opacity-70 uppercase tracking-tight text-black/70 flex items-center gap-1 md:hidden border border-black rounded-lg p-1")}>
                                    <b>{selectedBookingLength?.length ?? 0}</b> <CheckIcon size={18} />
                                </p>
                                {isSelected && <ChevronRight size={14} className="ml-auto opacity-50 hidden md:block" />}
                                {hasBookings && <div className="ml-auto h-1 w-1 bg-black rounded-full mt-1 hidden md:block" />}
                            </button>
                        );
                    })}
                </div>
            </aside>

            {/* RIGHT SIDE: DAILY APPOINTMENTS FEED */}
            <main className="flex-1 flex flex-col bg-zinc-50/30">
                <header className="p-2 md:p-8 flex flex-col-reverse gap-4 md:gap-1 md:flex-row md:justify-between md:items-center bg-white/90 backdrop-blur-md border-b border-zinc-100 sticky top-23 md:top-0 z-20">
                    <div>
                        <p className="text-xxs font-black text-zinc-400 uppercase tracking-[0.2em]">Viewing Schedule For</p>
                        <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter">
                            {isSameDay(selectedDate, new Date()) ? "Today" : format(selectedDate, "EEEE (dd, MMM)")}
                        </h2>
                        <h3 className="hidden md:block text-base font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                            {appointments.length} {appointments.length === 1 ? "Booking" : "Bookings"}
                        </h3>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search Client..."
                                className="pl-12 pr-6 py-3 bg-zinc-100 border border-zinc-100 rounded-full text-xs font-bold focus:outline-none focus:ring-2 focus:ring-black/5 w-64"
                            />
                        </div>
                        <Button
                            onClick={deleteOldAppointments}
                            title="Delete Old Appointments"
                            className="hidden md:flex bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl gap-2 items-center"
                        >
                            <Trash2 size={18} />
                        </Button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-0 py-4 md:p-8 no-scrollbar">
                    <div className="max-w-4xl mx-auto space-y-8">

                        {/* --- PAST APPOINTMENTS SECTION --- */}
                        {past.length > 0 && (
                            <div className="border-b border-zinc-100 pb-4">
                                <button
                                    onClick={() => setShowPast(!showPast)}
                                    className="flex items-center gap-2 text-xxs font-black text-zinc-400 uppercase tracking-widest hover:text-black transition-colors"
                                >
                                    {showPast ? "Hide" : "Show"} {past.length} Previous {past.length === 1 ? "Booking" : "Bookings"}
                                    <ChevronDown className={`transform transition-transform ${showPast ? 'rotate-180' : ''}`} size={12} />
                                </button>

                                <AnimatePresence>
                                    {showPast && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden mt-4 space-y-2"
                                        >
                                            {past.map(app => (
                                                <div key={app.id} className="opacity-40 grayscale scale-[0.97] origin-left">
                                                    <AppointmentRow
                                                        appointment={app}
                                                        {...{ barbers, services }}
                                                        onCancel={handleCancelAppointment}
                                                    />
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* --- UPCOMING APPOINTMENTS SECTION --- */}
                        <div className="space-y-4">
                            {upcoming.length > 0 ? (
                                upcoming.map(app => (
                                    <AppointmentRow
                                        key={app.id}
                                        appointment={app}
                                        {...{ barbers, services }}
                                        onCancel={handleCancelAppointment}
                                    />
                                ))
                            ) : (
                                <EmptyState date={selectedDate} />
                            )}
                        </div>

                    </div>
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
            "group bg-white border border-zinc-100 p-5 rounded-[2.5rem] flex flex-col md:flex-row md:items-center gap-4 hover:shadow-xl hover:shadow-black/5 transition-all relative overflow-hidden",
            appointment.isPast && "opacity-60 grayscale bg-zinc-50"
        )}>

            {/* 3. Action & Price Section */}
            <div className="flex md:hidden items-center justify-between gap-4 pb-1 border-b border-zinc-50">
                <div className="flex items-center justify-between md:justify-start gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-black text-white p-2 rounded-2xl">
                            <Clock size={16} />
                        </div>
                        <span className="text-3xl md:text-2xl font-black tracking-tighter">
                            {time}
                        </span>
                    </div>
                </div>

                {!appointment.isPast && (
                    <ConfirmDelete onConfirm={() => onCancel(appointment.id)}>
                        <Button
                            type="button"
                            variant="destructive"
                            className="w-10 min-h-10 p-1 md:min-w-15 md:min-h-15 md:p-4 rounded-2xl hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all"
                        >
                            <X size={24} className="min-w-6 min-h-6" />
                        </Button>
                    </ConfirmDelete>
                )}
            </div>

            {/* 1. Time Section - Large and clear */}
            <div className="hidden md:flex items-center justify-between md:justify-start gap-4">
                <span className="text-3xl md:text-2xl font-black tracking-tighter">
                    {time}
                </span>

                {/* Mobile-only Price Badge */}
                <span className="md:hidden text-sm font-black bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200">
                    {appointment.totalPrice} DEN
                </span>
            </div>

            {/* Vertical Divider (Desktop) */}
            <div className="hidden md:block h-12 w-px mx-1 bg-zinc-100" />

            {/* 2. Customer & Services Info */}
            <div className="flex-1 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    <div className="w-full sm:w-auto flex items-center justify-between">
                        <h4 className="font-black text-xl md:text-lg uppercase tracking-tight flex items-center gap-2">
                            {appointment.customerName}
                        </h4>

                        {/* Mobile-only Price Badge */}
                        <span className="md:hidden text-sm font-black bg-zinc-100 px-2 py-1 rounded-full border border-zinc-200 whitespace-nowrap">
                            {appointment.totalPrice} DEN
                        </span>
                    </div>

                    <div className="w-full sm:w-auto flex items-center justify-between md:justify-start gap-1 flex-wrap">
                        <a
                            href={`tel:${appointment.customerPhone}`}
                            className="w-fit text-xxs font-bold text-purple-600 bg-purple-200 hover:text-black flex items-center gap-1.5 uppercase tracking-widest border border-purple-400 px-2.5 py-1 rounded-full transition-colors"
                        >
                            <Phone size={12} /> {appointment.customerPhone}
                        </a>

                        <a href={getWhatsappReminderHref(appointment.customerPhone, appointment.customerName, appointment.scheduledAt)}
                            target="_blank"
                            className="min-h-6 min-w-7 hidden sm:flex justify-center items-center gap-2 bg-green-200 px-1 rounded-lg text-xs font-black border border-green-600">
                            <img width={18} height={18} src="/whatsapp-icon.svg" alt="Whatsapp icon" />
                        </a>

                        {/* Barber Badge */}
                        <span className="text-xxs font-bold text-blue-700 flex items-center gap-1.5 uppercase tracking-widest bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg">
                            <User size={10} strokeWidth={3} /> {berber?.name}
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                    {/* Service Badges */}
                    {allServices.map(service => {
                        const isPremium = service.isPremium; // Assuming this boolean exists

                        return (
                            <span
                                key={service.id}
                                className={cn(
                                    "text-xs font-black flex items-center gap-1 uppercase tracking-widest px-2 py-0.5 rounded-xl transition-all",
                                    isPremium
                                        ? "bg-amber-300 text-black shadow-sm shadow-primary ring-1 ring-amber-500/20"
                                        : "bg-amber-100 text-zinc-600 border border-zinc-200/50"
                                )}
                            >
                                {isPremium ? <Star size={10} fill="currentColor" /> : <Scissors size={10} strokeWidth={3} />}
                                {service.name}
                            </span>
                        );
                    })}
                </div>
            </div>

            {/* 3. Action & Price Section */}
            <div className="hidden md:flex items-center justify-between md:justify-end gap-4 mt-0 md:pt-0 border-t md:border-none border-zinc-50">
                {/* Desktop-only Price */}
                <div className="flex flex-col items-end">
                    <span className="text-xxs font-black text-zinc-400 uppercase tracking-[0.2em]">Total</span>
                    <span className="text-xl font-black tabular-nums">{appointment.totalPrice} DEN</span>
                </div>

                {!appointment.isPast && (
                    <ConfirmDelete onConfirm={() => onCancel(appointment.id)}>
                        <Button
                            type="button"
                            variant="destructive"
                            className="w-10 min-h-10 p-1 md:min-w-12 md:min-h-12 md:p-4 rounded-2xl hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all"
                        >
                            <X size={24} className="min-w-6 min-h-6" />
                        </Button>
                    </ConfirmDelete>
                )}
            </div>

            <div className="flex items-center gap-1 sm:hidden">
                <a href={getSMSReminderHref(appointment.customerPhone, appointment.customerName, appointment.scheduledAt)}
                    className="flex-1 min-h-8 text-center text-xs font-black bg-blue-600 text-white px-2 py-1 rounded-lg flex justify-center items-center gap-1 hover:bg-blue-700">
                    <MessageSquare size={16} /> Send SMS
                </a>
                <a href={getWhatsappReminderHref(appointment.customerPhone, appointment.customerName, appointment.scheduledAt)}
                    target="_blank"
                    className="flex-1 min-h-8 flex justify-center items-center gap-2 bg-green-200 px-2 rounded-lg text-xs font-black border border-green-600">
                    <img width={22} height={22} src="/whatsapp-icon.svg" alt="Whatsapp icon" /> WhatsApp
                </a>
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