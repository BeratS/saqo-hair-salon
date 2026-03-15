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

const servicesRef = collection(db, "services");

// Real-time listener for services
export const subscribeToServices = (callback: (data: IServiceMenu[]) => void) => {
    // Sort by 'order' ascending (1, 2, 3...)
    const q = query(servicesRef, orderBy("order", "asc"));

    return onSnapshot(q, (snapshot) => {
        const services = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as IServiceMenu[];
        callback(services);
    });
};

export const addService = (service: IServiceMenu) => addDoc(servicesRef, service);

export const updateService = (id: string, service: Partial<IServiceMenu>) =>
    updateDoc(doc(db, "services", id), service);

export const deleteService = (id: string) => deleteDoc(doc(db, "services", id));