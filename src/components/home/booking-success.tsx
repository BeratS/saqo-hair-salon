import { Calendar, Check, MapPin, User } from 'lucide-react';
import { motion } from 'motion/react';

import { Button } from "@/components/ui/button";

// Success Animation Variants
const iconVariants = {
  hidden: { scale: 0, rotate: -45 },
  visible: { 
    scale: 1, 
    rotate: 0,
    transition: { type: "spring", stiffness: 200, damping: 12, delay: 0.2 }
  }
} as const;

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, 
    y: 0,
    transition: { delay: 0.4 + (i * 0.1) }
  })
} as const;

export default function BookingSuccess({ booking }: { booking: any }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      {/* Animated Success Circle */}
      <motion.div 
        variants={iconVariants}
        initial="hidden"
        animate="visible"
        className="w-22 h-22 bg-black rounded-full flex items-center justify-center mb-8 shadow-2xl"
      >
        <Check size={42} className="text-white" strokeWidth={3} />
      </motion.div>

      {/* Main Message */}
      <motion.div custom={0} variants={textVariants} initial="hidden" animate="visible">
        <h2 className="text-3xl font-black tracking-tighter mb-2">YOU'RE ALL SET!</h2>
        <p className="text-zinc-500 font-medium mb-8">
          Your seat is reserved. We’re excited to see you at <span className="text-black font-bold">Saqo Hair Salon</span>.
        </p>
      </motion.div>

      {/* Appointment Receipt Card */}
      <motion.div 
        custom={1} 
        variants={textVariants} 
        initial="hidden" 
        animate="visible"
        className="w-full bg-zinc-50 rounded-[2.5rem] p-6 border-2 border-zinc-100 mb-8 space-y-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
            <User size={20} className="text-black" />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Barber</p>
            <p className="font-bold text-lg">{booking.barber?.name || "Master Barber"}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
            <Calendar size={20} className="text-black" />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date & Time</p>
            <p className="font-bold text-lg">
              {booking.date ? booking.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : 'Today'} • {booking.time}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
            <MapPin size={20} className="text-black" />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Location</p>
            <p className="font-bold text-lg">Downtown Saqo St. 42</p>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        custom={2} 
        variants={textVariants} 
        initial="hidden" 
        animate="visible"
        className="w-full space-y-3"
      >
        <Button className="w-full py-8 rounded-2xl bg-black text-white font-bold text-lg shadow-xl active:scale-95 transition-transform">
          Add to Calendar
        </Button>
      </motion.div>
    </div>
  );
}