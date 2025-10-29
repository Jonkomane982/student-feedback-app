import React, { useState, useEffect } from 'react';
import { getAllFeedback, deleteFeedback } from '../services/api';
import './FeedbackList.css';

const FeedbackList = ({ refreshTrigger }) => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const result = await getAllFeedback();
      if (result.success) {
        setFeedback(result.data);
      } else {
        setError('Failed to fetch feedback');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [refreshTrigger]);

  const handleDelete = async (feedbackId) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        const result = await deleteFeedback(feedbackId);
        if (result.success) {
          // Remove the deleted feedback from the list
          setFeedback(prev => prev.filter(item => item.feedback_id !== feedbackId));
        } else {
          alert('Failed to delete feedback: ' + result.message);
        }
      } catch (err) {
        alert('Error deleting feedback');
        console.error('Delete error:', err);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Loading feedback...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="feedback-list-container">
      <h2>Course Feedback ({feedback.length})</h2>
      
      {feedback.length === 0 ? (
        <div className="no-feedback">No feedback submitted yet.</div>
      ) : (
        <div className="feedback-grid">
          {feedback.map((item) => (
            <div key={item.feedback_id} className="feedback-card">
              <div className="feedback-header">
                <h3 className="student-name">{item.student_name}</h3>
                <div className="feedback-meta">
                  <span className="course-code">{item.course_code}</span>
                  <span className="rating">Rating: {item.rating}/5</span>
                </div>
              </div>
              
              <p className="comments">{item.comments}</p>
              
              <div className="feedback-footer">
                <span className="submission-date">
                  {formatDate(item.submission_date)}
                </span>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(item.feedback_id)}
                  title="Delete feedback"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackList;