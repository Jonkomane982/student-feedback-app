const express = require('express');
const router = express.Router();
const {
  getAllFeedback,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  getFeedbackByCourse,
  getFeedbackByLecturer,
  getDashboardStats
} = require('../controllers/feedbackController');

// @route   GET /api/feedback
// @desc    Get all feedback
router.get('/', getAllFeedback);

// @route   GET /api/feedback/dashboard/stats
// @desc    Get dashboard statistics
router.get('/dashboard/stats', getDashboardStats);

// @route   GET /api/feedback/course/:courseId
// @desc    Get feedback by course
router.get('/course/:courseId', getFeedbackByCourse);

// @route   GET /api/feedback/lecturer/:lecturerId
// @desc    Get feedback by lecturer
router.get('/lecturer/:lecturerId', getFeedbackByLecturer);

// @route   GET /api/feedback/:id
// @desc    Get feedback by ID
router.get('/:id', getFeedbackById);

// @route   POST /api/feedback
// @desc    Create new feedback
router.post('/', createFeedback);

// @route   PUT /api/feedback/:id
// @desc    Update feedback
router.put('/:id', updateFeedback);

// @route   DELETE /api/feedback/:id
// @desc    Delete feedback
router.delete('/:id', deleteFeedback);

module.exports = router;