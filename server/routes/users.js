import express from "express";
import {
  markComplete,
  markCompleteQuestion,
  addTopic,
  addUnit,
  addQuiz,
  addCourse,
  addSubject
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/:subjectId/:courseId/:unitId/:topicId/read", verifyToken, markComplete);
router.post("/:subjectId/:courseId/:quizId/quiz", verifyToken, markCompleteQuestion);
router.post("/:subjectId/:courseId/:unitId/add", verifyToken, addTopic);
router.post("/:subjectId/:courseId/add", verifyToken, addUnit);
router.post("/:subjectId/:courseId/add/quiz", verifyToken, addQuiz);
router.post("/:subjectId/add", verifyToken, addCourse);
router.post("/add", verifyToken, addSubject);


export default router;