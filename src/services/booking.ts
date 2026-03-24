import { endOfDay, startOfDay } from "date-fns";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    Timestamp,
    where
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { mergeDateTime } from "@/utils/helper";

/**
 * Saves a new appointment to Cloud Firestore
 * @param booking The current booking state from your hook
 * @returns The created document ID
 */
export const createAppointment = async (booking: IBookingState) => {
    if (!booking.date || !booking.time) throw new Error("Missing date/time");

    // Combine them into one JS Date object
    const scheduledAt = mergeDateTime(booking.date, booking.time);

    // 1. Pull the token we saved earlier
    const fcmToken = localStorage.getItem('fcm_token');

    const appointmentData = {
        fcmToken: fcmToken || null, // Add the token here!
        barberId: booking.barber?.id,
        customerName: booking.name,
        customerPhone: booking.phone,
        serviceIds: booking.selectedServices.map(s => s.id),
        scheduledAt: Timestamp.fromDate(scheduledAt),
        readableTime: `${booking.date.toDateString()} ${booking.time}`,
        totalPrice: booking.totalPrice,
        status: "pending",
        reminderSent: false,
        createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "appointments"), appointmentData);
    return docRef.id;
};


/**
 * Get all appointments by range date
 */
export const getAppointmentsByRange = (
    startDate: Date,
    endDate: Date,
    callback: (data: any[]) => void
) => {
    const appointmentsRef = collection(db, "appointments");

    // Ensure we capture the full range from 00:00:00 of start to 23:59:59 of end
    const rangeStart = startOfDay(startDate);
    const rangeEnd = endOfDay(endDate);

    const q = query(
        appointmentsRef,
        where("scheduledAt", ">=", Timestamp.fromDate(rangeStart)),
        where("scheduledAt", "<=", Timestamp.fromDate(rangeEnd)),
        orderBy("scheduledAt", "asc")
    );

    // Return the unsubscribe function so the hook can clean up the listener
    return onSnapshot(q, (snapshot) => {
        const appointments = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Ensure scheduledAt is converted if needed elsewhere, 
            // though keeping it as Timestamp is fine for the hook
        }));

        callback(appointments);
    }, (error) => {
        console.error("Firestore Subscription Error:", error);
    });
};

/**
 * Deletes an appointment by its document ID
 * @param appointmentId The Firestore document ID of the appointment to delete
 * @returns A promise that resolves when the deletion is complete
 */
export const deleteAppointment = async (appointmentId: string) => {
  try {
    const docRef = doc(db, "appointments", appointmentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting appointment:", error);
    throw error;
  }
};
