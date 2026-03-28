import { format, isToday } from "date-fns";

import { Constants } from "@/Constants";

// Helper to check environment safely
export const getIsIOS = () => {
    if (typeof window === 'undefined') return false;
    // Check for Safari/iOS while excluding Chrome on iOS which behaves differently
    return /iPhone|iPad|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
};

export function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function removeSpaces(str: string) {
    return str.replace(/\s+/g, '');
}

/**
 * Normalizes a Date and a Time Slot string into a comparable 'yyyy-MM-dd HH:mm' string.
 */
export const getSlotKey = (date: Date, slotTime: string): string => {
    // 1. Format the date part (e.g., "2026-03-22")
    const datePart = format(date, 'yyyy-MM-dd');

    // 2. Parse "11:00 AM" or "2:30 PM" into 24-hour time (e.g., "11:00" or "14:30")
    const [time, ampm] = slotTime.split(' ');
    // eslint-disable-next-line prefer-const
    let [hours, minutes] = time.split(':').map(Number);

    if (ampm === 'PM' && hours !== 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;

    const hourPart = String(hours).padStart(2, '0');
    const minPart = String(minutes).padStart(2, '0');

    // 3. Combine them into one "Key"
    return `${datePart} ${hourPart}:${minPart}`;
    // Result: "2026-03-22 11:00"
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
    selectedDate: Date | null,
    openHour: number,
    openMin: number,
    closeHour: number,
    closeMin: number
): string[] => {
    const slots: string[] = [];
    const dt = new Date();
    const isTodayDate = selectedDate ? isToday(selectedDate) : false;

    let startHour = openHour;
    let startMin = openMin;

    if (isTodayDate) {
        const nowHour = dt.getHours();
        const nowMin = dt.getMinutes();

        // 1. If we have already passed the opening time
        if (nowHour > openHour || (nowHour === openHour && nowMin >= openMin)) {
            // Logic: Round up to the next 30-minute block
            if (nowMin < 30) {
                // If 11:20 -> Start at 11:30
                startHour = nowHour;
                startMin = 30;
            } else {
                // If 11:40 -> Start at 12:00
                startHour = nowHour + 1;
                startMin = 0;
            }
        }
    }

    // 2. Loop from our calculated start time until closing
    let currentHour = startHour;
    let currentMin = startMin;

    while (
        currentHour < closeHour ||
        (currentHour === closeHour && currentMin < closeMin)
    ) {
        // Format for 12-hour clock (e.g., 11:30 AM)
        const displayHour = currentHour > 12 ? currentHour - 12 : (currentHour === 0 ? 12 : currentHour);
        const ampm = currentHour >= 12 ? "PM" : "AM";
        const minStr = currentMin === 0 ? "00" : "30";

        slots.push(`${displayHour}:${minStr} ${ampm}`);

        // Increment by 30 minutes
        currentMin += 30;
        if (currentMin >= 60) {
            currentHour += 1;
            currentMin = 0;
        }
    }

    return slots;
};

export const getSMSReminderHref = (phone: string, text?: string) => {
    const separator = getIsIOS() ? '&' : '?';

    // 2. Prepare the branded message
    const salonName = Constants.SITE_TITLE;
    const reminderText = text || `Reminder: Your appointment is in 30 minutes!`;

    // 3. Encode the message for the URL
    const fullMessage = encodeURIComponent(`${salonName}\n${reminderText}`);

    return `sms:${phone}${separator}body=${fullMessage}`;
}