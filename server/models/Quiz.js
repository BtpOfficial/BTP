import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema(
  {
    topicId : {
      type : String,
      required : true,
    } ,
    quizArray : {
      type : [
        {
            question : {
              type : String,
              required : true,
            },
            options : {
              type : [String],
              required : true,
            },
            correct : {
              type : String,
              enum : ['A','B','C','D'],
              required : true,
            }
        }
      ],
      default : []
    }
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", QuizSchema);
export default Quiz;