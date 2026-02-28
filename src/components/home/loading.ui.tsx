import { Scissors } from "lucide-react";
import { motion } from "motion/react";

export function BookingLoading() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md"
    >
      <div className="relative">
        {/* Pulsing background glow */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-zinc-200 rounded-full blur-2xl"
        />
        
        {/* Animated Scissors Icon */}
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative bg-black p-6 rounded-full shadow-2xl"
        >
          <Scissors size={40} className="text-white" />
        </motion.div>
      </div>

      <motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-8 text-center"
      >
        <h3 className="text-xl font-black uppercase tracking-tighter">Reserving your seat</h3>
        <p className="text-zinc-500 text-sm font-medium mt-1">Talking to Saqo's database...</p>
      </motion.div>
    </motion.div>
  );
}