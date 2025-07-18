import { type } from "os";
import Issue from "../models/issue.model.js";
import cloudinary from "../utils/cloudinary.js";

export const createIssue = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let Url = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto",
        folder: "issues", // optional
      });
      Url = result.secure_url;
    }

    const newIssue = await Issue.create({
      title,
      description,
      category,
      location,
      imageUrl: Url,
      reportedBy: req.id, // Assuming req.id contains the user ID
    });

    return res.status(201).json({
      success: true,
      message: "Issue reported successfully",
      data: newIssue,
    });
  } catch (error) {
    console.error("❌ Issue creation failed:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getAllIssue = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate("reportedBy", "name ")
      .sort({ createdAt: -1 });

    if (!issues || issues.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No issues found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Issues fetched successfully",
      data: issues,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//// Function to toggle upvote on an issue

export const toggleUpvote = async (req, res) => {
  try {
    const userId = req.id;
    const { issueId } = req.params;

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res
        .status(404)
        .json({ success: false, message: "Issue not found" });
    }

    const alreadyVoted = issue.upvotes.includes(userId);

    if (alreadyVoted) {
      issue.upvotes.pull(userId); // remove vote
    } else {
      issue.upvotes.push(userId); // add vote
    }

    await issue.save();

    return res.status(200).json({
      success: true,
      message: alreadyVoted ? "Upvote removed" : "Upvoted successfully",
      totalVotes: issue.upvotes.length,
    });
  } catch (error) {
    console.error("Upvote failed:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during upvote",
    });
  }
};

export const getUserIssues = async (req, res) => {
  try {
    const userId = req.id;
    const { status } = req.query;

    const filter = { reportedBy: userId };
    if (status) filter.status = status;

    const issues = await Issue.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Fetched user issues",
      data: issues,
    });
  } catch (err) {
    console.error("User issue fetch error", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getSingleIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.issueId);
    if (!issue) {
      return res.status(404).json({ success: false, message: "Issue not found" });
    }
    res.status(200).json({ success: true, data: issue }); // ✅ THIS is needed
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

