// app.js
const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const { sequelize, User } = require("./models"); // Sequelize DB connection and User model

dotenv.config();

// Passport Configuration
passport.use(
  new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) return done(null, false, { message: "User not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false, { message: "Wrong password" });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});



// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Express Session
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
const authRoutes = require("./routes/auth");
const customerRoutes = require("./routes/customer");
const businessRoutes = require("./routes/business");
const indexRoutes = require("./routes/index");

app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/customer", customerRoutes);
app.use("/business", businessRoutes);

// Test DB connection
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ PostgreSQL connected successfully.");
  })
  .catch((err) => {
    console.error("❌ Unable to connect to the database:", err);
  });

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
