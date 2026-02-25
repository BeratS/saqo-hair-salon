export const BookingStepsEnum = {
  Barber: 0,
  DateAndTime: 1,
  Services: 2,
  Details: 3,
  Done: 4
} as const;

export const BookingSteps = ["Barber", "Date & Time", "Services", "Details", "Done"] as const;

const getBookingSteps = () => {
  return BookingSteps.slice(0, -1);
}

export const listedBookingSteps = getBookingSteps()