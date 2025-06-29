const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.getLogin = (req, res) => {
  res.render("auth/login");
};

exports.getRegister = (req, res) => {
  res.render("auth/register");
};

exports.postRegister = async (req, res) => {
  const { name, email, role, password, confirmPassword } = req.body;
  const errors = [];

  if (!name || !email || !role || !password || !confirmPassword) {
    errors.push({ msg: "Please fill in all fields" });
  }

  if (password !== confirmPassword) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (errors.length > 0) {
    return res.render("auth/register", {
      errors,
      name,
      email,
      role,
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      errors.push({ msg: "Email already registered" });
      return res.render("auth/register", {
        errors,
        name,
        email,
        role,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, role, password: hashedPassword });
    await newUser.save();
    req.flash("success_msg", "You are now registered. Please log in.");
    res.redirect("/auth/login");
  } catch (err) {
    console.log(err);
    res.redirect("/auth/register");
  }
};

exports.postLogin = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/customer/dashboard",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout(() => {
    req.flash("success_msg", "You are logged out");
    res.redirect("/auth/login");
  });
};
