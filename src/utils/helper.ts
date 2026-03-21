import { format, isToday } from "date-fns";
import type { Timestamp } from "firebase/firestore";

import { Constants } from "@/Constants";


export function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Converts a Firestore Timestamp to the same comparable 'yyyy-MM-dd HH:mm' string.
 */
export const getAppointmentKey = (timestamp: Timestamp): string => {
    return format(timestamp.toDate(), 'yyyy-MM-dd HH:mm');
};

/**
 * Normalizes a Date and a Time Slot string into a comparable 'yyyy-MM-dd HH:mm' string.
 */
export const getSlotKey = (date: Date, slotTime: string): string => {
    const datePart = format(date, 'yyyy-MM-dd');

    // Convert "2:30 PM" -> "14:30"
    const [time, ampm] = slotTime.split(' ');
    // eslint-disable-next-line prefer-const
    let [hours, minutes] = time.split(':').map(Number);

    if (ampm === 'PM' && hours !== 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;

    const hourPart = String(hours).padStart(2, '0');
    const minPart = String(minutes).padStart(2, '0');

    return `${datePart} ${hourPart}:${minPart}`;
};

/**
 * Converts "2:30 PM" to "143000" (HHMMSS)
 */
const convertTo24h = (timeStr: string): string => {
    const [time, modifier] = timeStr.split(' ');
    // eslint-disable-next-line prefer-const
    let [hours, minutes] = time.split(':');

    if (hours === '12') {
        hours = '00';
    }

    if (modifier === 'PM') {
        hours = (parseInt(hours, 10) + 12).toString();
    }

    // Ensure leading zeros for hours (e.g., "09")
    const paddedHours = hours.padStart(2, '0');
    return `${paddedHours}${minutes}00`;
};

/**
 * Adds 30 minutes to a time string in "HHMMSS" format
 */
const add30Mins = (time24h: string): string => {
    let hh = parseInt(time24h.substring(0, 2), 10);
    let mm = parseInt(time24h.substring(2, 4), 10);

    mm += 30;

    if (mm >= 60) {
        mm -= 60;
        hh += 1;
    }

    // Format back to string with leading zeros
    const newHH = hh.toString().padStart(2, '0');
    const newMM = mm.toString().padStart(2, '0');

    return `${newHH}${newMM}00`;
};


// Helper to merge Date and Time string
export const mergeDateTime = (date: Date, timeStr: string) => {
    const [time, modifier] = timeStr.split(' ');
    // eslint-disable-next-line prefer-const
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    const mergedDate = new Date(date);
    mergedDate.setHours(hours, minutes, 0, 0);
    return mergedDate;
};

export const formatDateTimeForDisplay = (date: Date) => {
    // const date = doc.scheduledAt.toDate();
    // const formattedDate = format(date, "PPP"); // "Feb 25th, 2026"
    // const formattedTime = format(date, "p");   // "4:30 PM"
    return format(date, "MMMM d, yyyy hh:mm a");
}

export const generateCalendarLink = (booking: IBookingState) => {
    const { date, time, barber, selectedServices } = booking;

    // Format details for the calendar description
    const serviceNames = selectedServices.map(s => s.name).join(', ');
    const title = `Haircut with ${barber?.name} @ ${barber?.name}`;
    const location = `${Constants.SITE_TITLE}, Skopje`;

    // Create a Google Calendar Link (Easiest for Web)
    const startTime = format(date!, "yyyyMMdd") + 'T' + convertTo24h(time!);
    const endTime = format(date!, "yyyyMMdd") + 'T' + add30Mins(convertTo24h(time!));

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent('Services: ' + serviceNames)}&location=${encodeURIComponent(location)}&dates=${startTime}/${endTime}`;
};

export const splitTime = (timeStr: string): number[] => {
    if (!timeStr) return [0, 0]; // Default fallback
    return timeStr.split(':').map(Number);
}

export const generateTimeSlots = (
    bookingDate: Date | null,
    openHour: number,
    openMin: number,
    closeHour: number,
    closeMin: number
): string[] => {
    const slots: string[] = [];
    const dt = new Date()
    const isTodayDate = isToday(bookingDate!)
    const nowHour = dt.getHours();
    const nowMin = dt.getMinutes();
    
    let currentHour = isTodayDate && nowHour > openHour ? nowHour : openHour;
    let currentMin = isTodayDate && nowMin > openMin ? nowMin : openMin;

    while (
        currentHour < closeHour ||
        (currentHour === closeHour && currentMin < closeMin)
    ) {
        const displayHour = currentHour > 12 ? currentHour - 12 : currentHour;
        const ampm = currentHour >= 12 ? "PM" : "AM";
        const minStr = currentMin === 0 ? "00" : "30";
        slots.push(`${displayHour}:${minStr} ${ampm}`);

        currentMin += 30;
        if (currentMin >= 60) {
            currentHour += 1;
            currentMin = 0;
        }
    }

    return slots;
};