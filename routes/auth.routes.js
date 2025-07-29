const router = require("express").Router()
//const User = require("../models/User")
const bcrypt = require("bcrypt")

//sign-in
router.get("/signup", (req,res) => {
    res.render("auth/signup.ejs")
})


//log-in

router.get("/login", (req,res) => {
    res.render("auth/login.ejs")
})

router.post("/login", async(req,res) => {
    try{
        
    }
    catch (error){

    }
})



module.exports = router