import { useEffect, useState } from "react";

import { subscribeToExceptions, subscribeToGlobalSettings } from "@/services/settings";

export function useBerberSettings() {

    const [globalHours, setGlobalHours] = useState<IGlobalSettings>({ open: "10:00", close: "20:00" });
    const [exceptions, setExceptions] = useState<IScheduleException[]>([]);

    useEffect(() => {
        const unsubGlobal = subscribeToGlobalSettings(setGlobalHours);
        const unsubEx = subscribeToExceptions(setExceptions);
        return () => { unsubGlobal(); unsubEx(); };
    }, []);

    // Return them in the hook object
    return { globalHours, exceptions };
}