import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import userRoutes from './routes/user.route.js';
import issueRoutes from './routes/issue.route.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS first
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true
}));

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/issue", issueRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
