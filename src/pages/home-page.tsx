import { AnimatePresence, motion } from 'motion/react';

// Hooks
import { BookingStepsEnum } from '@/components/home/booking-constants';
import BookingSuccess from '@/components/home/booking-success';
// UI Components
import ConfirmBooking from '@/components/home/confirm-booking';
import FailBooking from '@/components/home/fail-booking';
import { BookingLoading } from '@/components/home/loading.ui';
import PickBarbers from '@/components/home/pick-barbers';
import PickTime from '@/components/home/pick-time';
import SelectService from '@/components/home/select-service';
import TopHeader from '@/components/home/top-header';
import { Constants } from '@/Constants';
import useBooking from '@/hooks/useBooking';
import { useMeta } from '@/hooks/useMeta';


const MainPage = () => {
  const {
    isLoading,
    bookingError,
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
    nextStep,
    prevStep,
    confirmBooking,
    toggleService,
    handleResetStep,
  } = useBooking();

  useMeta(
    Constants.SITE_TITLE,
    `Welcome to ${Constants.SITE_TITLE}, your go-to destination for stylish haircuts and exceptional service in Zurich. Book your appointment today!`
  );

  return (
    <main className="flex justify-center items-center min-h-screen">
      <div className="w-full h-screen max-w-lg bg-white overflow-hidden relative flex flex-col">

        {/* HEADER SECTION */}
        <TopHeader step={step} prevStep={prevStep} />

        {isLoading && (
          <BookingLoading />
        )}

        {/* STEP CONTENT */}
        <div className="flex-1 relative px-6 overflow-y-auto overflow-x-hidden pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className='absolute inset-2'
            >
              {/* Has Error */}
              {bookingError && (
                <FailBooking error={bookingError} resetStep={handleResetStep} />
              )}

              {/* STEP 0: BARBER SELECTION */}
              {!bookingError && step === BookingStepsEnum.Barber && (
                <PickBarbers
                  booking={booking}
                  setBarber={setBarber} />
              )}

              {/* STEP 1: DATE SELECTION (TS ADAPTABLE) */}
              {!bookingError && step === BookingStepsEnum.DateAndTime && (
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
              {!bookingError && step === BookingStepsEnum.Services && (
                <SelectService
                  booking={booking}
                  toggleService={toggleService}
                  nextStep={nextStep}
                />
              )}

              {/* STEP 2: DETAILS & FIREBASE SUBMIT */}
              {!bookingError && step === BookingStepsEnum.Details && (
                <ConfirmBooking
                  booking={booking}
                  handleInputChange={handleInputChange}
                  confirmBooking={confirmBooking}
                />
              )}

              {/* STEP 3: SUCCESS SCREEN */}
              {!bookingError && step === BookingStepsEnum.Done && (
                <BookingSuccess
                  booking={booking}
                  resetStep={handleResetStep} />
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
};

export default MainPage;