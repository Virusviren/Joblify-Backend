import express from 'express';
// import dotenv from 'dotenv';
import cors from 'cors';
// import listEndPoints from 'express-list-endpoints';
import admin from './routes/admin/admin.js';
import authentication from './routes/authentication/authentication.js';
import candidate from './routes/candidate/candidate.js';
import hr from './routes/hr/hr.js';
import jobs from './routes/jobs/jobs.js';
import connectDB from './db.js';

const app = express();
app.use(cors());
app.options('*', cors());
connectDB();

// Init MiddleWare

app.use(express.json({ extended: false }));

//Define Routes
app.use('/api/v1/admin', admin); //done
app.use('/api/v1/', authentication); // done
app.use('/api/v1/candidate', candidate); // done
app.use('/api/v1/hr', hr); //done
app.use('/api/v1/', jobs); //done

// console.table(listEndPoints(app));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));
