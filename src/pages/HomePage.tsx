import { ChevronLeft, Scissors } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import BookingSuccess from '@/components/home/booking-success';
// UI Components
import ConfirmBooking from '@/components/home/confirm-booking';
import PickBarbers from '@/components/home/pick-barbers';
import PickTime from '@/components/home/pick-time';
import { Button } from '@/components/ui/button';
// Hooks
import useBooking, { STEPS } from '@/hooks/useBooking';
import { useMeta } from '@/hooks/useMeta';


const MainPage = () => {
  const {
    step,
    baseDate,
    setBaseDate,
    booking,
    timeSlots,
    weekStrip,
    handleInputChange,
    setBarber,
    setDate,
    setTime,
    // @ts-expect-error
    setStep,
    // @ts-expect-error
    nextStep,
    prevStep,
    confirmBooking
  } = useBooking();

  useMeta(
    "Saqo Hair Salon",
    "Welcome to Saqo Hair Salon, your go-to destination for stylish haircuts and exceptional service in Zurich. Book your appointment today!"
  );

  return (
    <main className="flex justify-center items-center min-h-screen">
      <div className="w-full h-screen max-w-lg bg-white overflow-hidden relative flex flex-col">

        {/* HEADER SECTION */}
        <div className="p-6 pt-12 bg-white">
          <div className="flex justify-between items-center mb-8">
            {step > 0 ? (
              <Button variant="secondary" onClick={prevStep} className="p-2 size-9 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors">
                <ChevronLeft size={20} />
              </Button>
            ) : <div className="p-2 bg-black rounded-full"><Scissors size={20} className="text-white" /></div>}
            <h1 className="font-black text-xl tracking-tighter uppercase">
              Saqo Hair Salon
            </h1>
            <div className="w-9" />
          </div>

          {/* STEPPER PROGRESS */}
          <div className="flex justify-between px-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex flex-col items-center gap-2">
                <div className={`h-1.5 w-18 rounded-full transition-all duration-500 ${i <= step ? 'bg-black' : 'bg-zinc-100'}`} />
                <span className={`text-[9px] font-bold uppercase tracking-widest ${i === step ? 'text-black' : 'text-zinc-400'}`}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* STEP CONTENT */}
        <div className="flex-1 relative px-6 overflow-y-auto pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {/* STEP 0: BARBER SELECTION */}
              {step === 0 && (
                <PickBarbers
                  booking={booking}
                  setBarber={setBarber} />
              )}

              {/* STEP 1: DATE SELECTION (TS ADAPTABLE) */}
              {step === 1 && (
                <PickTime
                  baseDate={baseDate}
                  setBaseDate={setBaseDate}
                  booking={booking}
                  timeSlots={timeSlots}
                  weekStrip={weekStrip}
                  setDate={setDate}
                  setTime={setTime}
                />
              )}

              {/* STEP 2: DETAILS & FIREBASE SUBMIT */}
              {step === 2 && (
                <ConfirmBooking
                  booking={booking}
                  handleInputChange={handleInputChange}
                  confirmBooking={confirmBooking}
                />
              )}

              {/* STEP 3: SUCCESS SCREEN */}
              {step === 3 && (
                <BookingSuccess booking={booking} />
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
};

export default MainPage;