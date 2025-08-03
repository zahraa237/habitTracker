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
    icon: String,
    checked: {
        type: Boolean,
        default: false
    },
    dateCreated: {
        type: Date,
        default: new Date().toDateString()
    },
    checkedDays: {
        type: [String],
        default: []
    }
})

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique: true
    },
    password:{
        type:String,
        required:true
    },
    habits: [habitSchema],
})

const User = mongoose.model("User", userSchema)
module.exports = User