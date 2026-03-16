export const BookingStepsEnum = {
  Barber: 0,
  Services: 1,
  DateAndTime: 2,
  Details: 3,
  Done: 4
} as const;

export const BookingSteps = ["Barber", "Services", "Date & Time", "Details", "Done"] as const;

const getBookingSteps = () => {
  return BookingSteps.slice(0, -1);
}

export const listedBookingSteps = getBookingSteps()