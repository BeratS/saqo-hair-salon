import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PatternFormat } from "react-number-format";

import { Constants } from "@/Constants";
import { submitCancellation } from "@/services/cancellations";
import { removeSpaces } from "@/utils/helper";

import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Textarea } from "../ui/textarea";

function CancelReservation() {
    const { t } = useTranslation();

    // Inside PickBarbers function
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        phoneNumber: '',
        note: '',
    });

    const handleCancelSubmit = async () => {
        await submitCancellation({
            phoneNumber: removeSpaces(formData.phoneNumber),
            note: formData.note,
        })
        // Reset
        setIsCancelModalOpen(false);
        setFormData({
            phoneNumber: '',
            note: '',
        })
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
                        disabled={!formData.phoneNumber}
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