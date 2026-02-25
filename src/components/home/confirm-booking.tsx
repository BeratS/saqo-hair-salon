import { format } from 'date-fns';
import { Phone, User } from 'lucide-react';

// UI Components
import { Button } from "@/components/ui/button";

interface IProps {
    booking: IBookingState;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    confirmBooking: () => void;
}

function ConfirmBooking({
    booking,
    handleInputChange,
    confirmBooking
}: IProps) {
    return (
        <div className="space-y-6 px-2">
            <h2 className="text-3xl font-black">Confirm your<br />Booking?</h2>
            <div className="space-y-3">
                <div className="bg-primary/10 border-2 border-primary/20 p-5 rounded-[2rem] mb-6">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-2">Summary</p>
                    <p className="font-bold text-sm">
                        {booking.barber?.name} • {booking.date && format(booking.date, 'MMMM do')} @ {booking.time}
                    </p>
                    <p className="font-bold text-base mt-2">Total: {booking.totalPrice ?? 0} den</p>
                </div>

                <div className="relative">
                    <User className="absolute left-4 top-5 text-zinc-400" size={18} />
                    <input
                        name="name"
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-zinc-50 border-2 border-transparent focus:border-black outline-none transition-all font-semibold"
                        placeholder="Your Name"
                    />
                </div>
                <div className="relative">
                    <Phone className="absolute left-4 top-5 text-zinc-400" size={18} />
                    <input
                        name="phone"
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-zinc-50 border-2 border-transparent focus:border-black outline-none transition-all font-semibold"
                        placeholder="Phone Number"
                    />
                </div>
            </div>

            <Button
                onClick={confirmBooking}
                disabled={!booking.name || !booking.phone}
                className="w-full py-8 rounded-[2rem] bg-black text-white text-xl font-bold mt-4 shadow-xl disabled:bg-zinc-300 active:scale-95 transition-all"
            >
                Confirm Booking
            </Button>
        </div>
    );
}

export default ConfirmBooking;