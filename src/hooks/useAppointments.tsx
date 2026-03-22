import { addDays, endOfDay, isSameDay, startOfDay } from "date-fns";
import { collection, deleteDoc, doc, getDocs, query, Timestamp, where, writeBatch } from "firebase/firestore";
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

    // Generate 14 days (today + 2 weeks) - no Sundays
    const sidebarDates = useMemo(() => {
        const openDays = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i))
            .filter(date => date.getDay() !== 0); // 0 is Sunday

        exceptions.forEach(ex => {
            const exDate = ex.date.toDate()

            if (ex.isWorking === true && exDate.getDay() === 0) {
                openDays.push(exDate);
            }

            if (ex.isWorking === false && exDate.getDay() !== 0) {
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
            const now = Timestamp.now();

            // 1. Query for all appointments scheduled BEFORE 'now'
            const q = query(appointmentsRef, where("scheduledAt", "<", now));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                alert("No old appointments to delete!");
                return;
            }

            // 2. Use a Batch for high performance
            const batch = writeBatch(db);
            snapshot.docs.forEach((doc: any) => {
                batch.delete(doc.ref);
            });

            // 3. Commit the deletions
            await batch.commit();

            alert(`Successfully cleared ${snapshot.size} old appointments.`);
        } catch (error) {
            console.error("Error deleting old appointments:", error);
            alert("Failed to delete appointments. Check console for details.");
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
        handleCancelAppointment,
        deleteOldAppointments,
    };
};

export default useAppointments;