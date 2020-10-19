const mongoose =require("mongoose")

const Attendance =mongoose.Schema({

    Roll : Number,
    Present : Number,
    Percent : Number,
    Total : Number,
})


module.exports=mongoose.model("Attendance",Attendance);