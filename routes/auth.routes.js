const router = require("express").Router()
//const User = require("../models/User")
const bcrypt = require("bcrypt")

router.get("/login", (req,res) => {
    res.render("auth/login.ejs")
})

router.get("/signup", (req,res) => {
    res.render("auth/signup.ejs")
})

module.exports = router