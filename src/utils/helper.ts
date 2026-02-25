import { format } from "date-fns";

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

export const generateCalendarLink = (booking: IBookingState) => {
    const { date, time, barber, selectedServices } = booking;

    // Format details for the calendar description
    const serviceNames = selectedServices.map(s => s.name).join(', ');
    const title = `Haircut with ${barber?.name} @ Saqo`;
    const location = "Saqo Hair Salon, Skopje";

    // Create a Google Calendar Link (Easiest for Web)
    const startTime = format(date!, "yyyyMMdd") + 'T' + convertTo24h(time!);
    const endTime = format(date!, "yyyyMMdd") + 'T' + add30Mins(convertTo24h(time!));

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent('Services: ' + serviceNames)}&location=${encodeURIComponent(location)}&dates=${startTime}/${endTime}`;
};
