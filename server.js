//imports
const express = require("express")
const app = express()
const dotenv = require("dotenv").config()
const methodOverride = require("method-override")
const conntectToDB = require('./db.js')

// connect to database
conntectToDB()





// Listen on port 3000
const port = process.env.PORT || 3000

app.listen(port,()=>{
    console.log("Listening on port " + port)
}) 