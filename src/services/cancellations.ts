import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { db } from "@/lib/firebase";

/**
 * Submits a cancellation request from a public user.
 * @param phone - Customer's contact number
 * @param note - The reason for cancelling
 */
export const submitCancellation = async ({ phoneNumber, note }: { phoneNumber: string; note: string; }) => {
    return await addDoc(collection(db, "cancel_reservations"), {
        customerPhone: phoneNumber,
        reason: note,
        createdAt: serverTimestamp(),
        status: "pending" // Useful for admin filtering later
    });
};
