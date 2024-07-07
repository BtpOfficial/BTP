import Course from "../models/Course.js";
import Quiz from "../models/Quiz.js";
import Subject from "../models/Subject.js";
import Topic from "../models/Topic.js";
import Unit from "../models/Unit.js";
import User from "../models/User.js";
import axios from 'axios';
export const markComplete = async (req, res) => {
    try {
        const { subjectId, courseId, unitId, topicId } = req.params;
        const { userId } = req.body;
        const user = await User.findById(userId);

        let progress = user.progress || [];
        let subjectIndex = progress.findIndex(item => item.subjectId === subjectId);

        if (subjectIndex === -1) {
            progress.push({
                subjectId,
                courseList: [],
            });
            subjectIndex = progress.length - 1;
        }

        let courseIndex = progress[subjectIndex].courseList.findIndex(item => item.courseId === courseId);

        if (courseIndex === -1) {
            progress[subjectIndex].courseList.push({
                courseId,
                unitList: [],
            });
            courseIndex = progress[subjectIndex].courseList.length - 1;
        }

        let unitIndex = progress[subjectIndex].courseList[courseIndex].unitList.findIndex(item => item.unitId === unitId);

        if (unitIndex === -1) {
            progress[subjectIndex].courseList[courseIndex].unitList.push({
                unitId,
                topicList: [],
            });
            unitIndex = progress[subjectIndex].courseList[courseIndex].unitList.length - 1;
        }

        if (!progress[subjectIndex].courseList[courseIndex].unitList[unitIndex].topicList.includes(topicId)) {
            progress[subjectIndex].courseList[courseIndex].unitList[unitIndex].topicList.push(topicId);
        }

        user.progress = progress;
        const updatedUser = await user.save();
        res.status(201).json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
// need to change
// export const verifyQuiz = async (req, res) => {
//     console.log(req.body)
//     try {
//         const { topicId, quizId } = req.params;
//         const { user_id: userId, selectedOptions: user_response_mcq, descriptiveAnswers: user_response_descriptive } = req.body
//         console.log(userId, user_response_mcq, user_response_descriptive);
//         const user = await User.findById(userId);
//         const quiz = await Quiz.findById(quizId);
//         console.log(user , quiz)

//         if (!user || !quiz) {
//             return res.status(404).json({ message: "User or Quiz not found" });
//         }
//         const actual_mcq = quiz.quizArray.mcq.map(question => question.correct);
//         const actual_descriptive = quiz.quizArray.descriptive.map(question => question.answer);

//         let score = 0;
//         for (let i = 0; i < user_response_mcq.length; i++) {
//             if (user_response_mcq[i] === actual_mcq[i]) {
//                 score += 1;
//             }
//         }
//         console.log(actual_descriptive);

//             const data = [];

//             for (let i = 0; i < actual_descriptive.length; i++) {
//                 data.push({
//                     "source_sentence": actual_descriptive[i],
//                     "user_sentences": user_response_descriptive[i]
//                 });
//             }

//             console.log(data);
//             try {
//                 const response = await axios.post('http://localhost:5000/receive_data', data, {
//                     headers: {
//                         'Content-Type': 'application/json'
//                     }
//                 });
//                 const score_data = response.data;  // Store the response data in a variable
//                 console.log(score_data);  // Log the response data for debugging purposes
//                 res.json(score_data);  // Send the response data back to the client
//             } catch (error) {
//                 console.error('Error sending data to Flask:', error.message);
//                 res.status(500).json({ error: error.message });  // Ensure to handle errors with a single response
//             }

//         // this socre should also inculde some api callss ---------------------- raghav part llm
//         // sentenc similary code here -- score variabe add / subtract -- api --

//         // -- 

//         // Calculate score as a percentage
//         const totalQuestions = actual_mcq.length + actual_descriptive.length;
//         const scorePercentage = Math.round((score / totalQuestions) * 100);

//         // Find or create the progress entry for this topic
//         let topicProgress = user.progress_on_quiz.find(p => p.topicId === topicId);
//         if (!topicProgress) {
//             topicProgress = { topicId, value: [] };
//             user.progress_on_quiz.push(topicProgress);
//         }

//         // Find or create the quiz entry for this quiz
//         topicProgress = user.progress_on_quiz.find(p => p.topicId === topicId);
//         let quizProgress = topicProgress.value.find(q => q.quizId === quizId);
//         if (!quizProgress) {
//             quizProgress = { quizId, score: scorePercentage };
//             topicProgress.value.push(quizProgress);
//         } else {
//             quizProgress.score = scorePercentage;
//         }
//         quizProgress = topicProgress.value.find(q => q.quizId === quizId);
//         // Ensure the score is within the allowed range
//         quizProgress.score = Math.max(-20, Math.min(100, quizProgress.score));

//         await user.save();

//         res.status(200).json({
//             message: "Quiz evaluated successfully",
//             score: scorePercentage,
//             user: user
//         });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };
export const verifyQuiz = async (req, res) => {
    try {
        const { topicId, quizId } = req.params;
        const { user_id: userId, selectedOptions: user_response_mcq, descriptiveAnswers: user_response_descriptive } = req.body;

        const user = await User.findById(userId);
        const quiz = await Quiz.findById(quizId);

        if (!user || !quiz) {
            return res.status(404).json({ message: "User or Quiz not found" });
        }

        const actual_mcq = quiz.quizArray.mcq.map(question => question.correct);
        const actual_descriptive = quiz.quizArray.descriptive.map(question => question.answer);

        const mcqScores = [];
        const descriptiveScores = [];
        const answer = [];
        let score = 0;

        for (let i = 0; i < user_response_mcq.length; i++) {
            if (user_response_mcq[i] === actual_mcq[i]) {
                mcqScores.push(1);
                score += 1;
            } else {
                mcqScores.push(0);
            }
            answer.push({
                "your_answer": user_response_mcq[i],
                "right_answer": actual_mcq[i]
            })
        }
        const data = [];

        for (let i = 0; i < actual_descriptive.length; i++) {
            data.push({
                "source_sentence": actual_descriptive[i],
                "user_sentences": user_response_descriptive[i]
            });
        }

        let score_data;
        try {
            const response = await axios.post('http://localhost:5000/receive_data', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            score_data = response.data;  // Store the response data in a variable
            console.log(score_data);  // Log the response data for debugging purposes
        } catch (error) {
            console.error('Error sending data to Flask:', error.message);
            return res.status(500).json({ error: error.message });  // Ensure to handle errors with a single response
        }

        // Incorporate the score from the Flask service

        for (let value of score_data.results) {
            if (parseFloat(value.accuracy) > 70) {
                descriptiveScores.push(1);
                score += 1;
            } else {
                descriptiveScores.push(0);
            }
        }

        const answer1 = score_data.results;

        // Calculate score as a percentage
        const totalQuestions = actual_mcq.length + actual_descriptive.length;
        const scorePercentage = Math.round((score / totalQuestions) * 100);

        let topicProgress = user.progress_on_quiz.find(p => p.topicId === topicId);
        if (!topicProgress) {
            topicProgress = { topicId, quiz: {} };
            user.progress_on_quiz.push(topicProgress);
        }

        topicProgress = user.progress_on_quiz.find(p => p.topicId === topicId);

        // Find or create the quiz entry for this quiz
        let quizProgress = topicProgress.quiz;
        if (!quizProgress) {
            quizProgress = {
                quizId,
                mcqScores,
                descriptiveScores,
            };
            topicProgress.quiz.push(quizProgress);
        } else {
            quizProgress.mcqScores = mcqScores;
            quizProgress.descriptiveScores = descriptiveScores;
        }

        quizProgress = topicProgress.quiz;

        await user.save();

        res.status(200).json({
            message: "Quiz evaluated successfully",
            answer,
            answer1,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const addTopic = async (req, res) => {
    try {
        const { subjectId, courseId, unitId } = req.params;
        const { title, content } = req.body;

        // Create and save the new topic
        const newTopic = new Topic({ title, content });
        const savedTopic = await newTopic.save();

        // Update the unit
        const unit = await Unit.findById(unitId);
        if (!unit) {
            return res.status(404).json({ message: "Unit not found" });
        }
        unit.topicList.set(savedTopic._id.toString(), title);
        await unit.save();

        // Update the course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        if (!course.unitList.has(unitId)) {
            course.unitList.set(unitId, unit.title);
            await course.save();
        }

        // Update the subject
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }
        if (!subject.courseList.has(courseId)) {
            subject.courseList.set(courseId, course.title);
            await subject.save();
        }

        res.status(201).json(savedTopic);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const addUnit = async (req, res) => {
    try {
        const { subjectId, courseId } = req.params;
        const { title } = req.body;

        // Create and save the new unit
        const newUnit = new Unit({
            title,
            topicList: new Map() // This is optional as the schema will initialize an empty Map by default
        });
        const savedUnit = await newUnit.save();

        // Update the course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        course.unitList.set(savedUnit._id.toString(), title);
        await course.save();

        // Update the subject
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }
        if (!subject.courseList.has(courseId)) {
            subject.courseList.set(courseId, course.title);
            await subject.save();
        }

        res.status(201).json(savedUnit);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const addOrUpdateQuiz = async (req, res) => {
    try {
        const { topicId } = req.params;
        const { quizArray } = req.body;

        // Validate quizArray structure
        if (!quizArray || !quizArray.mcq || !quizArray.descriptive) {
            return res.status(400).json({ message: "Invalid quiz structure" });
        }

        let quiz = await Quiz.findOne({ topicId: topicId });

        if (!quiz) {
            // Create new quiz
            const newQuiz = new Quiz({
                topicId,
                quizArray,
            });
            const savedQuiz = await newQuiz.save();
            return res.status(201).json({
                message: "New quiz created successfully",
                quiz: savedQuiz
            });
        } else {
            // Update existing quiz
            quiz.quizArray = quizArray;
            await quiz.save();
            return res.status(200).json({
                message: "Quiz updated successfully",
                quiz: quiz
            });
        }

    } catch (err) {
        console.error("Error in addOrUpdateQuiz:", err);
        res.status(500).json({ message: "An error occurred while processing the quiz" });
    }
};

export const addCourse = async (req, res) => {
    try {
        const { subjectId } = req.params;
        const { title } = req.body;

        // Create and save the new course
        const newCourse = new Course({
            title,
            unitList: new Map() // This is optional as the schema will initialize an empty Map by default
        });
        const savedCourse = await newCourse.save();

        // Update the subject
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }
        subject.courseList.set(savedCourse._id.toString(), title);
        await subject.save();

        res.status(201).json(savedCourse);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const addSubject = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const newSubject = new Subject({
            title,
            courseList: new Map() // This is optional as the schema will initialize an empty Map by default
        });

        const savedSubject = await newSubject.save();
        res.status(201).json(savedSubject);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const deleteTopic = async (req, res) => {
    try {
        const { subjectId, courseId, unitId, topicId } = req.params;

        // Delete the topic
        const deletedTopic = await Topic.findByIdAndDelete(topicId);

        if (!deletedTopic) {
            return res.status(404).json({ message: "Topic not found" });
        }

        // Delete all associated quizzes
        await Quiz.deleteMany({ topicId: topicId });

        // Find the unit and remove the topic from the topicList map
        const unit = await Unit.findById(unitId);

        if (!unit) {
            return res.status(404).json({ message: "Unit not found" });
        }

        if (unit.topicList.has(topicId)) {
            unit.topicList.delete(topicId);
            await unit.save();
            return res.status(200).json({ message: "Topic and associated quizzes deleted successfully" });
        } else {
            return res.status(404).json({ message: "Topic not found in the unit" });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const deleteUnit = async (req, res) => {
    try {
        const { subjectId, courseId, unitId } = req.params;

        // Find the unit
        const unit = await Unit.findById(unitId);

        if (!unit) {
            return res.status(404).json({ message: "Unit not found" });
        }

        // Delete topics and associated quizzes
        for (const topicId of unit.topicList.keys()) {
            await Topic.findByIdAndDelete(topicId);
            await Quiz.deleteMany({ topicId: topicId });
        }

        // Delete the unit itself
        await Unit.findByIdAndDelete(unitId);

        // Update the course to remove the unit
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        if (course.unitList.has(unitId)) {
            course.unitList.delete(unitId);
            await course.save();
            return res.status(200).json({ message: "Unit and associated topics deleted successfully" });
        } else {
            return res.status(404).json({ message: "Unit not found in the course" });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const deleteCourse = async (req, res) => {
    try {
        const { subjectId, courseId } = req.params;

        // Find the course
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Iterate over unitList
        for (const unitId of course.unitList.keys()) {
            const unit = await Unit.findById(unitId);

            if (unit) {
                // Iterate over topicList
                for (const topicId of unit.topicList.keys()) {
                    await Topic.findByIdAndDelete(topicId);
                    await Quiz.deleteMany({ topicId: topicId });
                }
            }

            // Delete the unit
            await Unit.findByIdAndDelete(unitId);
        }

        // Delete the course itself
        await Course.findByIdAndDelete(courseId);

        // Remove courseId from subject.courseList
        const subject = await Subject.findById(subjectId);

        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        if (subject.courseList.has(courseId)) {
            subject.courseList.delete(courseId);
            await subject.save();
            return res.status(200).json({ message: "Course and all associated units and topics deleted successfully" });
        } else {
            return res.status(404).json({ message: "Course not found in the subject" });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const deleteSubject = async (req, res) => {
    try {
        const { subjectId } = req.params;

        // Find the subject
        const subject = await Subject.findById(subjectId);

        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        // Iterate over courses in the subject
        for (const courseId of subject.courseList.keys()) {
            const course = await Course.findById(courseId);

            if (course) {
                // Iterate over units in the course
                for (const unitId of course.unitList.keys()) {
                    const unit = await Unit.findById(unitId);

                    if (unit) {
                        // Iterate over topics in the unit
                        for (const topicId of unit.topicList.keys()) {
                            await Topic.findByIdAndDelete(topicId);
                            await Quiz.deleteMany({ topicId: topicId });
                        }
                    }

                    // Delete the unit
                    await Unit.findByIdAndDelete(unitId);
                }
            }

            // Delete the course
            await Course.findByIdAndDelete(courseId);
        }

        // Delete the subject
        await Subject.findByIdAndDelete(subjectId);

        return res.status(200).json({ message: "Subject and all associated courses, units, topics, and quizzes deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const getQuiz = async (req, res) => {
    try {
        const { topicId } = req.params;
        const quiz = await Quiz.findOne({ topicId: topicId });

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // Create a deep copy of the quiz object
        const quizCopy = JSON.parse(JSON.stringify(quiz));

        // Remove correct answers from MCQ questions
        quizCopy.quizArray.mcq = quizCopy.quizArray.mcq.map(question => {
            const { correct, ...rest } = question;
            return rest;
        });

        // Remove answers from descriptive questions
        quizCopy.quizArray.descriptive = quizCopy.quizArray.descriptive.map(question => {
            const { answer, ...rest } = question;
            return rest;
        });

        res.status(200).json(quizCopy);
    } catch (err) {
        console.error("Error in getQuiz:", err);
        res.status(500).json({ message: "An error occurred while fetching the quiz" });
    }
};