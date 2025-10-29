import React, { useEffect } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onSplashComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onSplashComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onSplashComplete]);

  return (
    <div className="splash-screen">
      {/* Background with gradient instead of image */}
      <div className="splash-background"></div>
      
      {/* Scrolling Welcome Messages - Line by Line */}
      <div className="welcome-messages-container">
        <div className="welcome-line line-1"> Welcome to Student Feedback App</div>
        <div className="welcome-line line-2"> Share Your Feedback</div>
        <div className="welcome-line line-3"> Help Improve Courses</div>
        <div className="welcome-line line-4"> Your Voice Matters</div>
        <div className="welcome-line line-5"> Enhance Learning Experience</div>
        <div className="welcome-line line-6"> Make a Difference</div>
        <div className="welcome-line line-7"> Shape Better Education</div>
        <div className="welcome-line line-8"> Connect with Educators</div>
        <div className="welcome-line line-9"> Build Better Tomorrow</div>
        <div className="welcome-line line-10"> Your Opinion Counts</div>
      </div>

      {/* Countdown Timer */}
      <div className="countdown-timer">
        <p>Loading your feedback portal...</p>
      </div>
    </div>
  );
};

export default SplashScreen;