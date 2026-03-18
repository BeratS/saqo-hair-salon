import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";

const settingsRef = doc(db, "settings", "schedule");
const exceptionsRef = collection(db, "settings", "schedule", "exceptions");

// Subscribe to Global Hours
export const subscribeToGlobalSettings = (callback: (data: IGlobalSettings) => void) => {
    return onSnapshot(settingsRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(snapshot.data() as IGlobalSettings);
        }
    });
};

// Subscribe to Exceptions (Special Dates)
export const subscribeToExceptions = (callback: (data: IScheduleException[]) => void) => {
    const q = query(exceptionsRef, orderBy("date", "asc"));
    return onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as IScheduleException[];
        callback(items);
    });
};

export const updateGlobalHours = (hours: IGlobalSettings) => setDoc(settingsRef, { ...hours }, { merge: true });
export const addException = (exc: Omit<IScheduleException, 'id'>) => addDoc(exceptionsRef, exc);
export const deleteException = (id: string) => deleteDoc(doc(db, "settings", "schedule", "exceptions", id));