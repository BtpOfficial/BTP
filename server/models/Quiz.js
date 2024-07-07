import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema(
  {
    topicId: {
      type: String,
      required: true,
    },
    quizArray: {
      mcq: [
        {
          question: {
            type: String,
            required: true,
          },
          options: {
            type: [String],
            required: true,
          },
          correct: {
            type: String,
            enum: ['A', 'B', 'C', 'D'],
            required: true,
          }
        }
      ],
      descriptive: [
        {
          question: {
            type: String,
            required: true,
          },
          answer: {
            type: String,
            required: true,
          }
        }
      ]
    }
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", QuizSchema);
export default Quiz;