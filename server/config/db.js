import mongoose from 'mongoose';
import Issue from '../models/issue.model.js'; // import your Issue model

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected`);

    // ✅ Sync indexes for Issue collection
    await Issue.syncIndexes();
    console.log('Indexes synced for Issue collection');

  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1); // exit on connection failure
  }
};

export default connectDB;
