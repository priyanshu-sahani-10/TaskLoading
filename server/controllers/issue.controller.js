import { type } from "os";
import Issue from "../models/issue.model.js";
import cloudinary from "../utils/cloudinary.js";


export const createIssue = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    if (!title || !description || !category || !location) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    let imageUrl = "";

    // Check for file upload
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto",
        folder: "civic-issues",
      });
      imageUrl = result.secure_url;
    }

    const newIssue = await Issue.create({
      title,
      description,
      category,
      location,
      image: imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Issue reported successfully",
      data: newIssue,
    });
  } catch (error) {
    console.error("Issue creation failed:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
