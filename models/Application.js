import mongoose from 'mongoose';
import Candidate from './Candidate';
import Job from './Job';

const ApplicationSchema = mongoose.Schema({
  applicationId: { type: String, required: true },
  candidateId: { type: mongoose.ObjectId, ref: Candidate },
  jobId: { type: mongoose.ObjectId, ref: Job },
  details: {
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
        endingDate: { type: Date, required: true },
      },
    ],
    workExperience: [
      {
        companyName: String,
        position: String,
        startingDate: Date,
        endingDate: Date,
        description: String,
      },
    ],
    skills: [String],
    documents: [
      {
        cv: { type: String, required: true },
        coverLetter: { type: String, required: true },
      },
    ],
    infoVideo: String,
    profilePhoto: String,
    email: { type: String, required: true },
  },
});

const Application = mongoose.model('Application', ApplicationSchema);

export default Application;
