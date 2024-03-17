import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema(
  {
    title:{
        type : String,
        required : true,
    },
    courseList:{
        type : [String] ,
        default : [],
    }
  },
  { timestamps: true }
);

const Subject = mongoose.model("Subject", SubjectSchema);
export default Subject;