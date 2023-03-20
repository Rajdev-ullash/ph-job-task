const mongoose = require("mongoose");

// Create a schema
const stripePaymentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  payment_method: {
    type: String,
    required: true,
  },
  payment_date: {
    type: Date,
    default: Date.now,
  },
});

// Create a model
const StripePayment = mongoose.model("StripePayment", stripePaymentSchema);

module.exports = StripePayment;
