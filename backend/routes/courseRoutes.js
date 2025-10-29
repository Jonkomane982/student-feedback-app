const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourseById,
  getCoursesByLecturer
} = require('../controllers/courseController');

// @route   GET /api/courses
// @desc    Get all courses
router.get('/', getAllCourses);

// @route   GET /api/courses/lecturer/:lecturerId
// @desc    Get courses by lecturer
router.get('/lecturer/:lecturerId', getCoursesByLecturer);

// @route   GET /api/courses/:id
// @desc    Get course by ID
router.get('/:id', getCourseById);

module.exports = router;