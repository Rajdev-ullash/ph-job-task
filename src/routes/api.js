const express = require("express");
const router = express.Router();

// Importing the controllers
const {
  registerRider,
  registerLearner,
  login,
} = require("../controllers/authController");

// Importing the validators
const {
  validateRiderRegister,
  validateLearnerRegister,
  validateLogin,
} = require("../utility/validator");

// importing the middleware
const authVerify = require("../middlewares/authVerifyMiddleware");
const adminVerify = require("../middlewares/adminVerifyMiddleware");

// @route   POST api/auth/register/rider
// @desc    Register a new rider
// @access  Public
router.post("/register/rider", validateRiderRegister, registerRider);

// @route   POST api/auth/register/learner
// @desc    Register a new learner
// @access  Public
router.post("/register/learner", validateLearnerRegister, registerLearner);

// @route   POST api/auth/login
// @desc    Login a user
// @access  Public
router.post("/login", validateLogin, login);

module.exports = router;
