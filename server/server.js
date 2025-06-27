import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import userRoutes from './routes/user.route.js';
import issueRoutes from './routes/issue.route.js';
import bodyParser from 'body-parser';

dotenv.config({});
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Route registration
app.use("/api/v1/user", userRoutes);
app.use('/api/v1/user', issueRoutes); 

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
