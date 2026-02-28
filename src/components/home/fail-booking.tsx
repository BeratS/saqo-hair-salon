import { AlertCircle, MessageSquare, RefreshCcw, X } from 'lucide-react';
import { motion } from 'motion/react';

import { Button } from "@/components/ui/button";
import { Constants } from '@/Constants';

const containerVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
};

const shakeVariants = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { delay: 0.2, duration: 0.4 }
  }
};

interface IProps {
  error: string;
  resetStep: () => void;
}

export default function BookingError({ error, resetStep }: IProps) {
  return (
    <motion.div 
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center justify-center h-full px-8 text-center"
    >
      {/* Animated Error Icon */}
      <motion.div 
        variants={shakeVariants}
        animate="animate"
        className="w-24 h-24 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-8 border-4 border-red-100"
      >
        <AlertCircle size={48} strokeWidth={2.5} />
      </motion.div>

      {/* Error Message */}
      <h2 className="text-4xl font-black tracking-tighter mb-4 uppercase">
        Something<br />Went Wrong
      </h2>
      <p className="text-zinc-500 font-medium text-lg mb-10 leading-relaxed">
        We couldn't lock in your appointment. The slot might have just been taken, or there's a connection glitch.
      {error && <span className="block mt-2 text-sm text-red-500">Error: {error}</span>}
      </p>

      {/* Action Area */}
      <div className="w-full space-y-4">
        <Button 
          variant="ghost" 
          className="w-full py-8 text-zinc-400 font-bold uppercase tracking-widest text-xs gap-2"
          onClick={() => window.location.href = `tel:${Constants.CONTACT_NUMBER}`} // Call the shop directly
        >
          <MessageSquare size={16} /> Contact Support
        </Button>
      </div>

      {/* Decorative Close for "Start Over" */}
      <button 
        onClick={() => resetStep()}
        className="absolute z-1 top-8 right-8 p-3 bg-zinc-100 rounded-full text-zinc-400"
      >
        <X size={20} />
      </button>
    </motion.div>
  );
}