const mongoose = require('mongoose');

const uri = "mongodb+srv://maximus70911:Harshi70911@cluster0.h6azr5x.mongodb.net/jain_handicraft";

async function testConnection() {
    try {
        console.log("Attempting to connect...");
        await mongoose.connect(uri);
        console.log("✅ Connection Successful!");

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Found collections:");
        collections.forEach(c => console.log(" - " + c.name));

        await mongoose.disconnect();
    } catch (error) {
        console.error("❌ Connection Failed:", error.message);
    }
}

testConnection();
