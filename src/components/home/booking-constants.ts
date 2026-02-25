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

export const SERVICES: IBookingService[] = [
    { id: '1', name: 'Haircut', price: 200 },
    { id: '2', name: 'Children’s haircut', price: 150 },
    { id: '3', name: 'Beard shave', price: 100 },
    { id: '4', name: 'Hair wash', price: 50 },
    { id: '5', name: 'Face wax', price: 50 },
    { id: '6', name: 'Mask + Steam treatment', price: 100 },
    { id: 'all-inclusive', name: 'All Inclusive', price: 500, description: 'Includes: Hair wash before & after, beard trimming, 3 types of face masks + steam, hair styling.' },
];

export const listedBookingSteps = getBookingSteps()