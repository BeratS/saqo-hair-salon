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

interface IServiceMenu {
  id?: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  order: number;
}

interface IBarber {
  id?: string;
  name: string;
  role: string;
  bio: string;
  active: boolean;
  imageUrl?: string; // Optional for now
}
