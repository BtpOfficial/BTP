import mongoose from "mongoose";

const UnitSchema = new mongoose.Schema(
  {
    title : {
        type : String,
        required : true,
    },
    topicList : {
        type : [String] ,
        default : [],
    }
  },
  { timestamps: true }
);

const Unit = mongoose.model("Unit", UnitSchema);
export default Unit;