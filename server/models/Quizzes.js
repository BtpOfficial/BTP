import mongoose from "mongoose";

const QuizzesSchema = new mongoose.Schema(
  {
    title : {
        type : String,
        required : true,
    },
    quizList : {
        type : [String] ,
        default : [],
    }
  },
  { timestamps: true }
);

const Quizzes = mongoose.model("Quizzes", QuizzesSchema);
export default Quizzes;