import { format } from 'date-fns';
import { Calendar, MapPin, Phone, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

import { Button } from "@/components/ui/button";
import { Constants } from '@/Constants';
import { cn } from '@/lib/utils';
import { generateCalendarLink } from '@/utils/helper';

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
    <div className="relative flex flex-col items-center justify-center h-full pb-4 text-center">
      {/* Main Message */}
      <motion.div custom={0} variants={textVariants} initial="hidden" animate="visible">
        <h3 className="relative text-2xl font-bold text-black mb-2">
          {t('Your seat is reserved.')}
        </h3>
        <p className="relative text-zinc-500 font-medium mb-8 text-balance">
          {t('We’re excited to see you at')} <span className="text-black font-bold">{Constants.SITE_TITLE}</span>.
        </p>
      </motion.div>

      {/* Appointment Receipt Card */}
      <motion.div
        custom={1}
        variants={textVariants}
        initial="hidden"
        animate="visible"
        className="w-full bg-zinc-50 rounded-3xl p-2 border-2 border-zinc-100 mb-8 space-y-2.5"
      >
        <CardItem
          icon={<User size={20} className="text-black" />}
          label={t('Barber')}
          value={`${booking.barber?.name || "Master Barber"} - (${Constants.SITE_TITLE})`}
          className="whitespace-nowrap"
        />

        <CardItem
          icon={<Calendar size={20} className="text-black" />}
          label={t('Date & Time')}
          value={`${booking.date ? `${t(format(booking.date, "MMM"))} ${format(booking.date, "d")}` : 'Today'} • ${booking.time}`}
        />

        <CardItem
          icon={<Phone size={20} className="text-black" />}
          label={t('Contact')}
          href={`tel:${Constants.CONTACT_NUMBER}`}
          value={Constants.CONTACT_NUMBER}
        />

        <CardItem
          icon={<MapPin size={20} className="text-black" />}
          label={t('Location')}
          href={Constants.GOOGLE_MAPS}
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
          {t('Add to Calendar')}
        </Button>
        <Button type="button" onClick={resetStep} className="w-full py-8 border-2 border-transparent hover:border-black font-bold text-lg shadow-xl active:scale-95 transition-transform">
          {t('Make Another Booking')}
        </Button>
      </motion.div>
    </div>
  );
}

interface ICardItem {
  icon: React.ReactNode,
  label: string,
  value: string;
  href?: string;
  className?: string
}

const CardItem = ({ icon, href, label, value, className }: ICardItem) => (
  <div className="flex items-center gap-4">
    <div className="min-w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
      {icon}
    </div>
    <div className={cn("text-left", className || '')}>
      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
        {label}
      </p>
      {href ? (
        <a href={href} rel="noreferrer noopener" target="_blank" className='font-bold'>
          {value}
          <span className='ml-2 border rounded-sm px-1'>🡥</span>
        </a>
      ) : (
        <p className="font-bold text-base">{value}</p>
      )}
    </div>
  </div>
)