import { useEffect, useState } from 'react';

import { getIsIOS } from '@/utils/helper';

const getIsStandalone = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
};

export function usePWA() {
    const [installPrompt, setInstallPrompt] = useState<any>(null);
    const [isIOS, setIsIOS] = useState<boolean>(false); // Start false for SSR safety
    const [isStandalone, setIsStandalone] = useState<boolean>(false);

    useEffect(() => {
        // Run checks only on mount (client-side)
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsIOS(getIsIOS());
        setIsStandalone(getIsStandalone());

        // 1. Capture the Install Prompt (Android/Chrome)
        const handleInstallPrompt = (e: any) => {
            e.preventDefault();
            setInstallPrompt(e);
        };

        // 2. Listener for Display Mode Changes
        const mediaQuery = window.matchMedia('(display-mode: standalone)');
        const handleDisplayChange = (e: MediaQueryListEvent) => {
            setIsStandalone(e.matches);
        };

        window.addEventListener('beforeinstallprompt', handleInstallPrompt);
        mediaQuery.addEventListener('change', handleDisplayChange);

        // 3. Detect "appinstalled" event (Optional but clean)
        const handleAppInstalled = () => {
            setInstallPrompt(null);
            setIsStandalone(true);
            console.log("Saqo App was installed!");
        };
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
            mediaQuery.removeEventListener('change', handleDisplayChange);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!installPrompt) return;

        await installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;

        if (outcome === 'accepted') {
            setInstallPrompt(null);
        }
    };

    return { installPrompt, isIOS, isStandalone, handleInstallClick };
}