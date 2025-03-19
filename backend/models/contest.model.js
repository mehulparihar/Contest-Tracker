import mongoose from "mongoose";

const contestSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "name is required"],
    },
    platform : {
        type : String,
        required : [true, "platform is required"],
    },
    startTime : {
        type : Date,
    },
    endTime : {
        type : Date,
    },
    duration : {
        type : Number,
    },
    link : {
        type : String,
    },
    solutionLink : {
        type : String,
        default : "",
    }
});

const Contest = mongoose.model("Contest", contestSchema);

export default Contest;