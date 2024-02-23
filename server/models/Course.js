import mongoose from "mongoose";
import Unit from "./Unit";

const CourseSchema = new mongoose.Schema(
  {
    title : {
        type : String,
        required : true,
    },
    unitlist : {
        type : [Unit] ,
        default : [],
    }
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", CourseSchema);
export default Course;