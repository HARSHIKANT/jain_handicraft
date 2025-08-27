import mongoose from "mongoose";

let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }; // Create the cache object, cnn => connection
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn; // Return the cached connection if it exists
    }
    if(!cached.promise) {
        const opts = {
            bufferCommands: false,
        }
        cached.promise = mongoose.connect(`${process.env.MONGODB_URI}/jain_handicraft`, opts).then((mongoose) => {
            return mongoose;
        }
        )
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectDB;