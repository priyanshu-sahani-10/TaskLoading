// routes/issue.route.js
import express from "express";
import { createIssue, getAllIssue, toggleUpvote } from "../controllers/issue.controller.js";
import upload from "../utils/multer.js"; 
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/postIssue").post(upload.single("image"), createIssue);
router.route("/getIssue").get(getAllIssue); // Assuming you want to get all issues
router.route("/upvoteIssue/:issueId").put(isAuthenticated,toggleUpvote); // Placeholder for upvote functionality

export default router;
