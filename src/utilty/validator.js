const { check, validationResult } = require("express-validator");

const validateRiderRegister = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check("age", "Age is required").not().isEmpty(),
  check("age", "Age must be a number").isNumeric(),
  check("address", "Address is required").not().isEmpty(),
  check("phone", "Phone is required").not().isEmpty(),
  check("phone", "Phone must be a number and 11 digits long")
    .isNumeric()
    .isLength({ min: 11, max: 11 }),
  check("driving_license_pic", "Driving license pic is required")
    .not()
    .isEmpty(),
  check("area", "Area is required").not().isEmpty(),
  check("nid_pic", "NID pic is required").not().isEmpty(),
  check("profile_pic", "Profile pic is required").not().isEmpty(),
  check("car_info", "Car info is required").not().isEmpty(),
  check("car_info.*.car_name", "Car name is required").not().isEmpty(),
  check("car_info.*.car_model", "Car model is required").not().isEmpty(),
  check("car_info.*.car_number", "Car number is required").not().isEmpty(),
  check(
    "password",
    "Please enter a password with 6 or more characters"
  ).isLength({ min: 6 }),
];

const validateLearnerRegister = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check("age", "Age is required").not().isEmpty(),
  check("age", "Age must be a number").isNumeric(),
  check("address", "Address is required").not().isEmpty(),
  check("phone", "Phone is required").not().isEmpty(),
  check("phone", "Phone must be a number and 11 digits long")
    .isNumeric()
    .isLength({ min: 11, max: 11 }),
  check("nid_pic", "NID pic is required").not().isEmpty(),
  check("profile_pic", "Profile pic is required").not().isEmpty(),
  check("vehicle_type", "Vehicle type is required").not().isEmpty(),
  check(
    "password",
    "Please enter a password with 6 or more characters"
  ).isLength({ min: 6 }),
];

const validateLogin = [
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password is required").exists(),
];

module.exports = {
  validateRiderRegister,
  validateLearnerRegister,
  validateLogin,
};
