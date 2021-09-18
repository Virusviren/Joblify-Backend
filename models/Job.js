import mongoose from 'mongoose';

const JobSchema = {
  jobId: { type: String, required: true },
  details: {
    companyInfo: {
      logo: { type: String, required: true },
      name: { type: String, required: true },
      address: { type: String, required: true },
    },
  },
  overView: { type: String, required: true },
  requirement: { type: String, required: true },
  experience: { type: String, required: true },
  seniorityLevel: { type: String, required: true },
  type: { type: String, required: true },
  salary: { type: String, required: true },
  hrId: { type: String, required: true },
  candidates: [{ candidateId: String }],
};

const Job = mongoose.model('Job', JobSchema);
export default Job;
