import mongoose from 'mongoose';

const JobSchema = mongoose.Schema(
  {
    jobTitle: String,
    details: {
      companyInfo: {
        logo: { type: String, required: true, default: 'Strive logo' },
        name: { type: String, required: true, default: 'Strive School' },
        address: { type: String, required: true, default: 'Germany Berlin' },
      },
    },
    overview: { type: String, required: true },
    requirements: { type: String, required: true },
    experience: { type: String, required: true },
    seniorityLevel: { type: String, required: true },
    type: { type: String, required: true },
    salary: { type: String, required: true },
    hrId: { type: String, required: true },

    applicationsReceived: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
    ],
  },
  { timestamps: true }
);

const Job = mongoose.model('Job', JobSchema);
export default Job;
