import mongoose from 'mongoose';

const HrSchema = mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  personalInfo: {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    mobileNumber: String,
  },
  profilePhoto: String,
  workDetails: {
    position: { type: String },
    companyName: { type: String, default: 'Joblify' },
  },
  jobsPosted: [],
});

const Hr = mongoose.model('Hr', HrSchema);
export default Hr;
