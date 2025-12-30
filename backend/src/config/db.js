import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("DATABASE SUCCESSFULLY CONNECTED");
    } catch (error) {
        console.error("Error in connecting to database", error);
        process.exit(1);
    }
}