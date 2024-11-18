import express from "express";
import {
  getSubjectList,
  getCourseList,
  getUnitList,
  getTopicList,
  getTopic,
  getSubjectHierarchy,
  getUnitAverageScore
} from "../controllers/util.js";

const router = express.Router();

router.get("/", getSubjectList);
router.get("/:subjectId", getCourseList);
router.get("/:subjectId/:courseId", getUnitList);
// router.get("/:subjectId/:courseId/quiz", getQuizList);
router.get("/:subjectId/:courseId/:unitId", getTopicList);
router.get("/:subjectId/:courseId/:unitId/:topicId", getTopic);
router.get("/subjectHeiarchy", getSubjectHierarchy);
router.get("/:unitId/getAverage", getUnitAverageScore)

export default router;