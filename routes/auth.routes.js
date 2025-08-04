const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//homepage
router.get("/", (req, res) => {
  try {
    res.render("auth/login.ejs", { error: null });
  } catch (error) {
    console.log(error);
  }
});

router.get("/signup", (req, res) => {
  res.render("auth/signup.ejs", { error: null });
});

router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    // VALIDATION
    //  Check if all the necessary fields are there
    if (!username || !password) {
      return res.render("auth/signup.ejs", {
        error: "All fields are required.",
      });
    }

    if (password.length < 6) {
      return res.render("auth/signup.ejs", {
        error: "Password must be at least 6 characters long.",
      });
    }

    // Do we already have this person in our database?
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render("auth/signup.ejs", {
        error: "Username is already taken.",
      });
    }

    // Hash password and create user
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
      username,
      password: hashedPassword,
      pfp: req.body.pfp || "default.png",
    };

    await User.create(newUser);

    // Redirect to Login
    res.redirect("/auth/login");
  } catch (error) {
    console.error("Sign-up error:", error);
    res.render("auth/sign-up", {
      error: "Something went wrong. Please try again.",
    });
  }
});

router.get("/login", (req, res) => {
  res.render("auth/login.ejs", { error: null });
});

router.post("/login", async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });

    if (!userInDatabase) {
      return res.render("auth/login", { error: "Username not found." });
    }

    const validPassword = bcrypt.compareSync(
      req.body.password,
      userInDatabase.password
    );

    if (!validPassword) {
      return res.render("auth/login", { error: "Incorrect password." });
    }

    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id,
    };

    res.redirect("/habits/today-habits");
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.render("auth/sign-in", { error: "An unexpected error occurred." });
  }
});

//profile
router.get("/profile", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    res.render("auth/profile.ejs", { user: currentUser });
  } catch (error) {
    console.log(error);
    res.render("auth/profile.ejs", {
      user: null,
      error: "Could not load profile.",
    });
  }
});

// router.get("/logout", (req, res) => {
//   req.session.destroy();
//   res.redirect("/auth/login");
// });

module.exports = router;
