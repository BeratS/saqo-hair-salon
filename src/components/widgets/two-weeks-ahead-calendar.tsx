
import { format, isSameDay } from "date-fns";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

interface IProps {
    selectedDate: Date;
    dateSlots: Date[];
    onSelect: (d: Date) => void
}

export default function TwoWeekAheadCalendar({ selectedDate, dateSlots, onSelect }: IProps) {
    const { t } = useTranslation();

    return (
        <div className="space-y-3 max-h-[50vh] overflow-y-auto no-scrollbar py-2 px-1 grid grid-cols-4 gap-2">
            {dateSlots.map((date) => {
                const isSelected = isSameDay(date, selectedDate);
                const isToday = isSameDay(date, new Date());

                return (
                    <motion.button
                        key={date.toString()}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelect(date)}
                        className={cn(
                            "w-full flex items-center justify-between p-5 py-2 px-4 rounded-[2rem] border-2 transition-all",
                            isSelected
                                ? "border-yellow-60 bg-primary text-white shadow-xl translate-x-1"
                                : "border-zinc-100 bg-white text-black hover:border-zinc-200"
                        )}
                    >
                        <div className="w-full flex flex-col justify-center items-center gap-2 text-center cursor-pointer">
                            {/* Date Number Badge */}
                            <div className={cn(
                                "w-12 h-12 flex flex-col items-center justify-center ",
                            )}>
                                <span className="text-sm font-black uppercase tracking-tighter opacity-50">
                                    {t(format(date, "MMM"))}
                                </span>
                                <span className="text-2xl font-black leading-none">
                                    {t(format(date, "d"))}
                                </span>
                            </div>

                            <p className="font-black uppercase tracking-widest text-xs text-center">
                                {isToday ? t("Today") : t(format(date, "EEEE"))}
                            </p>
                        </div>
                    </motion.button>
                );
            })}
        </div>
    );
}