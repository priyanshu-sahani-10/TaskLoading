// routes/issue.route.js
import express from "express";
import { createIssue, getAllIssue, getUserIssues, toggleUpvote } from "../controllers/issue.controller.js";
import upload from "../utils/multer.js"; 
import isAuthenticated from "../middleware/isAuthenticated.js";
import { AdminRoute, updateIssue } from "../controllers/admin.contoller.js";

const router = express.Router();

router.route("/postIssue").post(isAuthenticated,upload.single("image"), createIssue);
router.route("/getIssue").get(getAllIssue); // Assuming you want to get all issues
router.route("/upvoteIssue/:issueId").put(isAuthenticated,toggleUpvote); // Placeholder for upvote functionality
router.route("/my-issues").get(isAuthenticated, getUserIssues); // Assuming you want to get issues reported by the authenticated user
router.route("/admin/updateIssues/:issueId").put(isAuthenticated,AdminRoute, updateIssue); // Placeholder for admin update functionality

export default router;
