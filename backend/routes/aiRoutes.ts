import { Router } from "express";
import { generateAdCopy } from "../controllers/aiController";

const router = Router();

router.post("/generate-copy", generateAdCopy);

export default router;