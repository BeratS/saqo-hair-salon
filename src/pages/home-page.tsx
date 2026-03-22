import { AnimatePresence, motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

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
import { useGrantNotifications } from '@/components/widgets/use-grant-notifications';
import { Constants } from '@/Constants';
import useBooking from '@/hooks/useBooking';
import { useMeta } from '@/hooks/useMeta';
import { cn } from '@/lib/utils';


const MainPage = () => {
  const {
    barbers,
    services,
    isLoading,
    bookingError,
    step,
    baseDate,
    setBaseDate,
    booking,
    timeSlots,
    weekStrip,
    dateSlots,
    handleInputChange,
    setBarber,
    setDate,
    setTime,
    nextStep,
    prevStep,
    confirmBooking,
    toggleService,
    handleResetStep,
    isSlotBooked,
  } = useBooking();

  const { t } = useTranslation();

  useMeta(
    Constants.SITE_TITLE,
    t('Welcome to {{siteTitle}}, your go-to destination for stylish haircuts and exceptional service in Skopje. Book your appointment today!', { siteTitle: Constants.SITE_TITLE })
  );

  useGrantNotifications()

  return (
    <main className={cn(
      "w-full min-h-svh max-w-lg bg-white relative flex flex-col mx-auto",
    )}>

      {/* HEADER SECTION */}
      <TopHeader step={step} prevStep={prevStep} />

      {/* WRAPPER FOR LOADING */}
      {isLoading && (
        <BookingLoading />
      )}

      {/* STEP CONTENT - FIX START */}
      <div className="flex flex-col flex-1 relative overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            /* Removed 'absolute inset-2' - added padding here instead */
            className='w-full flex-1 p-4 flex flex-col'
          >
            {/* Has Error */}
            {bookingError && (
              <FailBooking error={bookingError} resetStep={handleResetStep} />
            )}

            {/* STEP 0: BARBER SELECTION */}
            {!bookingError && step === BookingStepsEnum.Barber && (
              <PickBarbers
                barbers={barbers}
                booking={booking}
                setBarber={setBarber} />
            )}

            {/* STEP 1: DATE SELECTION */}
            {!bookingError && step === BookingStepsEnum.DateAndTime && (
              <PickTime
                baseDate={baseDate}
                setBaseDate={setBaseDate}
                booking={booking}
                timeSlots={timeSlots}
                weekStrip={weekStrip}
                dateSlots={dateSlots}
                setDate={setDate}
                setTime={setTime}
                isSlotBooked={isSlotBooked}
              />
            )}

            {/* STEP 2: SERVICES */}
            {!bookingError && step === BookingStepsEnum.Services && (
              <SelectService
                services={services}
                booking={booking}
                toggleService={toggleService}
                nextStep={nextStep}
              />
            )}

            {/* STEP 2: DETAILS */}
            {!bookingError && step === BookingStepsEnum.Details && (
              <ConfirmBooking
                booking={booking}
                handleInputChange={handleInputChange}
                confirmBooking={confirmBooking}
              />
            )}

            {/* STEP 3: SUCCESS */}
            {!bookingError && step === BookingStepsEnum.Done && (
              <BookingSuccess
                booking={booking}
                resetStep={handleResetStep} />
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
};

export default MainPage;