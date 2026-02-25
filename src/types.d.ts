interface IBarber {
  id: number;
  name: string;
  role: string;
  image: string;
}

interface IBookingState {
  barber: IBarber | null;
  date: Date | null;
  time: string | null;
  name: string;
  phone: string;
  selectedServices: IBookingService[];
  totalPrice: number;
}

interface IBookingService {
  id: string;
  name: string;
  price: number;
  description?: string;
}