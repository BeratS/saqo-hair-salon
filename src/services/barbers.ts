import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    updateDoc
} from "firebase/firestore";

import { db } from "@/lib/firebase";


const barbersRef = collection(db, "barbers");

export const subscribeToBarbers = (callback: (data: IBarber[]) => void) => {
    const q = query(barbersRef, orderBy("name", "asc"));

    return onSnapshot(q, (snapshot) => {
        const barbers = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as IBarber[];
        callback(barbers);
    });
};

export const addBarber = (barber: Omit<IBarber, 'id'>) => addDoc(barbersRef, barber);

export const updateBarber = (id: string, barber: Partial<IBarber>) =>
    updateDoc(doc(db, "barbers", id), barber);

export const deleteBarber = (id: string) => deleteDoc(doc(db, "barbers", id));