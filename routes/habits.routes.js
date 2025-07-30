const router = require("express").Router()
const Habit = require("../models/Habit")


//create

router.get ("/new", (req,res) => {
    res.render("habits/add-habit.ejs")
})

router.post ("/new", async(req,res) => {
    try{
        // req.body.creator = req.session.user._id
        await Habit.create(req.body)
        res.redirect("/habits/all-habits")
    }
    catch(error){
        console.log(error)
    }
})

//read

router.get ("/all-habits", async (req,res) => {
    try{
        const allHabits = await Habit.find()
        res.render("habits/all-habits.ejs", {allHabits : allHabits})
    }
    catch (error) {
        console.log(error)
    }
})

router.get("/all-habits/:habitId", async (req, res) => {
    try {
        const foundHabit = await Habit.findById(req.params.habitId)
        res.render("habits/habit-details.ejs", {foundHabit: foundHabit})
    } catch (error) {
        console.log(error)
    }
})

//delete

router.delete("/all-habits/:habitId", async (req, res) => {
    await Habit.findByIdAndDelete (req.params.habitId)
    res.redirect("/habits/all-habits")
})

//edit
router.put("/all-habits/:habitId", async (req,res) => {
    
})

module.exports = router