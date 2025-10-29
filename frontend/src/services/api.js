const API_BASE_URL = 'http://localhost:5000/api';

// Get all feedback
export const getAllFeedback = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/feedback`);
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
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting feedback:', error);
    throw error;
  }
};