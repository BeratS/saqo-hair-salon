import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

import { db } from '@/lib/firebase';

const COLLECTION_NAME = "monthly_payments";

// 1. Helper to always have the list ready
const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export const PaymentService = {
    generateYearTemplate: (year: number): IPaymentMonth[] => {
        return MONTH_NAMES.map((m, i) => ({
            id: i,
            month: m,
            year: year,
            isPaid: false
        }));
    },

    getYearlyPayments: async (year: number): Promise<IPaymentMonth[]> => {
        try {
            const docRef = doc(db, COLLECTION_NAME, year.toString());
            const docSnap = await getDoc(docRef);

            if (docSnap.exists() && docSnap.data().months) {
                return docSnap.data().months as IPaymentMonth[];
            } else {
                // 2. If no data exists in Firebase, return the 12-month template
                const template = PaymentService.generateYearTemplate(year);
                // Optional: Save it immediately so the doc exists
                await setDoc(docRef, { months: template });
                return template;
            }
        } catch (error) {
            console.error("Firebase Error:", error);
            // 3. Fallback: even if Firebase is DOWN, show the months to the user
            return PaymentService.generateYearTemplate(year);
        }
    },

    updateYearlyPayments: async (year: number, months: IPaymentMonth[]) => {
        const docRef = doc(db, COLLECTION_NAME, year.toString());
        return await updateDoc(docRef, { months });
    }
};