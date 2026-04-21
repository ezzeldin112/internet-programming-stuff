require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const courseRouter = require("./routes/courseRouter");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/course_management";

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Course Management API is running",
    endpoints: {
      courses: "/api/courses",
    },
  });
});

app.use("/api/courses", courseRouter);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
