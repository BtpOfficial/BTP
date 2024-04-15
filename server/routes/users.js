import express from "express";
import {
  markComplete,
  markCompleteQuestion,
  addTopic,
  addUnit,
  addQuiz,
  addCourse,
  addSubject,
  delTopic,
  delUnit,
  delCourse,
  delSubject
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/:subjectId/:courseId/:unitId/:topicId/read", verifyToken, markComplete);
router.post("/:subjectId/:courseId/:quizId/quiz", verifyToken, markCompleteQuestion);
router.post("/:subjectId/:courseId/:unitId/add", addTopic);
router.post("/:subjectId/:courseId/add",  addUnit);
router.post("/:subjectId/:courseId/add/quiz", addQuiz);
router.post("/:subjectId/add",addCourse);
router.post("/add", addSubject);

router.post("/:subjectId/:courseId/:unitId/:topicId/delete", delTopic);
router.post("/:subjectId/:courseId/:unitId/delete", delUnit);
router.post("/:subjectId/:courseId/delete", delCourse);
router.post("/:subjectId/delete", delSubject);

export default router;