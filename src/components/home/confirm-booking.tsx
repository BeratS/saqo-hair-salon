import { format } from 'date-fns';
import { Phone, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PatternFormat } from 'react-number-format';

// UI Components
import { Button } from "@/components/ui/button";
import { Constants } from '@/Constants';
import { removeSpaces } from '@/utils/helper';

interface IProps {
    booking: IBookingState;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    confirmBooking: () => void;
}

function ConfirmBooking({
    booking,
    handleInputChange,
    confirmBooking
}: IProps) {

    const { t } = useTranslation();

    const [initialInputData] = useState<{ name: string; phone: string } | null>(() => {
        const savedUser = localStorage.getItem('bookingUser');
        if (savedUser) {
            const { name, phone } = JSON.parse(savedUser);
            return { name, phone };
        }
        return null;
    });

    useEffect(() => {
        // On mount, check if we have saved user info in localStorage
        if (initialInputData) {
            handleInputChange({ target: { name: 'name', value: initialInputData.name } } as React.ChangeEvent<HTMLInputElement>);
            handleInputChange({ target: { name: 'phone', value: removeSpaces(initialInputData.phone) } } as React.ChangeEvent<HTMLInputElement>);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="space-y-4 px-2 pb-2">
            <h2 className="text-3xl font-black" dangerouslySetInnerHTML={{ __html: t('Confirm your<br />Booking?') }} />
            <div className="space-y-3">
                <div className="bg-primary/10 border-2 border-primary/20 p-5 rounded-[2rem] mb-6">
                    <p className="text-xxs font-bold text-zinc-400 uppercase tracking-[0.2em] mb-2">{t('Summary')}</p>
                    <p className="font-bold text-sm">
                        {booking.barber?.name} • {booking.date && format(booking.date, 'MMMM do')} @ {booking.time}
                    </p>
                    <p className="font-bold text-base mt-2">{t('Total')}: {booking.totalPrice ?? 0} {t('den')}</p>
                </div>

                <div className="relative">
                    <User className="absolute left-4 top-5 text-zinc-400" size={18} />
                    <input
                        name="name"
                        value={booking.name || ''}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-zinc-50 border-2 border-transparent focus:border-black outline-none transition-all font-semibold"
                        placeholder={t('Your FullName')}
                    />
                </div>
                <div className="relative">
                    <Phone className="absolute left-4 top-5 text-zinc-400" size={18} />
                    <PatternFormat
                        format="### ### ###" // The # represents where the user can type a number
                        mask="_"             // Shows 07_ ___ ___ before they type
                        value={booking.phone || ''}
                        onValueChange={(values) => {
                            // values.value is the raw string (e.g. "070123456")
                            // values.formattedValue is the pretty string (e.g. "070 123 456")
                            handleInputChange({ target: { value: values.value } } as any);
                        }}
                        // Standard input props
                        name="phone"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-zinc-50 border-2 border-transparent focus:border-black outline-none transition-all font-semibold"
                        type="tel"
                        placeholder={`${t('Phone Number')}: ${Constants.CONTACT_NUMBER_SHORT}`}
                    />
                </div>
            </div>

            <Button
                onClick={confirmBooking}
                disabled={!booking.name || !booking.phone}
                className="w-full py-8 rounded-[2rem] bg-black text-white text-xl font-bold mt-4 shadow-xl disabled:bg-zinc-300 active:scale-95 transition-all"
            >
                {t('Confirm Booking')}
            </Button>
        </div>
    );
}

export default ConfirmBooking;