import express from "express";
import { upload } from "../lib/multer.js";
import { processApiSchema } from "../controllers/api-schema.controller.js";

const router = express.Router();

// Applying the 'upload.single' middleware ONLY to this POST route.
router.post("/", upload.single("file"), processApiSchema);

export default router;
