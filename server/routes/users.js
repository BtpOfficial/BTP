import express from "express";
import {
  markComplete,
  verifyQuiz,
  addTopic,
  addUnit,
  addOrUpdateQuiz,
  addCourse,
  addSubject,
  deleteTopic,
  deleteUnit,
  deleteCourse,
  deleteSubject,
  getQuiz
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/:subjectId/:courseId/:unitId/:topicId/read", markComplete);
router.post("/:topicId/:quizId/verify", verifyQuiz);
router.post("/:subjectId/:courseId/:unitId/add", addTopic);
router.post("/:subjectId/:courseId/add", addUnit);
router.post("/:topicId/addorupdatequiz", addOrUpdateQuiz);
// router.get("/:quizId/verifyquiz",verifyQuiz);
router.get("/:topicId/getquiz", getQuiz);
router.post("/:subjectId/add", addCourse);
router.post("/add", addSubject);

router.post("/:subjectId/:courseId/:unitId/:topicId/delete", deleteTopic);
router.post("/:subjectId/:courseId/:unitId/delete", deleteUnit);
router.post("/:subjectId/:courseId/delete", deleteCourse);
router.post("/:subjectId/delete", deleteSubject);

export default router;