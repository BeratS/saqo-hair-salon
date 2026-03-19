import { collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, where, writeBatch } from "firebase/firestore";
import { useEffect, useState } from "react";

import { db } from "@/lib/firebase";

export interface ICancelRequest {
    id: string;
    customerPhone: string;
    reason: string;
    createdAt: any; // Firestore Timestamp
}

export function useCancelReservations() {
    const [requests, setRequests] = useState<ICancelRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, "cancel_reservations"),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ICancelRequest[];

            setRequests(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const removeRequestAndAppointments = async (requestId: string, phone: string) => {
        try {
            const batch = writeBatch(db);

            // 1. Find all appointments with this phone number
            const appointmentsRef = collection(db, "appointments");
            const q = query(appointmentsRef, where("customerPhone", "==", phone));
            const querySnapshot = await getDocs(q);

            // 2. Add each found appointment to the batch for deletion
            querySnapshot.forEach((document) => {
                batch.delete(doc(db, "appointments", document.id));
            });

            // 3. Add the cancellation request itself to the batch
            batch.delete(doc(db, "cancel_reservations", requestId));

            // 4. Commit the batch
            await batch.commit();

            console.log(`Successfully deleted request and ${querySnapshot.size} appointments.`);
        } catch (error) {
            console.error("Batch delete failed:", error);
        }
    };

    return { requests, loading, removeRequestAndAppointments };
}
