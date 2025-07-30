//imports
const express = require("express")
const app = express()
const dotenv = require("dotenv").config()
const methodOverride = require("method-override")
const conntectToDB = require('./db.js')
const authRoutes = require("./routes/auth.routes")
const habitRoutes = require ("./routes/habits.routes")
const session = require("express-session")

// connect to database
conntectToDB()

//middleware
app.use(express.urlencoded({ extended: false }))



app.use("/auth", authRoutes)
app.use("/habits", habitRoutes)

// Listen on port 3000
const port = process.env.PORT || 3000

app.listen(port,()=>{
    console.log("Listening on port " + port)
}) 