import { addDays, endOfDay, isSameDay, startOfDay } from "date-fns";
import { useEffect, useMemo, useState } from "react";

import { getAppointmentsByRange } from "@/services/booking";

const useAppointments = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    // We store the full 2-week block in state to avoid re-fetching on click
    const [allAppointments, setAllAppointments] = useState<IAppointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // 1. Generate our 14-day window (skipping Sundays)
    const sidebarDates = useMemo(() => {
        return Array.from({ length: 20 }, (_, i) => addDays(new Date(), i))
            .filter(d => d.getDay() !== 0)
            .slice(0, 14);
    }, []);

    // 2. Setup Real-time Listener for the FULL range
    useEffect(() => {
        setLoading(true);
        setError(null);

        // Ensure we cover the full start and end of the days
        const start = startOfDay(sidebarDates[0]);
        const end = endOfDay(sidebarDates[sidebarDates.length - 1]);

        try {
            // Note: We DON'T await this because it's a listener
            const unsubscribe = getAppointmentsByRange(start, end, (data) => {
                setAllAppointments(data);
                setLoading(false);
            });

            // Cleanup listener when the component unmounts
            return () => unsubscribe?.();
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [sidebarDates]);

    // 3. Filter the appointments for the specific clicked date
    // This happens instantly in memory—no loading spinner!
    const filteredAppointments = useMemo(() => {
        const now = new Date();

        return allAppointments
            .filter((app) => {
                const appDate = app.scheduledAt?.toDate ? app.scheduledAt.toDate() : new Date(app.scheduledAt);
                return isSameDay(appDate, selectedDate);
            })
            .map((app) => {
                const appDate = app.scheduledAt?.toDate ? app.scheduledAt.toDate() : new Date(app.scheduledAt);
                return {
                    ...app,
                    isPast: appDate.getTime() < now.getTime() // Boolean flag
                };
            });
    }, [allAppointments, selectedDate]);

    const handleCancelAppointment = (id: string) => {
        // Implement cancellation logic here (e.g., update Firestore, show toast, etc.)
        console.log(`Cancel appointment with ID: ${id}`);
    }

    return {
        appointments: filteredAppointments, // Only today's bookings
        allAppointments,                   // Useful if you want to show "dots" on the sidebar
        loading,
        error,
        selectedDate,
        sidebarDates,
        setSelectedDate,
        handleCancelAppointment,
    };
};

export default useAppointments;