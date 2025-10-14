// import { type } from "os";
import Issue from "../models/issue.model.js";
import cloudinary from "../utils/cloudinary.js";

// import Issue from "../models/issue.model.js";
// import cloudinary from "../utils/cloudinary.js";
import stringSimilarity from "string-similarity";

export const createIssue = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let parsedLocation;
    try {
      parsedLocation = typeof location === "string" ? JSON.parse(location) : location;
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid location format",
      });
    }

    if (!parsedLocation.coordinates || parsedLocation.coordinates.length !== 2) {
      return res.status(400).json({
        success: false,
        message: "Invalid coordinates",
      });
    }

    const geoLocation = {
      type: "Point",
      coordinates: parsedLocation.coordinates,
      address: parsedLocation.address || "",
    };

    const RADIUS_IN_METERS = 50;

    // 1️⃣ Find nearby issues in same category (within 50 meters)
    const nearbyIssues = await Issue.find({
      category,
      location: {
        $nearSphere: {
          $geometry: geoLocation,
          $maxDistance: RADIUS_IN_METERS,
        },
      },
    });

    // 2️⃣ Check fuzzy similarity for title & description
    const SIMILARITY_THRESHOLD = 0.7; // 0.7 = 70% similarity

    const duplicate = nearbyIssues.find((issue) => {
      const titleSimilarity = stringSimilarity.compareTwoStrings(
        title.toLowerCase(),
        issue.title.toLowerCase()
      );
      const descSimilarity = stringSimilarity.compareTwoStrings(
        description.toLowerCase(),
        issue.description.toLowerCase()
      );
      return titleSimilarity > SIMILARITY_THRESHOLD || descSimilarity > SIMILARITY_THRESHOLD;
    });

    if (duplicate) {
      return res.status(201).json({
        success: true,
        isDuplicate:true,
        message:
          "A similar issue has already been reported nearby. Please check before submitting.",
      });
    }

    // 3️⃣ Upload image to Cloudinary if provided
    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto",
        folder: "issues",
      });
      imageUrl = result.secure_url;
    }

    // 4️⃣ Create issue
    const newIssue = await Issue.create({
      title,
      description,
      category,
      location: geoLocation,
      imageUrl,
      reportedBy: req.id,
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

