//  This file contains the admin controller for managing issues in the application.

import Issue from "../models/issue.model.js";

export const AdminRoute = (req, res,next) => {
  
  const role = req.user.role;
  if (role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};



export const updateIssue = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["Pending", "In Progress", "Resolved"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedIssue = await Issue.findByIdAndUpdate(
      issueId,
      { status },
      { new: true }
    );

    if (!updatedIssue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res
      .status(200)
      .json({ message: "Issue status updated", data: updatedIssue });
  } catch (err) {
    console.error("Update issue error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
