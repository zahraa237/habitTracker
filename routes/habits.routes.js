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

router.get("/all-habits/:habitId/edit",async (req,res)=>{
    const foundHabit = await Habit.findById(req.params.habitId)
    res.render("habits/edit-habit.ejs", {foundHabit: foundHabit})
} )


router.put("/all-habits/:habitId/edit", async (req,res) => {
    await Habit.findByIdAndUpdate(req.params.habitId, req.body)
    res.redirect(`/habits/all-habits/${req.params.habitId}`)
})

//get the date
const date = new Date()
const weekDay = date.toLocaleDateString( 'en-US', {weekday: 'short'})
const day = (date.getDate())

// document.getElementById('weekday').textContent = weekDay
// document.getElementById('day').textContent = day
//todays habits
router.get("/today-habits", async (req, res) =>{
    const allHabits = await Habit.find()
    res.render("habits/today-habits.ejs", {weekDay: weekDay, day: day,allHabits:allHabits})
})

module.exports = router