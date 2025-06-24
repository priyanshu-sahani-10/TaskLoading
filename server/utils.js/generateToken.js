import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

export const generateToken = (res, user, message) => {

  if (!process.env.SECRET_KEY) {
    console.error("❌ SECRET_KEY is not defined in environment variables");
    return res.status(500).json({ success: false, message: "Server misconfiguration" });
  }
  
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    }).json({
        success:true,
        message,
        user
    });
};