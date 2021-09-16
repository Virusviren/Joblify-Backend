import mongoose from 'mongoose';

const db = process.env.MONGOURI;

const connectDB = async () => {
  try {
    console.log(db);
    await mongoose.connect(`${db}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default connectDB;
