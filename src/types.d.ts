interface IAppointment {
  id: string;
  barberId: string;
  customerName: string;
  customerPhone: string;
  serviceIds: string[];
  scheduledAt: Timestamp;
  readableTime: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Timestamp;
  isPast?: boolean; // Optional flag for UI purposes
}

interface IBookingState {
  barber: IBarber | null;
  date: Date | null;
  time: string | null;
  name: string;
  phone: string;
  selectedServices: IServiceMenu[];
  totalPrice: number;
}

interface IServiceMenu {
  id?: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  order: number;
  isPremium?: boolean; // Flag to indicate if it's a premium service
}

interface IBarber {
  id?: string;
  name: string;
  role: string;
  bio: string;
  active: boolean;
  imageUrl?: string; // Optional for now
}
