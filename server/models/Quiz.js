import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema(
  {
    title : {
        type : String,
        required : true,
    },
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", QuizSchema);
export default Quiz;