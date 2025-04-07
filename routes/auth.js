const express = require("express");
const router = express.Router();
const { validatorLogin } = require("../validators/auth");
const { loginCtrl } = require("../controllers/auth.js");

router.post("/login", validatorLogin, loginCtrl);

module.exports = router;