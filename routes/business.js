const express = require("express");
const router = express.Router();

router.get("/dashboard", (req, res) => {
  res.send("Business Dashboard");
});

module.exports = router;
