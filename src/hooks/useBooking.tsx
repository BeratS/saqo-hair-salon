import { addDays, isAfter, isBefore, isSameDay, parse, startOfDay } from 'date-fns';
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

    const dateSlots = useMemo(() => {
        const now = new Date();
        const today = startOfDay(now);

        // 1. Generate initial 14 days (excluding Sundays)
        let openDays = Array.from({ length: 14 }, (_, i) => addDays(today, i))
            .filter(date => date.getDay() !== 0);

        // 2. CHECK: Is it already past closing time today?
        // Using globalHours.close directly
        const closeToday = parse(globalHours.close, 'HH:mm', now);

        if (isAfter(now, closeToday)) {
            // Remove "Today" from the list
            openDays = openDays.filter(date => !isSameDay(date, today));
        }

        // 3. Handle Exceptions
        exceptions.forEach(ex => {
            const exDate = ex.date.toDate();
            const isExToday = isSameDay(exDate, today);

            if (ex.isWorking === true) {
                const alreadyExists = openDays.some(d => isSameDay(d, exDate));
                if (!alreadyExists && !isBefore(exDate, today)) {
                    // If the exception is for today, check the specific exception closing time
                    if (isExToday) {
                        const exCloseToday = parse(ex.close, 'HH:mm', now);
                        if (isBefore(now, exCloseToday)) {
                            openDays.push(exDate);
                        }
                    } else {
                        openDays.push(exDate);
                    }
                }
            }

            if (ex.isWorking === false) {
                openDays = openDays.filter(d => !isSameDay(d, exDate));
            }
        });

        return openDays.sort((a, b) => a.getTime() - b.getTime());
    }, [exceptions, globalHours]);

    const weekStrip = useMemo<Date[]>(() => {
        // 1. Safety check: If no dates are available at all (e.g., salon is on vacation)
        if (dateSlots.length === 0) return [];

        // 2. Find where the user's current selection sits in the 14-day pool
        // If today just passed the closing time, it will be missing from dateSlots, returning -1
        const startIndex = dateSlots.findIndex(date => isSameDay(date, baseDate!));

        // 3. Fallback: If the selected date isn't found, start from the first available day
        const start = startIndex === -1 ? 0 : startIndex;

        // 4. Slice 5 days starting from that selection to show in the horizontal scroller
        return dateSlots.slice(start, start + 5);
    }, [baseDate, dateSlots]);

    // 10 AM - 8 PM Slots
    const timeSlots = useMemo<string[]>(() => {
        if (!booking.date) return [];

        const now = new Date();
        const isToday = isSameDay(booking.date, now);

        // Default to global hours
        let { open, close } = globalHours;

        // Override with exception if it exists for the selected date
        const dateException = exceptions.find(ex =>
            isSameDay(ex.date.toDate(), booking.date!) && ex.isWorking === true
        );

        if (dateException?.open && dateException?.close) {
            open = dateException.open;
            close = dateException.close;
        }

        const [openHour, openMin] = splitTime(open);
        const [closeHour, closeMin] = splitTime(close);

        const allSlots = generateTimeSlots(openHour, openMin, closeHour, closeMin);

        // Filter out past times if the user is booking for today
        if (isToday) {
            return allSlots.filter(slot => {
                const slotTime = parse(slot, 'HH:mm', now);
                // Buffer: Only show slots starting at least 5 minutes from now
                return isAfter(slotTime, new Date(now.getTime() + 5 * 60000));
            });
        }

        return allSlots;
    }, [globalHours, exceptions, booking.date]);

    const isSlotBooked = (date: Date, slotTime: string) => {
        // Generate the key for the current UI slot we are checking
        const currentSlotKey = getSlotKey(date, slotTime);

        return allAppointments.some((app) => {
            // Only check appointments that aren't cancelled
            if (app.status === 'cancelled') return false;

            // Generate the key for the existing appointment in Firebase
            const appKey = getAppointmentKey(app.scheduledAt);

            // Simple string comparison
            return appKey === currentSlotKey;
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
            date: null,
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
        if (!booking.date && dateSlots.length > 0) {
            setBooking(prev => ({ ...prev, date: dateSlots[0] }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateSlots]);

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
