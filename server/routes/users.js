import express from "express";
import {
  markComplete,
  markCompleteQuestion
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/:subjectId/:courseId/:unitId/:topicId/read",verifyToken,markComplete);
router.post("/:subjectId/:courseId/:quizId/quiz",verifyToken,markCompleteQuestion);

export default router;