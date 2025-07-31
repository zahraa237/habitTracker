const mongoose = require("mongoose")

const habitSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique: true
    },
    reason:{
        type:String,
        required:true
    },
    icon: String
})

const Habit = mongoose.model("Habit", habitSchema)
module.exports = Habit