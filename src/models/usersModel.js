const mongoose = require("mongoose");

// Create a schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    driving_license_pic: {
      type: String,
      required: false,
    },
    area: {
      type: String,
      required: false,
    },
    nid_pic: {
      type: Array,
      required: true,
    },
    profile_pic: {
      type: String,
      required: true,
    },
    car_info: [
      {
        car_name: {
          type: String,
          required: false,
        },
        car_model: {
          type: String,
          required: false,
        },
        car_number: {
          type: String,
          required: false,
        },
      },
    ],
    password: {
      type: String,
      required: true,
    },
    vehicle_type: {
      type: String,
      enum: ["bike", "car"],
      required: true,
    },
    type: {
      type: String,
      enum: ["rider", "learner", "admin"],
    },
    is_blocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create a model
const Users = mongoose.model("Users", userSchema);

// Export the model
module.exports = Users;
