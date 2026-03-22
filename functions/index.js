const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { setGlobalOptions } = require("firebase-functions/v2");
const { onSchedule } = require("firebase-functions/v2/scheduler");

admin.initializeApp();

setGlobalOptions({
    maxInstances: 10,
    region: "europe-west1"
});

exports.appointmentReminder = onSchedule("every 5 minutes", async (event) => {
    const db = admin.firestore();
    const now = Date.now();

    const thirtyMinFromNow = now + (30 * 60 * 1000);
    const thirtyFiveMinFromNow = now + (35 * 60 * 1000);

    const startTime = admin.firestore.Timestamp.fromMillis(thirtyMinFromNow);
    const endTime = admin.firestore.Timestamp.fromMillis(thirtyFiveMinFromNow);

    try {
        const snapshot = await db.collection("appointments")
            .where("scheduledAt", ">=", startTime)
            .where("scheduledAt", "<=", endTime)
            .get();

        if (snapshot.empty) {
            logger.info("No appointments found for the 30-minute window.");
            return;
        }

        const messages = [];

        snapshot.forEach((doc) => {
            const data = doc.data();
            
            // Bypass logic: Only skip if explicitly cancelled
            if (data.status === 'cancelled') return;

            if (data.fcmToken) {
                messages.push({
                    token: data.fcmToken,
                    notification: {
                        title: "Saqo Hair Salon",
                        body: `Reminder: Your appointment is in 30 minutes!`,
                    },
                    // --- HIGH PRIORITY FOR WEB/PWA ---
                    webpush: {
                        headers: {
                            Urgency: "high" // Tell the browser this is urgent
                        },
                        notification: {
                            icon: '/android-chrome-192x192.png',
                            badge: '/favicon.ico',
                            tag: 'appointment-reminder', // Groups same notifications
                            requireInteraction: true, // Stays on screen
                        },
                        fcmOptions: {
                            link: "/", 
                        },
                    },
                    // --- HIGH PRIORITY FOR ANDROID DEVICES ---
                    android: {
                        priority: "high",
                    },
                    // --- HIGH PRIORITY FOR iOS DEVICES ---
                    apns: {
                        payload: {
                            aps: {
                                "content-available": 1,
                                sound: "default",
                            },
                        },
                    },
                });
            }
        });

        if (messages.length > 0) {
            // sendEach is the correct modern method for multiple messages
            const response = await admin.messaging().sendEach(messages);
            logger.info(`Successfully sent ${response.successCount} reminders. Failures: ${response.failureCount}`);
            
            // Clean up old tokens if they failed
            response.responses.forEach((res, idx) => {
                if (!res.success) {
                    logger.error(`Token ${messages[idx].token} failed with: ${res.error.message}`);
                }
            });
        }
    } catch (error) {
        logger.error("Error sending reminders:", error);
    }
});