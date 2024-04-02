import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema(
  {
    title:{
        type : String,
        required : true,
    },
    courseList: {
      type: Map,
      of: String, 
    }
  },
  { timestamps: true }
);

const Subject = mongoose.model("Subject", SubjectSchema);
export default Subject;