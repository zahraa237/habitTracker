const router = require("express").Router();
const User = require("../models/User");

//create

router.get("/add-habit", (req, res) => {
  res.render("habits/add-habit.ejs");
});

router.post("/add-habit", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    req.body.creator = req.session.user._id;
    currentUser.habits.push(req.body);
    currentUser.save();
    res.redirect("/habits/today-habits");
  } catch (error) {
    console.log(error);
  }
});

//read

router.get("/all-habits", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    res.render("habits/all-habits.ejs", { allHabits: currentUser.habits });
  } catch (error) {
    console.log(error);
  }
});

router.get("/all-habits/:habitId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const foundHabit = currentUser.habits.id(req.params.habitId);
    res.render("habits/habit-details.ejs", { foundHabit: foundHabit });
  } catch (error) {
    console.log(error);
  }
});

//delete

router.delete("/all-habits/:habitId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    currentUser.habits.id(req.params.habitId).deleteOne();
    await currentUser.save();
    res.redirect("/habits/all-habits");
  } catch (error) {
    console.log(error);
  }
});

//edit

router.get("/all-habits/:habitId/edit", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const foundHabit = currentUser.habits.id(req.params.habitId);
    res.render("habits/edit-habit.ejs", { foundHabit: foundHabit });
  } catch (error) {
    console.log(error);
  }
});

router.put("/all-habits/:habitId/edit", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const foundHabit = currentUser.habits.id(req.params.habitId);
    foundHabit.set(req.body);
    await currentUser.save();
    res.redirect(`/habits/all-habits/${req.params.habitId}`);
  } catch (error) {
    console.log(error);
  }
});

//get the date
const date = new Date();
const weekDay = date.toLocaleDateString("en-US", { weekday: "long" });
const day = date.getDate();
const month = date.toLocaleDateString("en-US", { month: "long" });

router.get("/today-habits", async (req, res) => {
  const currentUser = await User.findById(req.session.user._id);
  const allHabits = currentUser.habits;
  const pfp = currentUser.pfp;
  res.render("habits/today-habits.ejs", {
    weekDay: weekDay,
    day: day,
    month: month,
    allHabits: allHabits,
    pfp: pfp,
  });
});

router.post("/all-habits/:id/check", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const habit = currentUser.habits.id(req.params.id);
    const today = new Date().toDateString();

    //     if (req.body.checked) {
    //         if (!habit.checkedDays.includes(today)) {
    //             habit.checkedDays.push(today);
    //         }
    //     } else {
    //         habit.checkedDays = habit.checkedDays.filter(date => date !== today);
    // }
    await habit.save();
    res.json(habit);
  } catch (error) {
    console.log(error);
  }
});

//record
router.get("/records", async (req, res) => {
  const currentUser = await User.findById(req.session.user._id);
  const allHabits = currentUser.habits;
  const today = new Date();

  res.render("habits/record.ejs", {
    allHabits: allHabits,
    pfp: currentUser.pfp,
  });
});

// router.get("/icons", (req,res) => {
//     res.render("habits/icons.ejs")
// })

// router.get("/test",(req,res)=>{
//     res.send("SUCCESS")
// })

router.put("/check/:habitId", async (req, res) => {
  console.log("Checking habit with ID:", req.params.habitId);
  const currentUser = await User.findById(req.session.user._id);
  const habit = currentUser.habits.id(req.params.habitId);
  if (habit.checked === false) {
    habit.checked = true;
  } else {
    habit.checked = false;
  }
  await currentUser.save();
  res.redirect("/habits/today-habits");
});

module.exports = router;
