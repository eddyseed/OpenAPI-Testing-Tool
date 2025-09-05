import express from "express";
import { upload } from "../lib/multer.js";
import { generateTestSummary } from "../controllers/test-summary.controller.js";

const router = express.Router();

// Applying the 'upload.single' middleware ONLY to this POST route.
router.post("/", upload.single("file"), generateTestSummary);

export default router;
