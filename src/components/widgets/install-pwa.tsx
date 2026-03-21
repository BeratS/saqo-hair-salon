import { getToken } from 'firebase/messaging';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { usePWA } from '@/hooks/use-pwa';
import { messaging } from '@/lib/firebase';

import { Button } from '../ui/button';

export function InstallPWA() {
    const { installPrompt, isIOS, isStandalone, handleInstallClick } = usePWA();
    const { t } = useTranslation();

    useEffect(() => {
        const setupNotifications = async () => {
            try {
                // Only run on browsers that support it
                if (!('Notification' in window) || !messaging) return;

                const permission = await Notification.requestPermission();

                if (permission === 'granted') {
                    const token = await getToken(messaging, {
                        vapidKey: 'BOlg5LWWqRZPq3VLP2ubFSroYLACt_4q8AXlOTALcJsGfjxIXn5YItXAFAtNvm4zcdzRa0UDDxfQCJPXj5TkLSk'
                    });
                    // Store this in a ref or state so you can 
                    // attach it to the booking later
                    // console.log("FCM Token:", token);
                    localStorage.setItem('fcm_token', token);
                }
            } catch (err) {
                console.error("Notification setup failed", err);
            }
        };

        setupNotifications();
    }, []);

    // useEffect(() => {
    //     if (!messaging) return 
    //     const unsubscribe = onMessage(messaging, (payload) => {
    //         console.log('Foreground message received: ', payload);
    //         // Custom Toast or Alert for Saqo Salon
    //         alert(`Reminder: ${payload.notification?.body}`);
    //     });

    //     return () => unsubscribe();
    // }, []);

    // If they already installed it, show nothing
    if (isStandalone) return null;

    if (installPrompt) {
        return (
            <Button
                type="button"
                className="min-h-11 bg-green-700 hover:bg-green-800"
                onClick={handleInstallClick}>
                {t('Install App')}
            </Button>
        )
    }

    if (isIOS) {
        return (
            <p className="text-center">
                {t("To install: tap Share and 'Add to Home Screen'")}
            </p>
        )
    }

    return null
}
