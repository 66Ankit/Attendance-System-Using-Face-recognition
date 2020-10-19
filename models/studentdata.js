const mongoose = require("mongoose")


const studentData = mongoose.Schema({

    _id: mongoose.Types.ObjectId,
    name: String,
    Roll : Number,
    Email :String,
    Mobile :Number,
    Address : String,
    Zip : Number,
    City :String
})

module.exports = mongoose.model('Student',studentData);