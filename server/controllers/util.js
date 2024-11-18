import Subject from "../models/Subject.js";
import Course from "../models/Course.js"
import Unit from "../models/Unit.js";
import Quiz from "../models/Quiz.js";
import Topic from "../models/Topic.js";

export const getSubjectList = async (req, res) => {
    try {
        const subjectList = await Subject.find();
        res.status(200).json(subjectList);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getCourseList = async (req, res) => {
    try {
        const { subjectId } = req.params;
        const subject = await Subject.findById(subjectId);
        const courseListIds = Array.from(subject.courseList.keys());
        const courseList = await Promise.all(
            courseListIds.map((id) => Course.findById(id))
        );
        res.status(200).json(courseList);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getUnitList = async (req, res) => {
    try {
        const { subjectId, courseId } = req.params;
        const course = await Course.findById(courseId);
        const unitListIds = Array.from(course.unitList.keys());
        const unitList = await Promise.all(
            unitListIds.map((id) => Unit.findById(id))
        );
        res.status(200).json(unitList);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// export const getQuizList = async (req, res) => {
//     try {
//         const { subjectId, courseId } = req.params;
//         const course = await Course.findById(courseId);
//         const quizListIds = course.quizList;
//         const quizList = await Promise.all(
//             quizListIds.map((id) => Quiz.findById(id))
//         )
//         res.status(200).json(quizList);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

export const getTopicList = async (req, res) => {
    try {
        const { subjectId, courseId, unitId } = req.params;
        const unit = await Unit.findById(unitId);
        const topicListIds = Array.from(unit.topicList.keys());
        const topicList = await Promise.all(
            topicListIds.map((id) => Topic.findById(id))
        );
        res.status(200).json(topicList);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getTopic = async (req, res) => {
    try {
        const { subjectId, courseId, unitId, topicId } = req.params;
        const topic = await Topic.findById(topicId);
        res.status(200).json(topic);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const getUnitAverageScore = async (req, res) => {
    try {
        const { unitId } = req.params;
        const { userId } = req.body;

        // Validate parameters
        if (!unitId || !userId) {
            return res.status(400).json({
                message: "Missing required parameters"
            });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                message: "User not found" 
            });
        }

        // Find the unit
        const unit = await Unit.findById(unitId);
        if (!unit) {
            return res.status(404).json({ 
                message: "Unit not found" 
            });
        }

        // Get all topicIds from the unit
        const unitTopicIds = Array.from(unit.topicList.keys());

        // Filter user's progress to only include quizzes from this unit's topics
        const relevantQuizScores = user.progress_on_quiz.filter(progress => 
            unitTopicIds.includes(progress.topicId)
        );

        // If no quizzes attempted for this unit
        if (relevantQuizScores.length === 0) {
            return res.status(200).json({
                message: "No quiz attempts found for this unit",
            });
        }

        // Calculate average score
        const totalScore = relevantQuizScores.reduce((sum, progress) => 
            sum + progress.quizScore, 0
        );
        const averageScore = totalScore / relevantQuizScores.length;

        return res.status(200).json({
            message: "Unit average score calculated successfully",
            score : averageScore
        });

    } catch (err) {
        console.error('Get Unit Average Score Error:', err);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const getSubjectHierarchy = async (req, res) => {
    try {
        // Fetch all subjects
        const subjects = await Subject.find({});

        // Array to store the final hierarchical data
        const hierarchicalData = [];

        // Process each subject
        for (const subject of subjects) {
            const subjectData = {
                _id: subject._id,
                title: subject.title,
                courses: [],
            };

            // Process each course in the subject
            for (const [courseId, courseName] of subject.courseList) {
                // Fetch the course
                const course = await Course.findById(courseId);
                if (course) {
                    const courseData = {
                        _id: course._id,
                        title: course.title,
                        units: [],
                    };

                    // Process each unit in the course
                    for (const [unitId, unitName] of course.unitList) {
                        // Fetch the unit
                        const unit = await Unit.findById(unitId);
                        if (unit) {
                            const unitData = {
                                _id: unit._id,
                                title: unit.title,
                                topicCount: unit.topicList.size, // Include count of topics
                            };
                            courseData.units.push(unitData);
                        }
                    }
                    subjectData.courses.push(courseData);
                }
            }
            
            hierarchicalData.push(subjectData);
        }

        return res.status(200).json({
            message: "Subject hierarchy fetched successfully",
            data: hierarchicalData,
            summary: {
                totalSubjects: hierarchicalData.length,
                totalCourses: hierarchicalData.reduce((sum, subject) => 
                    sum + subject.courses.length, 0
                ),
                totalUnits: hierarchicalData.reduce((sum, subject) => 
                    sum + subject.courses.reduce((courseSum, course) => 
                        courseSum + course.units.length, 0
                    ), 0
                )
            }
        });

    } catch (err) {
        console.error('Get Subject Hierarchy Error:', err);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
