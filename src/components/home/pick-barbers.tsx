import { Check, ScissorsIcon, Star, User } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from "@/lib/utils";

interface IProps {
    barbers: IBarber[];
    booking: IBookingState;
    setBarber: (barber: IBarber) => void;
}

function PickBarbers({ barbers, booking, setBarber }: IProps) {
    return (
        <div className="flex flex-col h-full space-y-8">
            {/* Minimalist Heading */}
            <div className="text-center space-y-1">
                <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">
                    Select Artist
                </h2>
                <p className="text-xxs text-zinc-400 font-bold uppercase tracking-[0.3em]">
                    Expertise for your style
                </p>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar pt-2 pb-10">
                {barbers.map((b) => {
                    const isSelected = booking.barber?.id === b.id;

                    return (
                        <motion.div
                            key={b.id}
                            layout
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setBarber(b)}
                            className={cn(
                                "relative group overflow-hidden rounded-[3rem] border-2 transition-all duration-500 cursor-pointer",
                                isSelected 
                                    ? "border-black bg-black text-white shadow-2xl -translate-y-1" 
                                    : "border-zinc-100 bg-white hover:border-zinc-300"
                            )}
                        >
                            <div className="p-6 flex items-center gap-6">
                                {/* Profile Image with Animated Ring */}
                                <div className="relative shrink-0">
                                    <motion.div 
                                        animate={{ rotate: isSelected ? 360 : 0 }}
                                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                        className={cn(
                                            "absolute -inset-2 rounded-full border-2 border-dashed opacity-0 transition-opacity duration-500",
                                            isSelected ? "opacity-30 border-white" : "border-black"
                                        )}
                                    />
                                    {/* <img
                                        src={b.imageUrl || `https://ui-avatars.com/api/?name=${b.name}&background=random&size=128`} // Fallback to generated avatar
                                        className={cn(
                                            "w-24 h-24 rounded-full object-cover transition-all duration-500",
                                            isSelected ? "scale-105" : "grayscale-50% group-hover:grayscale-0"
                                        )}
                                        alt={b.name}
                                    /> */}
                                    <div className="w-28 h-28 bg-zinc-50 border-2 border-zinc-200 rounded-[3rem] flex items-center justify-center relative group-hover:border-black/70 transition-all">
                                        <User size={48} className="text-zinc-200 group-hover:text-black/70 transition-colors" />
                                    </div>
                                    
                                    <AnimatePresence>
                                        {isSelected && (
                                            <motion.div 
                                                initial={{ scale: 0, rotate: -45 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                exit={{ scale: 0 }}
                                                className="absolute -bottom-2 -right-2 bg-white text-black rounded-full p-2 shadow-xl border-4 border-black"
                                            >
                                                <Check size={16} strokeWidth={4} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Barber Info */}
                                <div className="flex-1 text-left">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-black text-2xl tracking-tighter uppercase leading-none">
                                            {b.name}
                                        </p>
                                        {isSelected && <Star size={14} className="fill-white text-white" />}
                                    </div>
                                    {/* <p className={cn(
                                        "text-[11px] font-bold uppercase tracking-widest",
                                        isSelected ? "text-zinc-400" : "text-zinc-500"
                                    )}>
                                        {b.role}
                                    </p> */}
                                    
                                    {/* Availability Tag */}
                                    <div className={cn(
                                        "mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter",
                                        isSelected ? "bg-zinc-800 text-white" : "bg-zinc-100 text-zinc-600"
                                    )}>
                                        <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                                        Available Today
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Background Icon */}
                            <ScissorsIcon className={cn(
                                "absolute -right-6 -bottom-6 w-32 h-32 opacity-[0.03] transition-opacity duration-500",
                                isSelected ? "opacity-[0.08] text-white" : "text-black"
                            )} />
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

export default PickBarbers;