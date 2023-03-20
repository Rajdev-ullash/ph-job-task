const express = require("express");
const router = express.Router();

// Importing the controllers
const {
  registerRider,
  registerLearner,
  login,
  getAllUsers,
  getSpecificUser,
  blockUsers,
  payment,
  getAllPayments,
  getSpecificUserPayment,
} = require("../controllers/authControllers");

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

// @route   GET api/auth/get-all-users/:page/:limit/:search/:age
// @desc    Get all users
// @access  Private
router.get(
  "/get-all-users/:page/:limit/:search/:age",
  authVerify,
  adminVerify,
  getAllUsers
);

// @route   GET api/auth/specific-user
// @desc    Get specific user data
// @access  Private
router.get("/specific-user", authVerify, getSpecificUser);

// @route   POST api/auth/block-users
// @desc    Block multiple users
// @access  Private
router.post("/block-users", authVerify, adminVerify, blockUsers);

// @route   POST api/auth/payment
// @desc    Make a payment
// @access  Private
router.post("/payment", authVerify, payment);

// @route   GET api/auth/get-all-payments/:page/:limit/:search/:age
// @desc    Get all payments
// @access  Private
router.get(
  "/get-all-payments/:page/:limit/:search/:age",
  authVerify,
  adminVerify,
  getAllPayments
);

// @route   GET api/auth/specific-user-payment
// @desc    Get specific user payment data
// @access  Private
router.get("/specific-user-payment", authVerify, getSpecificUserPayment);

module.exports = router;
