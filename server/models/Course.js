import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    title : {
        type : String,
        required : true,
    },
    unitlist : {
        type : [mongoose.Schema.Types.Mixed],
        default : [],
    }
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", CourseSchema);
export default Course;