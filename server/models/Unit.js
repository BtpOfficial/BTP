import mongoose from "mongoose";
import Topic from "./Topic";

const UnitSchema = new mongoose.Schema(
  {
    title : {
        type : String,
        required : true,
    },
    topiclist : {
        type : [Topic] ,
        default : [],
    }
  },
  { timestamps: true }
);

const Unit = mongoose.model("Unit", UnitSchema);
export default Unit;