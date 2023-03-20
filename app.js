const express = require("express");
const app = new express();
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const router = require("./src/routes/api");
const dotenv = require("dotenv");
dotenv.config();

//Database Libraries and Config
const mongoose = require("mongoose");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 700, // limit each IP to 700 requests per windowMs
});
app.use(limiter);
app.use(cors());

//Database Connection
mongoose
  .connect("mongodb://localhost:27017/hero-rider-ph-task", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

//Routes
app.use("/api", router);

module.exports = app;
