import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const result = await getDashboardStats();
        if (result.success) {
          setStats(result.data);
        } else {
          setError('Failed to fetch dashboard statistics');
        }
      } catch (err) {
        setError('Error connecting to server');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!stats) {
    return <div className="error-message">No data available</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>Feedback Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total_feedbacks}</div>
          <div className="stat-label">Total Feedbacks</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.total_students}</div>
          <div className="stat-label">Unique Students</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.total_courses}</div>
          <div className="stat-label">Courses Rated</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.average_rating}</div>
          <div className="stat-label">Average Rating</div>
          <div className="rating-stars">
            {''.repeat(Math.round(stats.average_rating))}
          </div>
        </div>
      </div>

      <div className="dashboard-info">
        <h3>About the Dashboard</h3>
        <p>
          This dashboard provides an overview of all course feedback submitted by students.
          Track the number of submissions, unique contributors, and overall course ratings.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;