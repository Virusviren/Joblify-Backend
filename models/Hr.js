import mongoose from 'mongoose';

const HrSchema = {
  email: { type: String, required: true },
  password: { type: String, required: true },
  personalInfo: {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    mobileNumber: { type: String, required: true },
  },
  profilePhoto: { type: String, required: true },
  workDetails: [
    {
      position: { type: String, required: true },
      companyName: { type: String, required: true },
    },
  ],
  jobsPosted: [{ jobId: { type: String, required: true } }],
};

const Hr = mongoose.model('Hr', HrSchema);
export default Hr;
