import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    title : {
        type : String,
        required : true,
    },
    unitList : {
        type : Map,
        of : String,
    },
    quizList : {
        type : [String],
        default : []
    }
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", CourseSchema);
export default Course;