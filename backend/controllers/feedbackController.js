const { pool } = require('../config/database');

// @desc    Get all feedback
// @route   GET /api/feedback
// @access  Public
const getAllFeedback = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM feedback ORDER BY submission_date DESC');
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching feedback',
      error: error.message
    });
  }
};

// @desc    Create new feedback
// @route   POST /api/feedback
// @access  Public
const createFeedback = async (req, res) => {
  try {
    const { student_name, course_code, comments, rating } = req.body;

    // Validation
    if (!student_name || !course_code || !comments || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Please provide student_name, course_code, comments, and rating'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Insert feedback
    const query = `
      INSERT INTO feedback (student_name, course_code, comments, rating)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [student_name, course_code, comments, rating];
    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating feedback',
      error: error.message
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/feedback/dashboard/stats
// @access  Public
const getDashboardStats = async (req, res) => {
  try {
    const statsQuery = `
      SELECT 
        COUNT(*) as total_feedbacks,
        COUNT(DISTINCT student_name) as total_students,
        COUNT(DISTINCT course_code) as total_courses,
        ROUND(AVG(rating), 2) as average_rating
      FROM feedback
    `;

    const statsResult = await pool.query(statsQuery);

    res.json({
      success: true,
      data: statsResult.rows[0]
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard statistics',
      error: error.message
    });
  }
};

// @desc    Get feedback by ID
// @route   GET /api/feedback/:id
// @access  Public
const getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM feedback WHERE feedback_id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching feedback',
      error: error.message
    });
  }
};

// @desc    Update feedback
// @route   PUT /api/feedback/:id
// @access  Public
const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { student_name, course_code, comments, rating } = req.body;

    // Validation
    if (!student_name || !course_code || !comments || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Please provide student_name, course_code, comments, and rating'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const query = `
      UPDATE feedback 
      SET student_name = $1, course_code = $2, comments = $3, rating = $4
      WHERE feedback_id = $5
      RETURNING *
    `;

    const values = [student_name, course_code, comments, rating, id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.json({
      success: true,
      message: 'Feedback updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating feedback',
      error: error.message
    });
  }
};

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Public
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM feedback WHERE feedback_id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.json({
      success: true,
      message: 'Feedback deleted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting feedback',
      error: error.message
    });
  }
};

// @desc    Get feedback by course
// @route   GET /api/feedback/course/:courseId
// @access  Public
const getFeedbackByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const result = await pool.query(
      'SELECT * FROM feedback WHERE course_code = $1 ORDER BY submission_date DESC', 
      [courseId]
    );
    
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching course feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching course feedback',
      error: error.message
    });
  }
};

// @desc    Get feedback by lecturer
// @route   GET /api/feedback/lecturer/:lecturerId
// @access  Public
const getFeedbackByLecturer = async (req, res) => {
  try {
    // For simplified schema, return all feedback
    const result = await pool.query('SELECT * FROM feedback ORDER BY submission_date DESC');
    
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching lecturer feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching lecturer feedback',
      error: error.message
    });
  }
};

module.exports = {
  getAllFeedback,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  getFeedbackByCourse,
  getFeedbackByLecturer,
  getDashboardStats
};