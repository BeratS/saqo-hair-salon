import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";

import { Constants } from "@/Constants";
import useAppointments from "@/hooks/useAppointments";
import { submitCancellation } from "@/services/cancellations";
import { removeSpaces } from "@/utils/helper";

import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Textarea } from "../ui/textarea";

function CancelReservation() {
    const { t } = useTranslation();

    const [isLoading, setIsLoading] = useState(false)

    const { allAppointments, handleUpdateAppointment } = useAppointments()

    // Inside PickBarbers function
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        phoneNumber: '',
        note: '',
    });

    const handleCancelSubmit = async () => {
        const cleanPhone = removeSpaces(formData.phoneNumber);

        // 1. Filter ONLY the appointments that match THIS specific phone number
        const matches = allAppointments.filter(app => {
            const appPhone = removeSpaces(app.customerPhone || '');
            const isMatch = appPhone === cleanPhone;
            const isNotCancelled = app.status !== 'cancelled';

            return isMatch && isNotCancelled;
        });

        // 2. Validation: If no matches for THIS phone, stop.
        if (matches.length === 0) {
            toast.error(t("No active reservation found"), {
                description: t("Check the phone number and try again."),
                duration: 6000
            });
            return;
        }

        try {
            setIsLoading?.(true);

            // 3. Map ONLY over the matched IDs
            const updatePromises = matches.map(app =>
                handleUpdateAppointment(app.id)
            );

            // Submit the cancellation record/log
            const cancellationLog = submitCancellation({
                phoneNumber: cleanPhone,
                note: formData.note,
            });

            // Execute all updates for this specific user's appointments
            await Promise.all([...updatePromises, cancellationLog]);

            toast.success(t("Reservation Cancelled"), {
                description: t("Your appointment has been successfully removed."),
                duration: 5000, 
            });

            // 4. Reset UI
            setIsCancelModalOpen(false);
            setFormData({ phoneNumber: '', note: '' });

        } catch (error) {
            console.error("Cancellation failed:", error);
            toast.error(t("Something went wrong. Please try again."));
        } finally {
            setIsLoading?.(false);
        }
    };

    return (
        <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
            <DialogTrigger render={
                <Button
                    type="button"
                    variant="destructive"
                    onClick={() => { }}
                    className="uppercase opacity-70 hover:opacity-100 shrink! whitespace-pre-wrap py-6 px-4"
                />
            }>
                {t('Cancel Reservation')}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-[3rem] p-10 border-none shadow-2xl">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-3xl font-black uppercase tracking-tighter leading-none">
                        {t('Cancel Reservation')}
                    </DialogTitle>
                    <p className="text-sm text-zinc-400 font-bold uppercase tracking-widest">
                        {t('Enter your phone number and we will request to cancel your appointments')}
                    </p>
                </DialogHeader>

                <div className="pt-4 pb-6 space-y-4">
                    <div className="relative">
                        <PatternFormat
                            format="### ### ###" // The # represents where the user can type a number
                            mask="_"             // Shows 07_ ___ ___ before they type
                            value={formData.phoneNumber || ''}
                            onValueChange={(values) => {
                                // values.value is the raw string (e.g. "070123456")
                                // values.formattedValue is the pretty string (e.g. "070 123 456")
                                setFormData({ ...formData, phoneNumber: values.value })
                            }}
                            // Standard input props
                            name="phone"
                            className="w-full p-4 rounded-2xl text-base bg-zinc-50 border-2 border-transparent focus:border-black outline-none transition-all font-semibold"
                            type="tel"
                            placeholder={`${t('Phone Number')}: ${Constants.CONTACT_NUMBER_SHORT}`}
                        />
                    </div>
                    <div className="relative">
                        <Textarea
                            placeholder={t('Reason why you want to cancel booking?')}
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            className="rounded-2xl bg-zinc-100 border-none font-bold min-h-32 resize-none p-6"
                        />
                    </div>
                </div>

                <DialogFooter className="sm:justify-start">
                    <Button
                        onClick={handleCancelSubmit}
                        disabled={isLoading || formData?.phoneNumber?.length !== 9}
                        className="w-full h-16 bg-black text-white rounded-[2rem] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20"
                    >
                        {t('Cancel it')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default CancelReservation;