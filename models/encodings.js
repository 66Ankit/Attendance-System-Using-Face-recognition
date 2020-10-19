const mongoose =require("mongoose")


const Encodings = mongoose.Schema({

    encoding : Array,
    roll:  Number

});

module.exports=mongoose.model("Encodings",Encodings);