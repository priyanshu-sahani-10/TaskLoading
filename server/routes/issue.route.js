// routes/issue.route.js
import express from "express";
import { createIssue } from "../controllers/issue.controller.js";
import upload from "../utils/multer.js"; 

const router = express.Router();

router.route("/issue").post(upload.single("image"), createIssue);

export default router;
