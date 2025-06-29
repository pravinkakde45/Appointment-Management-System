const express = require("express");
const router = express.Router();

router.get("/dashboard", (req, res) => {
  res.send("Customer Dashboard");
});

module.exports = router;
