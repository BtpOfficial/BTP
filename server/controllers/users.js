import Course from "../models/Course.js";
import Subject from "../models/Subject.js";
import Topic from "../models/Topic.js";
import Unit from "../models/Unit.js";
import User from "../models/User.js";

export const markComplete = async (req, res) => {
    try {
        const { subjectId, courseId, unitId, topicId } = req.params;
        const { userId } = req.body;
        const user = await User.findById(userId);
        let progress = user.progress || [];
        let t = -1;
        for (let i = 0; i < progress.length; i++) {
            if (progress[i].subjectId === subjectId) {
                t = i;
                break;
            }
        }
        if (t === -1) {
            progress.push({
                subjectId,
                courseList: [],
            })
            t = progress.length - 1;
        };

        progress = progress[t].courseList;
        t = -1;
        for (let i = 0; i < progress.length; i++) {
            if (progress[i].courseId === courseId) {
                t = i;
                break;
            }
        }
        if (t === -1) {
            progress.push({
                courseId,
                unitList: [],
                quizList: [],
            })
            t = progress.length - 1;
        }

        progress = progress[t].unitList;
        t = -1;
        for (let i = 0; i < progress.length; i++) {
            if (progress[i].unitId === unitId) {
                t = i;
                break;
            }
        }
        if (t === -1) {
            progress.push({
                unitId,
                topicList: [],
            })
            t = progress.length - 1;
        }

        progress = progress[t].topicList;
        t = progress.indexOf(topicId);
        if (t === -1) {
            progress.push(topicId);
        }

        const final_user = await user.save();
        res.status(201).json(final_user);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const markCompleteQuestion = async (req, res) => {
    try {
        const { subjectId, courseId, quizId } = req.params;
        const { userId } = req.body;
        const user = await User.findById(userId);

        let progress = user.progress || [];
        let t = -1;
        for (let i = 0; i < progress.length; i++) {
            if (progress[i].subjectId === subjectId) {
                t = i;
                break;
            }
        }
        if (t === -1) {
            progress.push({
                subjectId,
                courseList: [],
            })
            t = progress.length - 1;
        };

        progress = progress[t].courseList;
        t = -1;
        for (let i = 0; i < progress.length; i++) {
            if (progress[i].courseId === courseId) {
                t = i;
                break;
            }
        }
        if (t === -1) {
            progress.push({
                courseId,
                unitList: [],
                quizList: [],
            })
            t = progress.length - 1;
        }

        progress = progress[t].quizList;
        t = progress.indexOf(quizId);
        if (t === -1) {
            progress.push(quizId);
        }
        const final_user = await user.save()
        res.status(200).json(final_user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const addTopic = async (req, res) => {
    try {
        const { subjectId, courseId, unitId } = req.params;
        const { title, content } = req.body;

        const newTopic = new Topic({
            title,
            content,
        });
        const savedTopic = await newTopic.save();

        const unit = await Unit.findById(unitId);
        unit.topicList.set(savedTopic._id, title);
        await unit.save()

        const course = await Course.findById(courseId);
        course.unitList.set(unit._id, unit.title);
        await course.save()

        const subject = await Subject.findById(subjectId);
        subject.courseList.set(course._id, course.title);
        await subject.save();

        res.status(201).json(savedTopic);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const addUnit = async (req, res) => {
    try {
        const { subjectId, courseId } = req.params;
        const { title } = req.body;
        const topicList = new Map();

        const newUnit = new Unit({
            title,
            topicList,
        });
        const savedUnit = await newUnit.save();
        const course = await Course.findById(courseId);
        course.unitList.set(savedUnit._id, title);
        await course.save()

        const subject = await Subject.findById(subjectId);
        subject.courseList.set(course._id, course.title);
        await subject.save()

        res.status(201).json(savedUnit);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const addQuiz = async (req, res) => {
    try {
        const { subjectId, courseId } = req.params;
        const { title } = req.body;
        const newQuiz = new Quiz({
            title,
        });

        const savedQuiz = await newQuiz.save();

        const course = await Course.findById(courseId);
        course.quizList.push(savedQuiz._id);
        await course.save()

        res.status(201).json(savedQuiz);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const addCourse = async (req, res) => {
    try {
        const { subjectId } = req.params;
        const { title } = req.body;
        const unitList = new Map();
        const quizList = [];
        const newCourse = new Course({
            title,
            unitList,
            quizList,
        });
        const savedCourse = await newCourse.save();

        const subject = await Subject.findById(subjectId);
        subject.courseList.set(savedCourse._id, title);
        await subject.save()
        res.status(201).json(savedCourse);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const addSubject = async (req, res) => {
    try {
        const { title } = req.body;
        const courseList = new Map();
        const newSubject = new Subject({
            title,
            courseList,
        });
        const savedSubject = await newSubject.save();
        res.status(201).json(savedSubject);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}


