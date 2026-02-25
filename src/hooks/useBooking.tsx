import { addDays, startOfDay } from 'date-fns';
import { type ChangeEvent, useMemo, useState } from 'react';

import { BookingStepsEnum } from '@/components/home/booking-constants';


const useBooking = () => {
    const [step, setStep] = useState<number>(BookingStepsEnum.Barber);
    const [baseDate, setBaseDate] = useState<Date>(new Date());

    const [booking, setBooking] = useState<IBookingState>({
        barber: null,
        date: null,
        time: null,
        name: '',
        phone: '',
        selectedServices: [],
        totalPrice: 0,
    });

    // 10 AM - 8 PM Slots
    const timeSlots = useMemo<string[]>(() => {
        const slots: string[] = [];
        for (let h = 10; h < 20; h += 0.5) {
            const hour = Math.floor(h);
            const min = h % 1 === 0 ? "00" : "30";
            const displayHour = hour > 12 ? hour - 12 : hour;
            const ampm = hour >= 12 ? "PM" : "AM";
            slots.push(`${displayHour}:${min} ${ampm}`);
        }
        return slots;
    }, []);

    // 7 Days strip
    const weekStrip = useMemo<Date[]>(() => {
        return Array.from({ length: 7 }).map((_, i) => addDays(startOfDay(baseDate), i));
    }, [baseDate]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBooking((prev) => ({ ...prev, [name]: value }));
    };

    const setBarber = (barber: IBarber) => {
        setBooking(prev => ({ ...prev, barber }));
        nextStep();
    };

    const setDate = (date: Date) => {
        setBooking(prev => ({ ...prev, date }));
    };

    const setTime = (time: string) => {
        setBooking(prev => ({ ...prev, time }));
        nextStep();
    };

    const nextStep = () => setStep((s) => s + 1);
    const prevStep = () => setStep((s) => s - 1);

    const confirmBooking = async () => {
        // Logic for Firebase submission
        console.log("Submitting to Firebase:", booking);
        nextStep();
    };

    const toggleService = (service: IBookingService) => {
        setBooking(prev => {
            const isAllInclusive = service.id === 'all-inclusive';

            // If selecting All Inclusive, clear others
            if (isAllInclusive) return {
                ...prev,
                selectedServices: [service],
                totalPrice: service.price
            };

            // If other service is selected and All Inclusive was active, clear All Inclusive
            const filtered = prev.selectedServices.filter(s => s.id !== 'all-inclusive');

            const exists = filtered.find(s => s.id === service.id);
            if (exists) return {
                ...prev,
                selectedServices: filtered.filter(s => s.id !== service.id),
                totalPrice: filtered.reduce((sum, s) => sum + s.price, 0)
            };
            return {
                ...prev,
                selectedServices: [...filtered, service],
                totalPrice: filtered.reduce((sum, s) => sum + s.price, 0) + service.price
            };
        });
    };

    const handleResetStep = () => {
        setBooking({
            barber: null,
            date: null,
            time: null,
            name: '',
            phone: '',
            selectedServices: [],
            totalPrice: 0,
        });
        setStep(BookingStepsEnum.Barber);
    }

    return {
        step,
        setStep,
        baseDate,
        setBaseDate,
        booking,
        timeSlots,
        weekStrip,
        handleInputChange,
        setBarber,
        setDate,
        setTime,
        nextStep,
        prevStep,
        confirmBooking,
        toggleService,
        handleResetStep
    };
};

// eslint-disable-next-line react-refresh/only-export-components
export default useBooking
