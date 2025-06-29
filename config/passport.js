const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      const user = await User.findOne({ email });
      if (!user) return done(null, false, { message: "Email not registered" });

      const isMatch = await bcrypt.compare(password, user.password);
      return isMatch ? done(null, user) : done(null, false, { message: "Password incorrect" });
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => User.findById(id).then(user => done(null, user)));
};
