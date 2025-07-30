const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")

//homepage
router.get("/", (req,res) => {
    res.render("../views/auth/homepage.ejs")
})

//sign-up
router.get("/signup", (req,res) => {
    res.render("auth/signup.ejs")
})

router.post("/signup",async(req,res)=>{
    try{
        const hashedPassword = bcrypt.hashSync(req.body.password,10) // encrypts our password
        req.body.password = hashedPassword
        await User.create(req.body)
        res.redirect("/auth/login")
    }

    catch(error){
        console.log(error)
    }
})

//log-in

router.get("/login", (req,res) => {
    res.render("auth/login.ejs")
})

router.post("/login",async(req,res)=>{
    try{
        const foundUser = await User.findOne({username:req.body.username})
        console.log(req.body)
        const validPassword = bcrypt.compareSync(req.body.password,foundUser.password)
        console.log(validPassword)

        if(!validPassword){
            return res.send("Password is incorrect")
        }  
        // creates a session for our user once they are logged in
        req.session.user = {
            username: foundUser.username,
            _id: foundUser._id
        }
        res.redirect("/habits/all-habits.ejs") 
    }
    catch(error){

    }
})



module.exports = router