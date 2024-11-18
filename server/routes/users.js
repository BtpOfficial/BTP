import express from "express";
import {
  addCourse,
  addOrUpdateQuiz,
  addSubject,
  addTopic,
  addUnit,
  deleteCourse,
  deleteSubject,
<<<<<<< Updated upstream
  deleteTopic,
  deleteUnit,
  getQuiz,
  verifyQuiz
=======
  getQuiz,
  assessMe
>>>>>>> Stashed changes
} from "../controllers/users.js";

const router = express.Router();

<<<<<<< Updated upstream
router.post("/:topicId/verify", verifyQuiz);
=======
router.post("/assessMe",assessMe)
router.post("/:topicId/:quizId/verify", verifyQuiz);
>>>>>>> Stashed changes
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