import Subject from "../models/Subject";
import Course from "../models/Course"
import Unit from "../models/Unit";
import Quiz from "../models/Quiz";
import Topic from "../models/Topic";

export const getSubjectList = async(req,res) => {
    try {
        const subjectList = await Subject.find();
        res.status(200).json(subjectList);
    } catch(err) {
        res.status(404).json({ message : err.message });
    }
};

export const getCourseList = async(req,res) => {
    try {
        const { subjectId } = req.params;
        const subject = await Subject.findById(subjectId);
        const courseListIds = subject.courseList;
        const courseList = await Promise.all(
            courseListIds.map((id) => Course.findById(id))
        );
        res.status(200).json(courseList);
    } catch(err) {
        res.status(404).json({ message : err.message });
    }
};

export const getUnitList = async(req,res) => {
    try {
        const { subjectId , courseId } = req.params;
        const course = await Course.findById(courseId);
        const unitListIds = course.unitList;
        const unitList = await Promise.all(
            unitListIds.map((id) => Unit.findById(id))
        );
        res.status(200).json(unitList);

    } catch(err) {
        res.status(404).json({ message : err.message });
    }
};

export const getQuiz = async(req,res) => {
    try {
        const { subjectId , courseId } = req.params;
        const course = await Course.findById(courseId);
        const quizListIds = course.quizList;
        const quizList = await Promise.all(
            quizListIds.map((id) => Quiz.findById(id))
        )
        res.status(200).json(quizList);
    } catch(err) {
        res.status(404).json({ message : err.message });
    }
};

export const getTopicList = async(req,res) => {
    try {
        const { subjectId , courseId , unitId} = req.params;
        const unit = await Unit.findById(unitId);
        const topicListIds = unit.topicList;
        const topicList = await Promise.all(
            topicListIds.map((id) => Topic.findById(id))   
        );
        res.status(200).json(topicList);

    } catch(err) {
        res.status(404).json({ message : err.message });
    }
};

export const getTopic = async(req,res) => {
    try {
        const { subjectId , courseId , unitId , topicId } = req.params;
        const topic = await Topic.findById(topicId);
        res.status(200).json(topic);
    } catch(err) {
        res.status(404).json({ message : err.message });
    }
};