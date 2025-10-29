import React, { useState } from 'react';
import { submitFeedback } from '../services/api';
import './FeedbackForm.css';

const FeedbackForm = ({ onFeedbackSubmitted }) => {
  const [formData, setFormData] = useState({
    student_name: '',
    course_code: '',
    comments: '',
    rating: 1
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.student_name.trim()) {
      newErrors.student_name = 'Student name is required';
    }

    if (!formData.course_code.trim()) {
      newErrors.course_code = 'Course code is required';
    }

    if (!formData.comments.trim()) {
      newErrors.comments = 'Comments are required';
    }

    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const result = await submitFeedback(formData);
      
      if (result.success) {
        setMessage('Feedback submitted successfully!');
        setFormData({
          student_name: '',
          course_code: '',
          comments: '',
          rating: 1
        });
        
        // Notify parent component to refresh feedback list
        if (onFeedbackSubmitted) {
          onFeedbackSubmitted();
        }
      } else {
        setMessage('Failed to submit feedback: ' + result.message);
      }
    } catch (error) {
      setMessage('Error submitting feedback. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="feedback-form-container">
      <h2>Submit Course Feedback</h2>
      
      {message && (
        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-group">
          <label htmlFor="student_name">Student Name *</label>
          <input
            type="text"
            id="student_name"
            name="student_name"
            value={formData.student_name}
            onChange={handleChange}
            className={errors.student_name ? 'error' : ''}
            placeholder="Enter your full name"
          />
          {errors.student_name && <span className="error-text">{errors.student_name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="course_code">Course Code *</label>
          <input
            type="text"
            id="course_code"
            name="course_code"
            value={formData.course_code}
            onChange={handleChange}
            className={errors.course_code ? 'error' : ''}
            placeholder="e.g., BIWA2110"
          />
          {errors.course_code && <span className="error-text">{errors.course_code}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="comments">Comments *</label>
          <textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            className={errors.comments ? 'error' : ''}
            placeholder="Share your feedback about the course..."
            rows="4"
          />
          {errors.comments && <span className="error-text">{errors.comments}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="rating">Rating *</label>
          <div className="rating-container">
            {[1, 2, 3, 4, 5].map((star) => (
              <label key={star} className="rating-star">
                <input
                  type="radio"
                  name="rating"
                  value={star}
                  checked={formData.rating === star}
                  onChange={handleChange}
                />
                <span className="star">{star} </span>
              </label>
            ))}
          </div>
          {errors.rating && <span className="error-text">{errors.rating}</span>}
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;