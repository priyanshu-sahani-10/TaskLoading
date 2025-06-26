import express from "express";
import { createIssue } from "../controllers/issue.controller.js";

const router = express.Router();

router.route("/issue").post(createIssue);

export default router;
