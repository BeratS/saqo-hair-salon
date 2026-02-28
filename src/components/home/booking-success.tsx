import { Calendar, Check, MapPin, Phone, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

import { Button } from "@/components/ui/button";
import { Constants } from '@/Constants';
import { generateCalendarLink } from '@/utils/helper';

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

interface IProps {
  booking: IBookingState;
  resetStep: () => void;
}

export default function BookingSuccess({ booking, resetStep }: IProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      {/* Animated Success Circle */}
      <motion.div
        variants={iconVariants}
        initial="hidden"
        animate="visible"
        className="w-20 min-h-20 bg-black rounded-full flex items-center justify-center mb-6 shadow-2xl"
      >
        <Check size={40} className="text-white" strokeWidth={3} />
      </motion.div>

      {/* Main Message */}
      <motion.div custom={0} variants={textVariants} initial="hidden" animate="visible">
        <h3 className="text-2xl font-bold text-black mb-2">
          {t('Your seat is reserved.')}
        </h3>
        <p className="text-zinc-500 font-medium mb-8">
          We’re excited to see you at <span className="text-black font-bold">Saqo Hair Salon</span>.
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
        <CardItem
          icon={<User size={20} className="text-black" />}
          label="Barber"
          value={`${booking.barber?.name || "Master Barber"} - (${Constants.SITE_TITLE})`}
        />

        <CardItem
          icon={<Calendar size={20} className="text-black" />}
          label="Date & Time"
          value={`${booking.date ? booking.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : 'Today'} • ${booking.time}`}
        />

        <CardItem
          icon={<Phone size={20} className="text-black" />}
          label="Contact"
          value={Constants.CONTACT_NUMBER}
        />

        <CardItem
          icon={<MapPin size={20} className="text-black" />}
          label="Location"
          value={Constants.ADDRESS}
        />

      </motion.div>

      {/* Action Buttons */}
      <motion.div
        custom={2}
        variants={textVariants}
        initial="hidden"
        animate="visible"
        className="w-full space-y-3"
      >
        <Button type="button"
          onClick={() => window.open(generateCalendarLink(booking), '_blank')}
          className="w-full py-8 bg-black text-white border-2 border-transparent hover:bg-black/90 hover:border-primary font-bold text-lg shadow-xl active:scale-95 transition-transform">
          Add to Calendar
        </Button>
        <Button type="button" onClick={resetStep} className="w-full py-8 border-2 border-transparent hover:border-black font-bold text-lg shadow-xl active:scale-95 transition-transform">
          Make Another Booking
        </Button>
      </motion.div>
    </div>
  );
}

interface ICardItem {
  icon: React.ReactNode,
  label: string,
  value: string
}

const CardItem = ({ icon, label, value }: ICardItem) => (
  <div className="flex items-center gap-4">
    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
      {icon}
    </div>
    <div className="text-left">
      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
        {label}
      </p>
      <p className="font-bold text-lg">{value}</p>
    </div>
  </div>
)