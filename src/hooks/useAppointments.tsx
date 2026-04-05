import { addDays, endOfDay, isSameDay, startOfDay, subMonths } from "date-fns";
import { collection, deleteDoc, doc, getDocs, query, Timestamp, updateDoc, where, writeBatch } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { db } from "@/lib/firebase";
import { getAppointmentsByRange } from "@/services/booking";

import { useBerberSettings } from "./useBerberSettings";

const useAppointments = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    // We store the full 2-week block in state to avoid re-fetching on click
    const [allAppointments, setAllAppointments] = useState<IAppointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const { exceptions } = useBerberSettings()

    const sidebarDates = useMemo(() => {
        // 1. Get Today at 00:00:00 to ensure we don't hide 'today' by accident
        const today = startOfDay(new Date());

        // 2. Generate initial 14 days and filter out Sundays + Old Dates
        const openDays = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i))
            .filter(date => {
                const isSunday = date.getDay() === 0;
                const isPast = startOfDay(date) < today; // <--- HIDES OLD DATES
                return !isSunday && !isPast;
            });

        exceptions.forEach(ex => {
            const exDate = ex.date.toDate();
            const normalizedExDate = startOfDay(exDate);

            // Don't even process exceptions that are in the past
            if (normalizedExDate < today) return;

            // If Exception says WORK on a Sunday
            if (ex.isWorking === true && exDate.getDay() === 0) {
                // Check if we already added it to avoid duplicates
                if (!openDays.some(d => isSameDay(d, exDate))) {
                    openDays.push(exDate);
                }
            }

            // If Exception says DON'T WORK on a normal day (Holiday/Day off)
            if (ex.isWorking === false) {
                const index = openDays.findIndex(d => isSameDay(d, exDate));
                if (index !== -1) openDays.splice(index, 1);
            }
        });

        return openDays.sort((a, b) => a.getTime() - b.getTime());
    }, [exceptions]);

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

    const handleUpdateAppointment = async (id: string) => {
        try {
            const appointmentRef = doc(db, "appointments", id);

            // We update the status instead of deleting the whole row
            await updateDoc(appointmentRef, {
                status: 'cancelled',
                updatedAt: Timestamp.now() // Good for tracking when it was cancelled
            });

            // toast.success("Appointment cancelled successfully");
        } catch (error) {
            console.error("Error cancelling:", error);
            // toast.error("Could not cancel appointment");
        }
    };

    const handleCancelAppointment = async (id: string) => {
        try {
            await deleteDoc(doc(db, "appointments", id));
            toast.success("Appointment removed from records");
        } catch (error) {
            toast.error("Could not delete appointment");
        }
    };

    const deleteOldAppointments = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete all past appointments? This cannot be undone.");
        if (!confirmDelete) return;

        try {
            const appointmentsRef = collection(db, "appointments");

            // Starting from 1 month and old
            const MIN_ONE_MONTH = 1

            // 2. Set the "Past Date" to exactly 1 month ago from today
            const oneMonthAgo = subMonths(startOfDay(new Date()), MIN_ONE_MONTH);

            // 3. Convert to Timestamp
            const threshold = Timestamp.fromDate(oneMonthAgo);

            // 4. Find anything BEFORE that 1-month mark
            const q = query(appointmentsRef, where("scheduledAt", "<", threshold));

            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                toast.info("No old records to clear", {
                    description: "All past history from previous days is already clean."
                });
                return;
            }

            // 2. Use a Batch for high performance
            const batch = writeBatch(db);
            snapshot.docs.forEach((doc: any) => {
                batch.delete(doc.ref);
            });

            // 3. Commit the deletions
            await batch.commit();

            toast.success(`Successfully cleared ${snapshot.size} old appointments.`);
        } catch (error) {
            console.error("Error deleting old appointments:", error);
            toast.error("Failed to delete appointments. Check console for details.");
        }
    };

    return {
        appointments: filteredAppointments, // Only today's bookings
        allAppointments,                   // Useful if you want to show "dots" on the sidebar
        loading,
        error,
        selectedDate,
        sidebarDates,
        setSelectedDate,
        handleUpdateAppointment,
        handleCancelAppointment,
        deleteOldAppointments,
    };
};

export default useAppointments;