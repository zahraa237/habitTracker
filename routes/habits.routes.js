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
    res.redirect("/habits/today-habits");
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

router.get("/today-habits", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const allHabits = currentUser.habits;

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const week = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);

      const dateStr = date.toDateString();
      const isToday = date.toDateString() === today.toDateString();

      const habitsForDay = allHabits.map((habit) => ({
        _id: habit._id,
        name: habit.name,
        reason: habit.reason,
        icon: habit.icon,
        isChecked: habit.checkedDays.includes(dateStr),
      }));

      week.push({
        dayName: date.toLocaleDateString("en-US", { weekday: "long" }),
        date: date,
        isToday: isToday,
        habits: habitsForDay,
      });
    }

    res.render("habits/today-habits.ejs", {
      pfp: currentUser.pfp,
      week: week,
      habits: allHabits,
    });
  } catch (error) {
    console.error("Backend exploded:", error);
    res.status(500).send("Something went wrong.");
  }
});

router.post("/all-habits/:id/check", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const habit = currentUser.habits.id(req.params.id);
    const today = new Date().toDateString();

    // }
    await habit.save();
    res.json(habit);
  } catch (error) {
    console.log(error);
  }
});

// check the task done

router.post("/check-day", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id); // FIXED
    const { habitId, date } = req.body;

    const habit = currentUser.habits.id(habitId);
    if (!habit) return res.status(404).send("Habit not found");

    const day = new Date(date).toDateString();

    if (habit.checkedDays.includes(day)) {
      habit.checkedDays = habit.checkedDays.filter((d) => d !== day); // uncheck
    } else {
      habit.checkedDays.push(day); // check
    }

    await currentUser.save();
    res.redirect("/habits/today-habits");
  } catch (error) {
    console.error("Check-day error:", error);
    res.status(500).send("An error occurred");
  }
});

// records router

router.get("/records", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const allHabits = currentUser.habits;
    const today = new Date();

    const year = today.getFullYear();
    const month = today.getMonth(); // 0-indexed
    const numDays = new Date(year, month + 1, 0).getDate();

    const monthDays = [];

    for (let i = 1; i <= numDays; i++) {
      const date = new Date(year, month, i);
      monthDays.push(date.toDateString());
    }

    // Prepare record data per habit
    const records = allHabits.map((habit) => {
      const days = monthDays.map((date) => ({
        date,
        isChecked: habit.checkedDays.includes(date),
      }));
      return {
        name: habit.name,
        icon: habit.icon,
        id: habit._id,
        days,
      };
    });

    res.render("habits/record.ejs", {
      pfp: currentUser.pfp,
      records,
    });
  } catch (error) {
    console.error("Records route failed like a Monday:", error);
    res.status(500).send("Error loading records");
  }
});

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
