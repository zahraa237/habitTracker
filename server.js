//imports
const express = require("express")
const app = express()
const dotenv = require("dotenv").config()
const methodOverride = require("method-override")
const conntectToDB = require('./db.js')
const authRoutes = require("./routes/auth.routes")


app.get("/", (req,res) => {
    res.render("../views/homepage.ejs")
})

// connect to database
conntectToDB()



app.use("/auth", authRoutes)

// Listen on port 3000
const port = process.env.PORT || 3000

app.listen(port,()=>{
    console.log("Listening on port " + port)
}) 