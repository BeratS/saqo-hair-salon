import { Sparkles } from "lucide-react"; // Added for extra "cool" factor
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";

interface IProps {
    services: IServiceMenu[];
    booking: IBookingState;
    toggleService: (service: IServiceMenu) => void;
    nextStep: () => void;
}

function SelectService({
    services,
    booking,
    toggleService,
    nextStep,
}: IProps) {
    const { t } = useTranslation();
    
    return (
        <div className="flex flex-col h-full space-y-6">
            <h2 className="text-3xl text-center font-black leading-tight tracking-tighter">
                {t('Select Services')}
            </h2>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pb-32 px-1">
                {services.map((service) => {
                    const isSelected = booking.selectedServices.find(s => s.id === service.id);
                    const isSpecial = service.isPremium;

                    return (
                        <motion.div
                            key={service.id}
                            layout // Animates size/position changes smoothly
                            whileTap={{ scale: 0.97 }}
                            onClick={() => toggleService(service)}
                            initial={false}
                            animate={{
                                // Premium golden glow for the All Inclusive card
                                boxShadow: isSpecial && isSelected
                                    ? "0px 0px 20px rgba(234, 179, 8, 0.5)"
                                    : "0px 0px 0px rgba(0,0,0,0)",
                                borderColor: isSpecial ? (isSelected ? "#eab308" : "#fbbf24") : (isSelected ? "#000" : "#f4f4f5")
                            }}
                            className={cn(
                                "relative overflow-hidden py-4 px-6 rounded-[2.5rem] border-2 transition-all cursor-pointer",
                                isSelected
                                    ? 'bg-primary/90 text-white shadow-xl'
                                    : 'bg-white text-black hover:border-zinc-300',
                                isSpecial && !isSelected && 'bg-amber-50/50 border-amber-200'
                            )}
                        >
                            {/* Floating "VIP" Badge for All Inclusive */}
                            {isSpecial && (
                                <div className={cn(
                                    "absolute top-0 right-30 sm:right-40 px-3 py-1 rounded-b-xl text-xs font-black uppercase tracking-tighter transition-all border-x border-b border-amber-400",
                                    isSelected ? "bg-amber-400 text-black" : "bg-zinc-100 text-zinc-500"
                                )}>
                                    {t('Value Pack')}
                                </div>
                            )}

                            <div className="relative z-10 flex justify-between items-baseline gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-black uppercase whitespace-nowrap">
                                        {t(service.name)}
                                    </span>
                                    {isSpecial && isSelected && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                        >
                                            <Sparkles size={16} className="text-amber-400" />
                                        </motion.div>
                                    )}
                                </div>
                                <div className={cn("flex-1 border-b-2 border-dotted mb-1 opacity-30",
                                    isSelected ? 'border-white' : 'border-zinc-400'
                                )} />
                                <span className="text-xl font-black">{service.price} {t('den')}</span>
                            </div>

                            <AnimatePresence>
                                {service.description && (
                                    <motion.p
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className={cn("text-sm mt-2 leading-relaxed text-balance font-medium",
                                            isSelected ? 'text-zinc-100' : 'text-zinc-500'
                                        )}
                                    >
                                        {t(service.description)}
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            {/* Background decoration for the Premium card */}
                            {isSpecial && isSelected && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.1 }}
                                    className="absolute -right-4 -bottom-4 text-white rotate-12"
                                >
                                    <Sparkles size={100} />
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* FIXED BOTTOM ACTION BAR */}
            <AnimatePresence>
                {booking.selectedServices.length > 0 && (
                    <div className="absolute z-10 bottom-0 left-0 right-0 p-4 bg-linear-to-t from-white via-white/90 to-transparent pt-10">
                        <Button
                            type="button"
                            disabled={booking.selectedServices.length === 0}
                            onClick={nextStep}
                            className="w-full py-9 rounded-[2.5rem] bg-black text-white hover:bg-zinc-900 text-xl font-black uppercase shadow-2xl tracking-widest flex justify-between px-10 transition-transform active:scale-95"
                        >
                            <span className="flex items-center gap-2">{t('Next')}</span>
                            <motion.span
                                key={booking.totalPrice}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="tabular-nums"
                            >
                                {booking.totalPrice} {t('den')}
                            </motion.span>
                        </Button>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default SelectService;