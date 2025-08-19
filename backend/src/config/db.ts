import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }
    
    console.log('Attempting to connect to MongoDB...');
    
    // Add connection options for better debugging
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 1,
    };
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    console.error('Please check your MONGODB_URI in .env file');
    console.error('Common issues:');
    console.error('- Wrong username/password');
    console.error('- Special characters in password need URL encoding');
    console.error('- Wrong authentication database (should be "admin" for Atlas)');
    console.error('- IP not whitelisted in Atlas Network Access');
    process.exit(1);
  }
};

export default connectDB;