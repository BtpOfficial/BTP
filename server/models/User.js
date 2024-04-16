import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5, // password length should be minimun of 5 characters
    },
    qualification: {
      type: String,
      enum: ["Intermediate", "High School", "Graduation", "Post Graduation", "Post Doctoral", "Others"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"]
    },
    progress: {
      type: [
        {
          subjectId: String,
          courseList: [
            {
              courseId: String,
              unitList: [
                {
                  unitId: String,
                  topicList: [String],
                }
              ],
            }
          ],
        }
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;