import { CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

const BARBERS: IBarber[] = [
    { id: 1, name: "Saqo", role: "Master Barber", image: "https://www.shutterstock.com/image-vector/smiling-male-barber-apron-holds-600nw-2628838971.jpg" },
];

interface IProps {
    booking: IBookingState;
    setBarber: (barber: IBarber) => void;
}

function PickBarbers({ booking, setBarber }: IProps) {
    return (
        <div className="space-y-4 flex flex-col items-center w-full">
            {/* Centered Heading */}
            <h2 className="pt-4 text-3xl font-black leading-none mb-6 text-center">
                Pick your<br />Barber
            </h2>

            {BARBERS.map((b) => (
                <motion.div
                    key={b.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setBarber(b)}
                    className={`p-4 pt-0 aspect-square rounded-full border-2 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all w-full max-w-[280px] text-center ${booking.barber?.id === b.id
                        ? 'border-black bg-zinc-50 shadow-md scale-[1.02]'
                        : 'border-zinc-100'
                        }`}
                >
                    {/* Centered Image */}
                    <div className="relative">
                        <img
                            src={b.image}
                            className="w-32 h-32 rounded-full bg-zinc-100 border-2 border-white shadow-sm"
                            alt={b.name}
                        />
                        {/* Checkmark overlay instead of being on the far right */}
                        {booking.barber?.id === b.id && (
                            <div className="absolute -top-1 -right-1 bg-black rounded-full p-1 text-white border-2 border-white">
                                <CheckCircle2 size={18} />
                            </div>
                        )}
                    </div>

                    <div>
                        <p className="font-bold text-xl leading-tight">{b.name}</p>
                        <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">{b.role}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

export default PickBarbers;