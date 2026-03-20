import { format, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

// UI Components
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from '@/lib/utils';

import TwoWeekAheadCalendar from '../widgets/two-weeks-ahead-calendar';

interface IProps {
    baseDate: Date | undefined;
    setBaseDate: (date: Date) => void;
    booking: any;
    timeSlots: string[];
    dateSlots: Date[];
    weekStrip: Date[];
    setDate: (date: Date) => void;
    setTime: (time: string) => void;
    isSlotBooked: (date: Date, slotTime: string) => boolean;
}

function PickTime({
    baseDate,
    setBaseDate,
    booking,
    timeSlots,
    weekStrip,
    dateSlots,
    setDate,
    setTime,
    isSlotBooked,
}: IProps) {
  const { t } = useTranslation();

    return (
        <div className="flex flex-col h-full space-y-6">
            {/* HEADER & JUMP BUTTON */}
            <div className="flex justify-between items-end px-1">
                <h2 className="text-3xl font-black leading-tight" dangerouslySetInnerHTML={{__html: t('Pick your<br />Schedule')}} />
                <Sheet>
                    <SheetTrigger render={
                        <Button variant="outline" className="rounded-2xl border-2 h-16 px-6 shadow-sm hover:bg-zinc-50" />
                    }>
                        <CalendarIcon size={28} className="text-black" />
                    </SheetTrigger>

                    <SheetContent side="bottom" className="max-w-xl mx-auto rounded-t-[3.5rem] px-6 pb-16 border-t-0 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                        {/* Grabber Handle for Visual Cue */}
                        <div className="mx-auto w-16 h-1.5 rounded-full bg-zinc-200 mt-2 mb-8" />

                        <SheetHeader className="mb-6">
                            <SheetTitle className="text-3xl font-black uppercase text-center tracking-widest">
                                {t('Pick a Date')}
                            </SheetTitle>
                        </SheetHeader>

                        {/* The New Vertical Picker */}
                        <TwoWeekAheadCalendar
                            selectedDate={baseDate!}
                            dateSlots={dateSlots}
                            onSelect={(d) => setBaseDate(d)}
                        />

                        <SheetClose render={
                            <Button className="w-full py-8 rounded-[2rem] bg-black text-white font-black text-lg uppercase tracking-widest mt-6 active:scale-95 transition-transform" />
                        }>
                            {t('Apply Selection')}
                        </SheetClose>
                    </SheetContent>
                </Sheet>
            </div>

            {/* DATE STRIP (Sticky-style at top) */}
            <div className="grid grid-cols-5 gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-mobile snap-x">
                {weekStrip.map((date: Date, i: number) => {
                    const isSelected = booking.date?.toDateString() === date.toDateString();
                    const isToday = isSameDay(date, new Date());
                    return (
                        <motion.div
                            key={i}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setDate(date)} // Note: We don't call nextStep() here anymore
                            className={cn("shrink-0 w-full h-24 rounded-[2rem] border-2 flex flex-col items-center justify-center snap-center cursor-pointer transition-all",
                                isSelected ? 'bg-primary text-white border-yellow-60 shadow-lg' : 'bg-white border-zinc-100 text-zinc-400'
                            )}
                        >
                            <span className="text-xxs font-bold uppercase">{t(format(date, 'MMM'))}</span>
                            <span className={`text-2xl font-black tracking-tighter ${isSelected ? 'text-white' : 'text-black'}`}>
                                {t(format(date, 'd'))}
                            </span>
                            <span className="text-xxs font-bold uppercase">
                                {isToday ? t("Today") : t(format(date, "EEEE"))}
                            </span>
                        </motion.div>
                    );
                })}
            </div>

            {/* TIME GRID (Scrollable area) */}
            <div className="flex-1 space-y-4 overflow-y-auto pr-1 no-scrollbar pb-20">
                <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-zinc-100"></div>
                    <span className="text-xxs font-bold text-zinc-400 uppercase tracking-widest">
                        {t('Available Slots')}
                    </span>
                    <div className="h-px flex-1 bg-zinc-100"></div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map((time: string) => {
                        const isTimeSelected = booking.time === time;
                        const booked = isSlotBooked(booking.date, time);

                        // Option A: Hide completely
                        if (booked) return null;

                        return (
                            <Button
                                key={time}
                                variant="outline"
                                disabled={!booking.date} // Disable time if no date is picked
                                className={cn("rounded-3xl py-8.5 font-bold text-base border-2 transition-all",
                                    isTimeSelected ? 'bg-primary text-white border-yellow-60' : 'bg-white hover:bg-zinc-50')}
                                onClick={() => setTime(time)} // This handles selection and moves to next step
                            >
                                {time}
                            </Button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default PickTime;