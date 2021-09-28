import mongoose from 'mongoose';

const db = process.env.MONGOURI;

const connectDB = async () => {
  try {
    await mongoose.connect(`${db}`);

    console.log('MongoDB connected');
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default connectDB;
