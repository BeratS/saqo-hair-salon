import { addDays, isSameDay } from 'date-fns';
import { type ChangeEvent, useEffect, useMemo, useState } from 'react';

import { BookingStepsEnum } from '@/components/home/booking-constants';
import { createAppointment } from '@/services/booking';
import { generateTimeSlots, getAppointmentKey, getSlotKey, splitTime, wait } from '@/utils/helper';

import useAppointments from './useAppointments';
import { useBerberData } from './useBerberData';
import { useBerberSettings } from './useBerberSettings';


const useBooking = () => {
    const [step, setStep] = useState<number>(BookingStepsEnum.Barber);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [bookingError, setBookingError] = useState<string>('');
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

    const { barbers, services } = useBerberData()

    const { allAppointments } = useAppointments()

    const { exceptions, globalHours } = useBerberSettings()

    // Generate 14 days (today + 2 weeks) - no Sundays
    const dateSlots = useMemo(() => {
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
    }, [exceptions]); // Empty array means it only runs once on mount

    const weekStrip = useMemo<Date[]>(() => {
        // 1. Find the index of the currently selected baseDate in our 14-day pool
        const startIndex = dateSlots.findIndex(date => isSameDay(date, baseDate!));

        // 2. If for some reason it's not found (e.g. it's a Sunday), default to 0
        const start = startIndex === -1 ? 0 : startIndex;

        // 3. Slice 7 days starting from that selection
        // We use .slice(start, start + 7) to show the "window" of time
        return dateSlots.slice(start, start + 5);
    }, [baseDate, dateSlots]);

    // 10 AM - 8 PM Slots
    const timeSlots = useMemo<string[]>(() => {
        let { open, close } = globalHours;

        // Check if there's an exception for the selected date
        const dateException = exceptions.find(ex =>
            isSameDay(ex.date.toDate(), booking.date!) && ex.isWorking === true
        );

        // Use exception hours if available, otherwise use global hours
        if (dateException && dateException.open && dateException.close) {
            open = dateException.open;
            close = dateException.close;
        }

        // Parse open and close times
        const [openHour, openMin] = splitTime(open)
        const [closeHour, closeMin] = splitTime(close)

        return generateTimeSlots(booking.date, openHour, openMin, closeHour, closeMin);
    }, [globalHours, exceptions, booking.date]);

    const isSlotBooked = (date: Date, slotTime: string) => {
        // 1. Create a Date object for the current UI slot
        const [time, ampm] = slotTime.split(' ');
        // eslint-disable-next-line prefer-const
        let [hours, minutes] = splitTime(time)
        if (ampm === 'PM' && hours !== 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;

        const slotDate = new Date(date);
        slotDate.setHours(hours, minutes, 0, 0);
        const slotTimeMs = slotDate.getTime();

        // 2. Compare against appointment timestamps
        return allAppointments.some((app) => {
            if (app.status === 'cancelled') return false;

            // Convert Firestore Timestamp to ms
            const appTimeMs = app.scheduledAt.toMillis();

            return appTimeMs === slotTimeMs;
        });
    };

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
        try {
            // Save to localStorage for persistence
            localStorage.setItem('bookingUser', JSON.stringify({
                name: booking.name,
                phone: booking.phone
            }));

            setIsLoading(true); // Start loading state

            await createAppointment(booking);

            await wait(1000)

            nextStep(); // Success!
        } catch (error: any) {
            console.error("Booking failed:", error?.message);
            setBookingError(error?.message ?? 'Failed to book appointment'); // Show that red error UI we made
        } finally {
            setIsLoading(false);
        }
    };

    const toggleService = (service: IServiceMenu) => {
        setBooking(prev => {
            const isAllInclusive = service.isPremium;

            // If selecting All Inclusive, clear others
            if (isAllInclusive) return {
                ...prev,
                selectedServices: [service],
                totalPrice: service.price
            };

            // If other service is selected and All Inclusive was active, clear All Inclusive
            const filtered = prev.selectedServices.filter(s => s.isPremium !== true);

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
            date: weekStrip[0] || null,
            time: null,
            name: '',
            phone: '',
            selectedServices: [],
            totalPrice: 0,
        });
        setStep(BookingStepsEnum.Barber);
        setBookingError('');
    }

    useEffect(() => {
        if (
            weekStrip.length > 0 &&
            (!booking.date || booking.date !== weekStrip[0])
        ) {
            setBooking(prev => ({ ...prev, date: weekStrip[0] }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [weekStrip]);

    return {
        barbers,
        services,
        bookingError,
        isLoading,
        step,
        setStep,
        baseDate,
        setBaseDate,
        booking,
        timeSlots,
        weekStrip,
        dateSlots,
        handleInputChange,
        setBarber,
        setDate,
        setTime,
        nextStep,
        prevStep,
        confirmBooking,
        toggleService,
        handleResetStep,
        isSlotBooked
    };
};

// eslint-disable-next-line react-refresh/only-export-components
export default useBooking
