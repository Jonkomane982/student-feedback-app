// Use environment variable for API URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://student-feedback-backend2.onrender.com/api';

// Get all feedback
export const getAllFeedback = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/feedback`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching feedback:', error);
    throw error;
  }
};

// Submit new feedback
export const submitFeedback = async (feedbackData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/feedback/dashboard/stats`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// Delete feedback
export const deleteFeedback = async (feedbackId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/feedback/${feedbackId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting feedback:', error);
    throw error;
  }
};