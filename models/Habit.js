const mongoose = require("mongoose")
const User = require("../models/User")

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
    icon: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",}
})

const Habit = mongoose.model("Habit", habitSchema)
module.exports = Habit