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



export const deleteIssue = async (req, res) => {
  try {
    const { issueId } = req.params;
    const issue = await Issue.findById(issueId);
    console.log("Delete ID:", issueId);
    console.log("Issue found:", issue);

    if (!issue) {
      return res.status(404).json({ success: false, message: "Issue not found" });
    }

    // ✅ Check ownership using either req.user.id or req.id
    const userId = req.user?.id || req.id; 

    if (issue.reportedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this issue",
      });
    }

    await issue.deleteOne();
    res.status(200).json({ success: true, message: "Issue deleted successfully" });
  } catch (err) {
    console.error("Delete Issue Error:", err);
    res.status(500).json({ success: false, message: "Server error deleting issue" });
  }
};


export const updateUserIssue = async (req, res) => {
  try {
    const { issueId } = req.params;
    if (!req.body) req.body = {};
    const { title, description, category, status } = req.body;
    let location = req.body.location;

    if (location) {
      location = typeof location === "string" ? JSON.parse(location) : location;
    }

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ success: false, message: "Issue not found" });
    }

    // authorization check
    if (issue.reportedBy.toString() !== req.id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (title) issue.title = title;
    if (description) issue.description = description;
    if (category) issue.category = category;
    if (status) issue.status = status;
    if (location) issue.location = { type: "Point", coordinates: location.coordinates, address: location.address || "" };

    // handle image
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { resource_type: "auto", folder: "issues" });
      issue.imageUrl = result.secure_url;
    }

    await issue.save();

    res.status(200).json({ success: true, message: "Issue updated successfully!", data: issue });
  } catch (error) {
    console.error("❌ Issue update failed:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

