const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const passport = require("passport");

// GET login page
router.get("/login", (req, res) => {
  res.render("login"); // your login.ejs page
});

// POST login form
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard", // redirect on success
    failureRedirect: "/auth/login", // redirect back to login on failure
    failureFlash: false, // enable if using flash messages
  })
);

module.exports = router;

// Show register form (optional)
router.get('/register', (req, res) => {
  res.render('register'); // Your EJS or HTML register page
});

// routes/auth.js

router.get("/login", (req, res) => {
  res.render("login"); // should match views/login.ejs
});

// Handle register POST request
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.send("User with this email already exists.");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.redirect("/login"); // Redirect to login page after success
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

module.exports = router;
