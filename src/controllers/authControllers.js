const Users = require("../models/UsersModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const StripePayment = require("../models/StripePaymentModel");

// @route   POST api/auth/rider/register
// @desc    Register a new user
// @access  Public

exports.riderRegister = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const {
      name,
      email,
      age,
      address,
      phone,
      driving_license_pic,
      area,
      nid_pic,
      profile_pic,
      car_info,
      password,
      vehicle_type,
      type,
    } = req.body;
    //check if user already exists
    let checkUser = await Users.findOne({ email: email });
    if (checkUser) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }

    let hashedPassword = await bcrypt.hash(password, 10);
    let user = new Users({
      name,
      email,
      age,
      address,
      phone,
      driving_license_pic,
      area,
      nid_pic,
      profile_pic,
      car_info,
      password: hashedPassword,
      vehicle_type,
      type,
    });
    await user.save();
    //generate token
    const payload = {
      user: {
        email: email,
        type: type,
      },
    };
    let token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 360000,
    });
    res
      .status(200)
      .json({ msg: "Rider registration successful", token: token });
  } catch (err) {
    res.status(500).json({ errors: err });
  }
};

// @route   POST api/auth/learner/register
// @desc    Register a new user
// @access  Public

exports.learnerRegister = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const {
      name,
      email,
      age,
      address,
      phone,
      nid_pic,
      profile_pic,
      password,
      vehicle_type,
      type,
    } = req.body;
    let checkUser = await Users.findOne({ email: email });
    if (checkUser) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }
    let hashedPassword = await bcrypt.hash(password, 10);
    let user = new Users({
      name,
      email,
      age,
      address,
      phone,
      nid_pic,
      profile_pic,
      password: hashedPassword,
      vehicle_type,
      type,
    });
    await user.save();
    //generate token
    const payload = {
      user: {
        email: email,
        type: type,
      },
    };
    let token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 360000,
    });
    res
      .status(200)
      .json({ msg: "Learner registration successful", token: token });
  } catch (err) {
    res.status(500).json({ errors: err });
  }
};

// @route   POST api/auth/login
// @desc    Login user
// @access  Public

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;
    //check if user exists
    let user = await Users.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "User not found" }] });
    }
    //check password
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Email & Password doesn't match" }] });
    }
    //generate token
    const payload = {
      user: {
        email: user.email,
        type: user.type,
      },
    };
    let token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 360000,
    });
    res.status(200).json({ msg: "Login successful", token: token });
  } catch (err) {
    res.status(500).json({ errors: err });
  }
};

// @route   GET api/auth/get-all-users/:page/:limit/:search/:age
// @desc    Get all users
// @access  Private

exports.getAllUsers = async (req, res) => {
  try {
    let page = req.params.page;
    let limit = req.params.limit;
    let skip = (page - 1) * limit;
    let search = req.params.search;
    let age = req.params.age;
    let ageArray = age.split("-");
    let minAge = ageArray[0];
    let maxAge = ageArray[1];
    let users = await Users.find({
      $and: [
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { age: { $gte: minAge, $lte: maxAge } },
      ],
    })
      .skip(skip)
      .limit(limit);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ errors: err });
  }
};

// @route   GET api/auth/specific-user
// @desc    Get specific user data
// @access  Private

exports.getSpecificUser = async (req, res) => {
  try {
    let headersEmail = req.user.email;
    let user = await Users.findOne({ email: headersEmail });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ errors: err });
  }
};

//An admin can block multiple users if he finds anything suspicious.

// @route   POST api/auth/block-users
// @desc    Block multiple users
// @access  Private

exports.blockUsers = async (req, res) => {
  try {
    let users = req.body;
    let blockedUsers = [];
    for (let i = 0; i < users.length; i++) {
      let user = await Users.findOneAndUpdate(
        { _id: users[i] },
        { $set: { is_blocked: true } },
        { new: true }
      );
      blockedUsers.push(user);
    }
    res.status(200).json(blockedUsers);
  } catch (err) {
    res.status(500).json({ errors: err });
  }
};

// @route   POST api/auth/payment
// @desc    Payment
// @access  Private

exports.payment = async (req, res) => {
  try {
    const { amount, name } = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          name: name,
          description: name + " payment",
          amount: amount,
          currency: "usd",
          quantity: 1,
        },
      ],
      success_url: `${process.env.SUCCESS_URL}`,
      cancel_url: process.env.CANCEL_URL,
    });
    //save payment data into StripePaymentModel
    let payment = new StripePayment({
      email: req.user.email,
      amount: amount,
      currency: "usd",
      payment_method: "card",
      payment_date: new Date(),
    });
    await payment.save();
    res.status(200).json(session);
  } catch (err) {
    res.status(500).json({ errors: err });
  }
};

// @route   GET api/auth/get-all-payments/:page/:limit/:search/:date
// @desc    Get all payments
// @access  Private

exports.getAllPayments = async (req, res) => {
  try {
    let page = req.params.page;
    let limit = req.params.limit;
    let skip = (page - 1) * limit;
    let search = req.params.search;
    let date = req.params.date;
    let dateArray = date.split("-");
    let minDate = dateArray[0];
    let maxDate = dateArray[1];
    let payments = await StripePayment.find({
      $and: [
        { email: { $regex: search, $options: "i" } },
        { amount: { $regex: search, $options: "i" } },
        { payment_method: { $regex: search, $options: "i" } },
        { payment_date: { $gte: minDate, $lte: maxDate } },
      ],
    })
      .skip(skip)
      .limit(limit);
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ errors: err });
  }
};

// @route   GET api/auth/get-specific-user-payment
// @desc    Get specific user payment
// @access  Private

exports.getSpecificUserPayment = async (req, res) => {
  try {
    let headersEmail = req.user.email;
    let payments = await StripePayment.find({ email: headersEmail });
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ errors: err });
  }
};
