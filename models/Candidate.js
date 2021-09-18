import mongoose from 'mongoose';

const CandidateSchema = {
  email: { type: String, required: true },
  password: { type: String, required: true },
  personalInfo: {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    citizenship: { type: String, required: true },
    address: { type: String, required: true },
    mobileNumber: { type: String, required: true },
  },
  education: [
    {
      level: { type: String, required: true },
      universityName: { type: String, required: true },
      startingDate: { type: Date, required: true },
      endingDate: { type: Date, required: false },
    },
  ],

  workExperience: [
    {
      companyName: { type: String, required: true },
      position: { type: String, required: true },
      description: { type: String, required: true },
      endingDate: { type: Date, required: true },
      startingDate: { type: Date, required: true },
    },
  ],
  skills: [],
  documents: [{ cv: String, coverLetter: String }],
  infoVideo: String,
  profilePhoto: String,
  profilePhoto: String,
  appliedJobs: [{ applicationId: String, jobId: String }],
};

const Candidate = mongoose.model('Candidate', CandidateSchema);
export default Candidate;
