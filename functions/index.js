const functions = require("firebase-functions");
const admin = require("firebase-admin");
 admin.initializeApp();

exports.deleteOldData = functions.pubsub
  .schedule("every day 00:00")
  .timeZone("Europe/Zurich")
  .onRun(async (context) => {
    const db = admin.firestore();
    const currentDate = new Date();

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(currentDate.getMonth() - 1);

    // Delete old reservations
    const reservationSnapshot = await db
      .collection("reservations_Test")
      .where("date", "<", oneMonthAgo)
      .get();

    const reservationBatch = db.batch();
    reservationSnapshot.forEach((doc) => {
      reservationBatch.delete(doc.ref);
    });

    await reservationBatch.commit();

    // Update capacity arrays
    const roomSnapshot = await db.collection("rooms_Test").get();

    const roomBatch = db.batch();

    roomSnapshot.forEach((roomDoc) => {
      const roomData = roomDoc.data();
      if (roomData.capacity) {
        const updatedCapacity = {};

        Object.keys(roomData.capacity).forEach((dateString) => {
          const array = roomData.capacity[dateString];
          const arrayDate = new Date(dateString);

          if (arrayDate >= oneMonthAgo) {
            updatedCapacity[dateString] = array;
          }
        });

        roomBatch.update(roomDoc.ref, { capacity: updatedCapacity });
      }
    });

    await roomBatch.commit();
  });
