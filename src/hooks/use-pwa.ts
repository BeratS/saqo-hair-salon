import { useEffect, useState } from 'react';

const getIsIOS = () => {
    if (typeof window === 'undefined') return false;
    return /iPhone|iPad|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
};

const getIsStandalone = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
};

export function usePWA() {
    const [installPrompt, setInstallPrompt] = useState<any>(null);
    const [isIOS] = useState<boolean>(getIsIOS());
    const [isStandalone, setIsStandalone] = useState<boolean>(getIsStandalone());

    useEffect(() => {
        // 1. Capture the Install Prompt (Android/Chrome)
        const handleInstallPrompt = (e: any) => {
            e.preventDefault();
            setInstallPrompt(e);
        };

        // 2. Modern Listener for Display Mode Changes
        const mediaQuery = window.matchMedia('(display-mode: standalone)');

        const handleDisplayChange = (e: MediaQueryListEvent) => {
            setIsStandalone(e.matches);
        };

        // Use the standard addEventListener instead of addListener
        window.addEventListener('beforeinstallprompt', handleInstallPrompt);
        mediaQuery.addEventListener('change', handleDisplayChange);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
            mediaQuery.removeEventListener('change', handleDisplayChange);
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