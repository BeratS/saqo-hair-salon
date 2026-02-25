import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { motion } from 'motion/react';

// UI Components
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from '@/lib/utils';

interface IProps {
    baseDate: Date | undefined;
    setBaseDate: (date: Date) => void;
    booking: any;
    timeSlots: string[];
    weekStrip: Date[];
    setDate: (date: Date) => void;
    setTime: (time: string) => void;
}

function PickTime({
    baseDate,
    setBaseDate,
    booking,
    timeSlots,
    weekStrip,
    setDate,
    setTime,
}: IProps) {
    return (
        <div className="flex flex-col h-full space-y-6">
            {/* HEADER & JUMP BUTTON */}
            <div className="flex justify-between items-end px-1">
                <h2 className="text-3xl font-black leading-tight">Pick your<br />Schedule</h2>
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
                                Pick a Date
                            </SheetTitle>
                        </SheetHeader>

                        <div className="relative flex justify-center py-6">
                            <Calendar
                                mode="single"
                                selected={baseDate}
                                onSelect={(d) => d && setBaseDate(d)}
                                disabled={{ before: new Date() }}
                                className="p-0"
                                classNames={{
                                    months: "w-full",
                                    caption_label: "text-2xl font-black uppercase tracking-tighter",
                                    nav: "flex items-center gap-1 w-full absolute top-2 inset-x-0 justify-between",
                                    nav_button: "h-12 w-12 bg-zinc-100 rounded-full flex items-center justify-center",
                                    button_previous: "size-14 text-xl mb-0 bg-zinc-100 rounded-full flex items-center justify-center",
                                    button_next: "size-14 text-xl mb-0 bg-zinc-100 rounded-full flex items-center justify-center",
                                    head_cell: "text-zinc-400 w-14 font-bold text-sm uppercase",
                                    month_caption: "pb-6 text-center",
                                    cell: "h-16 w-16 text-center text-xl p-0 relative",
                                    day: "h-14 w-14 p-0 font-black rounded-2xl transition-all bg-transparent",
                                    day_selected: "bg-black text-white hover:bg-black focus:bg-black shadow-2xl scale-110",
                                    day_today: "bg-zinc-100 text-black border-2 border-black",
                                }}
                            />
                        </div>

                        <SheetClose render={
                            <Button className="w-full py-8 rounded-[2rem] bg-black text-white font-black text-lg uppercase tracking-widest mt-6 active:scale-95 transition-transform" />
                        }>
                            Apply Selection
                        </SheetClose>
                    </SheetContent>
                </Sheet>
            </div>

            {/* DATE STRIP (Sticky-style at top) */}
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-mobile snap-x">
                {weekStrip.map((date: Date, i: number) => {
                    const isSelected = booking.date?.toDateString() === date.toDateString();
                    return (
                        <motion.div
                            key={i}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setDate(date)} // Note: We don't call nextStep() here anymore
                            className={`shrink-0 w-20 h-24 rounded-[2rem] border-2 flex flex-col items-center justify-center snap-center cursor-pointer transition-all ${isSelected ? 'bg-black text-white border-black shadow-lg' : 'bg-white border-zinc-100 text-zinc-400'
                                }`}
                        >
                            <span className="text-[10px] font-bold uppercase">{format(date, 'eee')}</span>
                            <span className={`text-2xl font-black tracking-tighter ${isSelected ? 'text-white' : 'text-black'}`}>
                                {format(date, 'd')}
                            </span>
                            <span className="text-[10px] font-bold uppercase">{format(date, 'MMM')}</span>
                        </motion.div>
                    );
                })}
            </div>

            {/* TIME GRID (Scrollable area) */}
            <div className="flex-1 space-y-4 overflow-y-auto pr-1 no-scrollbar pb-20">
                <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-zinc-100"></div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Available Slots</span>
                    <div className="h-px flex-1 bg-zinc-100"></div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map((time: string) => {
                        const isTimeSelected = booking.time === time;
                        return (
                            <Button
                                key={time}
                                variant="outline"
                                disabled={!booking.date} // Disable time if no date is picked
                                className={cn("rounded-2xl py-8 font-bold text-sm border-2 transition-all",
                                    isTimeSelected ? 'bg-black text-white border-black' : 'hover:bg-zinc-50')}
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