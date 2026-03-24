import { getToken } from 'firebase/messaging';
import { useEffect } from 'react';

import { getMessagingInstance } from '@/lib/firebase';


export function useGrantNotifications() {
    useEffect(() => {
        const setupNotifications = async () => {
            try {
                const messaging = await getMessagingInstance()

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
}
