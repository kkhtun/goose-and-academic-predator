const mongoose = require("mongoose");
require("dotenv").config();

async function migrateRealmNames() {
    await mongoose.connect(process.env.MONGO_URI);

    const collections = ["quizzes", "info", "kb_chunks"];
    const migrations = [
        { from: "HEAVEN", to: "SAVELIST" },
        { from: "HELL", to: "WATCHLIST" },
    ];

    for (const collectionName of collections) {
        const collection = mongoose.connection.db.collection(collectionName);

        for (const { from, to } of migrations) {
            const result = await collection.updateMany(
                { realm: from },
                { $set: { realm: to } }
            );
            console.log(
                `${collectionName}: ${from} -> ${to}: ${result.modifiedCount} updated`
            );
        }
    }

    await mongoose.disconnect();
}

migrateRealmNames().catch(async (error) => {
    console.error("Realm migration failed:", error);
    await mongoose.disconnect();
    process.exit(1);
});
