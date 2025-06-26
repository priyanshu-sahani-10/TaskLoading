import Issue from "../models/issue.model.js";

export const createIssue = async (req, res) => {
  try {
    const { title, description, category, location, imageUrl } = req.body;

    if (!title || !description || !category || !location ||!image) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled.",
      });
    }

    const newIssue = await Issue.create({
      title,
      description,
      category,
      location,
      imageUrl,
      reportedBy: req.user._id, // assuming middleware adds user to req
    });

    res.status(201).json({
      success: true,
      message: "Issue reported successfully!",
      issue: newIssue,
    });
  } catch (error) {
    console.error("Error creating issue:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Could not report issue.",
    });
  }
};
