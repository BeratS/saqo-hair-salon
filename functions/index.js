const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { setGlobalOptions } = require("firebase-functions/v2");
const { onSchedule } = require("firebase-functions/v2/scheduler");

admin.initializeApp();

// Setting region to europe-west1 (Belgium) which is great for Skopje
setGlobalOptions({
    maxInstances: 10,
    region: "europe-west1"
});

exports.appointmentReminder = onSchedule("every 5 minutes", async (event) => {
    const db = admin.firestore();
    const now = Date.now();

    // We look for appointments starting 30 to 35 minutes from now
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
            
            if (data.status === 'cancelled') return;

            // Important: This depends on you saving the token in your React app
            if (data.fcmToken) {
                messages.push({
                    notification: {
                        title: "Saqo Hair Salon",
                        body: `Reminder: Your appointment is in 30 minutes!`,
                    },
                    token: data.fcmToken,
                    webpush: {
                        fcmOptions: {
                            link: "/", // Opens your PWA when clicked
                        },
                    },
                });
            }
        });

        if (messages.length > 0) {
            const response = await admin.messaging().sendEach(messages);
            logger.info(`Successfully sent ${response.successCount} reminders.`);
        }
    } catch (error) {
        logger.error("Error sending reminders:", error);
    }
});