import Course from "../models/Course.js";
import Quiz from "../models/Quiz.js";
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

// need to change
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

export const addOrUpdateQuiz = async (req, res) => {
    try {
        const { topicId } = req.params;
        const { quizArray } = req.body;
        const quiz = await Quiz.findOne({ topicId : topicId })
        if(!quiz) {
            const newQuiz = new Quiz({
                topicId,
                quizArray,
            });
            const savedQuiz = await newQuiz.save();
            return res.status(201).json(savedQuiz);
        }
        quiz.quizArray = quizArray;
        await quiz.save();
        res.status(201).json(quiz);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const addCourse = async (req, res) => {
    try {
        const { subjectId } = req.params;
        const { title } = req.body;
        const unitList = new Map();
        const newCourse = new Course({
            title,
            unitList,
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


export const delTopic = async (req, res) => {
    try {
        const { subjectId, courseId, unitId, topicId } = req.params;
        
        // Delete the topic
        await Topic.findByIdAndDelete(topicId);
        
        const quiz = await Quiz.findOne({topicId : topicId})
        if(quiz) {
            await Quiz.findByIdAndDelete(quiz._id);
        }
        // Find the unit and remove the topic from the topicList map
        const unit = await Unit.findById(unitId);
        if (unit.topicList.has(topicId)) {
            unit.topicList.delete(topicId);
            await unit.save();
            res.status(201).json("Deletion successful");
        } else {
            res.status(404).json({ message: "Topic not found in the unit" });
        }

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}


export const delUnit = async (req, res) => {
    try {
        const { subjectId, courseId, unitId } = req.params;
        
        // Find the unit
        const unit = await Unit.findById(unitId);
        
        // Delete topics associated with the unit
        for (const [topicId, topic] of unit.topicList.entries()) {
            await Topic.findByIdAndDelete(topicId);
        }
        
        // Delete the unit itself
        await Unit.findByIdAndDelete(unitId);
        
        // Update the course to remove the unit
        const course = await Course.findById(courseId);
        if (course.unitList.has(unitId)) {
            course.unitList.delete(unitId);
            await course.save();
            res.status(201).json("Deletion successful");
        } else {
            res.status(404).json({ message: "Unit not found in the course" });
        }

    } catch(err) {
        res.status(400).json({ message: err.message });
    }
}


export const delCourse = async (req, res) => {
    try {
        const { subjectId, courseId } = req.params;
        
        // Find the course
        const course = await Course.findById(courseId);
        
        // Iterate over unitList
        for (const [unitId, unitTitle] of course.unitList.entries()) {
            const unit = await Unit.findById(unitId);
            
            // Iterate over topicList
            for (const [topicId, topicTitle] of unit.topicList.entries()) {
                await Topic.findByIdAndDelete(topicId);
            }
            
            // Delete the unit
            await Unit.findByIdAndDelete(unitId);
        }

        // Delete the course itself
        await Course.findByIdAndDelete(courseId);
        
        // Remove courseId from subject.courseList
        const subject = await Subject.findById(subjectId);
        if (subject.courseList.has(courseId)) {
            subject.courseList.delete(courseId);
            await subject.save();
            res.status(201).json("Deletion successful");
        } else {
            res.status(404).json({ message: "Course not found in the subject" });
        }

    } catch(err) {
        res.status(400).json({ message: err.message });
    }
}


export const delSubject = async (req, res) => {
    try {
        const { subjectId } = req.params;
        
        // Find the subject
        const subject = await Subject.findById(subjectId);

        // Iterate over courses in the subject
        for (const [courseId, courseTitle] of subject.courseList.entries()) {
            const course = await Course.findById(courseId);

            // Iterate over units in the course
            for (const [unitId, unitTitle] of course.unitList.entries()) {
                const unit = await Unit.findById(unitId);

                // Iterate over topics in the unit
                for (const [topicId, topicTitle] of unit.topicList.entries()) {
                    await Topic.findByIdAndDelete(topicId);
                }

                // Delete the unit
                await Unit.findByIdAndDelete(unitId);
            }

            // Delete the course
            await Course.findByIdAndDelete(courseId);
        }

        // Delete the subject
        await Subject.findByIdAndDelete(subjectId);

        res.status(201).json("Deletion successful");
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
}


export const verifyQuiz = async(req,res) => {
    try {
        const { quizId  } = req.params;
        const quiz = await Quiz.findById(quizId);
        const { response } = req.body; // Assuming it is an array
        const totalQuestions = Math.min(quiz.quizArray.length,response.length);
        let score = 0;
        for (let i = 0; i < totalQuestions; i++) {
            if(response[i] === quiz.quizArray[i].correct) {
                score += 1;
            }
        }
        if(totalQuestions !== 0) {
            score = (score /totalQuestions)*100;
        }
        res.status(200).json(score);

    } catch(err) {
        res.status(400).json({ message: err.message });

    }
}

