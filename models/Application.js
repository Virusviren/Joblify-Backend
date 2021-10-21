import mongoose from 'mongoose';
import Candidate from './Candidate.js';
import Job from './Job.js';

const ApplicationSchema = mongoose.Schema(
  {
    candidateId: { type: mongoose.ObjectId, ref: Candidate },
    jobId: { type: mongoose.ObjectId, ref: Job },
    jobTitle: { type: String, required: true },
    status: { type: Number, default: 1 },
    jobCompanyName: { type: String, required: true },
    personalInfo: {
      name: { type: String, required: true },
      surname: { type: String, required: true },
      dateOfBirth: { type: String, required: true },
      citizenship: { type: String, required: true },
      address: { type: String, required: true },
      mobileNumber: { type: String, required: true },
    },
    education: [
      {
        level: { type: String, required: true },
        universityName: { type: String, required: true },
        startingDate: { type: String, required: true },
        endingDate: { type: String, required: true },
      },
    ],
    workExperience: [
      {
        companyName: String,
        position: String,
        startingDate: String,
        endingDate: String,
        description: String,
      },
    ],
    skills: [String],

    email: { type: String, required: true },

    cv: String,
    coverLetter: String,
    infoVideo: String,
  },
  { timestamps: true }
);

const Application = mongoose.model('Application', ApplicationSchema);

export default Application;
