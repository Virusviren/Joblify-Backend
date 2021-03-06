import mongoose from 'mongoose';

const CandidateSchema = mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    personalInfo: {
      name: { type: String, required: true },
      surname: { type: String, required: true },
      dateOfBirth: String,
      citizenship: String,
      address: String,
      mobileNumber: String,
    },
    education: [
      {
        level: { type: String, required: true },
        universityName: { type: String, required: true },
        startingDate: { type: String, required: true },
        endingDate: String,
      },
    ],

    workExperience: [
      {
        companyName: { type: String, required: true },
        position: { type: String, required: true },
        description: { type: String, required: true },
        endingDate: String,
        startingDate: { type: String, required: true },
      },
    ],
    skills: [],
    cv: String,
    coverLetter: String,
    infoVideo: String,
    profilePhoto: String,
    appliedJobs: [{ applicationId: String, jobId: String }],
  },
  { timestamps: true }
);

const Candidate = mongoose.model('Candidate', CandidateSchema);
export default Candidate;
