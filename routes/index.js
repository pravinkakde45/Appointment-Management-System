const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index"); // Or res.send("Home Page")
});

module.exports = router;
