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
            .where("reminderSent", "==", false) // <--- 1. ONLY GET THOSE NOT YET REMINDED
            .get();

        if (snapshot.empty) return;

        const messages = [];
        const docIds = [];

        snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.status === 'cancelled') return;

            const date = scheduledAt?.toDate ? scheduledAt.toDate() : new Date(scheduledAt || '');
            const time = format(date, "HH:mm");

            if (data.fcmToken) {
                docIds.push(doc.id); // Track which IDs we are messaging
                messages.push({
                    token: data.fcmToken,
                    notification: {
                        title: "Saqo Hair Salon",
                        body: `Përshendetje ${data.customerName}:\n\nRikujtim për terminin tuaj sot në orën ${time} tek saloni jonë, shihemi!`,
                    },
                    webpush: {
                        headers: { Urgency: "high" },
                        notification: {
                            icon: '/android-chrome-192x192.png',
                            badge: '/favicon.ico',
                            tag: 'appointment-reminder',
                            requireInteraction: true,
                        },
                        fcmOptions: { link: "/" },
                    },
                    android: { priority: "high" },
                    apns: {
                        payload: { aps: { "content-available": 1, sound: "default" } },
                    },
                });
            }
        });

        if (messages.length > 0) {
            const response = await admin.messaging().sendEach(messages);

            // 2. MARK AS SENT IN FIRESTORE SO THEY DON'T GET IT AGAIN
            const batch = db.batch();
            response.responses.forEach((res, idx) => {
                if (res.success) {
                    const ref = db.collection("appointments").doc(docIds[idx]);
                    batch.update(ref, { reminderSent: true });
                }
            });
            await batch.commit();

            logger.info(`Sent ${response.successCount} reminders.`);
        }
    } catch (error) {
        logger.error("Error:", error);
    }
});