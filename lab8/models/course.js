const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
    },
    instructorName: {
      type: String,
      required: [true, "Instructor name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Course price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Course category is required"],
      trim: true,
      enum: ["Web Development", "Design", "Marketing", "Programming", "Business"],
    },
    enrolledStudents: {
      type: Number,
      default: 0,
      min: [0, "Enrolled students cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);
