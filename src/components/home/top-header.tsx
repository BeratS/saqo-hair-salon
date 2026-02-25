import { ChevronLeft, Scissors } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { Button } from "../ui/button";
import { listedBookingSteps } from "./booking-constants";


const LanguageList = [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'mk', name: 'Македонски' },
    { code: 'sq', name: 'Shqip' },
    { code: 'tr', name: 'Türkçe' }
];

interface IProps {
    step: number;
    prevStep?: () => void;
}

function TopHeader({ step, prevStep }: IProps) {
    const { i18n } = useTranslation();

    const handleLanguageChange = (value: string | null) => {
        const selectedLanguage = value || 'en';
        i18n.changeLanguage(selectedLanguage);
        localStorage.setItem('language', selectedLanguage);
    };

    return (
        <div className="p-6 pt-12 bg-white">

            <div className="flex justify-between items-center mb-8 px-1">
                {/* LEFT SIDE: Back or Logo */}
                <div className="left-icon w-14 inline-flex">
                    {step > 0 ? (
                        <Button
                            variant="secondary"
                            onClick={prevStep}
                            className="p-2 size-10 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors"
                        >
                            <ChevronLeft size={24} />
                        </Button>
                    ) : (
                        <div className="p-2.5 bg-black rounded-full shadow-lg">
                            <Scissors size={20} className="text-white" />
                        </div>
                    )}
                </div>

                {/* CENTER: Title */}
                <h1 className="font-black text-xl tracking-tighter uppercase">
                    Saqo Hair Salon
                </h1>

                {/* RIGHT SIDE: Language Switcher */}
                <DropdownMenu>
                    <DropdownMenuTrigger render={
                        <Button
                            variant="ghost"
                            className="w-14 h-10 p-0 rounded-full bg-zinc-50 border-2 border-zinc-100 hover:bg-zinc-100 focus:ring-0"
                        />
                    }>
                        <img
                            src={`/flags/${i18n?.language?.toUpperCase()}.svg`}
                            alt={i18n?.language}
                            className="w-4 h-4 rounded-sm object-cover"
                        />
                        <span className="text-xs font-black uppercase tracking-tighter">
                            {i18n?.language}
                        </span>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="rounded-2xl border-2 p-1 min-w-40">
                        {LanguageList.map((lng) => (
                            <DropdownMenuItem
                                onClick={() => handleLanguageChange(lng.code)}
                                className="rounded-xl font-bold uppercase text-xs p-3 cursor-pointer"
                            >
                                <img
                                    src={`/flags/${lng.code?.toUpperCase()}.svg`}
                                    alt={lng.code}
                                    className="w-4 h-4 rounded-sm object-cover"
                                />
                                {lng.name}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* STEPPER PROGRESS */}
            <div className="flex justify-between px-2">
                {listedBookingSteps.map((s, i) => (
                    <div key={s} className="flex flex-col items-center gap-2">
                        <div className={`h-1.5 w-18 rounded-full transition-all duration-500 ${i <= step ? 'bg-black' : 'bg-zinc-100'}`} />
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${i === step ? 'text-black' : 'text-zinc-400'}`}>{s}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TopHeader;