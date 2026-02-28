import { addDoc, collection, serverTimestamp, Timestamp } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { mergeDateTime } from "@/utils/helper";

interface IAppointment {
  barberId: string;
  customerName: string;
  customerPhone: string;
  serviceIds: string[];
  scheduledAt: Timestamp; 
  readableTime: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Timestamp;
}

/**
 * Saves a new appointment to Cloud Firestore
 * @param booking The current booking state from your hook
 * @returns The created document ID
 */
export const createAppointment = async (booking: IBookingState) => {
    if (!booking.date || !booking.time) throw new Error("Missing date/time");

    // Combine them into one JS Date object
    const scheduledAt = mergeDateTime(booking.date, booking.time);

    const appointmentData = {
        barberId: booking.barber?.id,
        customerName: booking.name,
        customerPhone: booking.phone,
        serviceIds: booking.selectedServices.map(s => s.id),
        scheduledAt: Timestamp.fromDate(scheduledAt),
        readableTime: `${booking.date.toDateString()} ${booking.time}`,
        totalPrice: booking.totalPrice,
        status: "pending",
        createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "appointments"), appointmentData);
    return docRef.id;
};

