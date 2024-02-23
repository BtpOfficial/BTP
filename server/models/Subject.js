import mongoose from "mongoose";
import Course from "./Course";

const SubjectSchema = new mongoose.Schema(
  {
    title:{
        type : String,
        required : true,
    },
    courselist:{
        type : [Course] ,
        default : [],
    }
  },
  { timestamps: true }
);

const Subject = mongoose.model("Subject", SubjectSchema);
export default Subject;