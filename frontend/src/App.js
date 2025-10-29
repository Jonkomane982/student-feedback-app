import React, { useState, useEffect } from 'react';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';
import Dashboard from './components/Dashboard';
import SplashScreen from './components/SplashScreen';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('welcome');
  const [showSplash, setShowSplash] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFeedbackSubmitted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
    setActiveTab('submit'); // Automatically go to feedback form after splash
  };

  const renderContent = () => {
    if (showSplash) {
      return <SplashScreen onSplashComplete={handleSplashComplete} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'submit':
        return <FeedbackForm onFeedbackSubmitted={handleFeedbackSubmitted} />;
      case 'view':
        return <FeedbackList refreshTrigger={refreshTrigger} />;
      default:
        return <FeedbackForm onFeedbackSubmitted={handleFeedbackSubmitted} />;
    }
  };

  // Hide navigation during splash screen
  if (showSplash) {
    return (
      <div className="App">
        {renderContent()}
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>Student Feedback Application</h1>
        <p>Share your feedback about courses and view what others have to say</p>
      </header>

      <nav className="app-nav">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={activeTab === 'submit' ? 'active' : ''}
          onClick={() => setActiveTab('submit')}
        >
          Submit Feedback
        </button>
        <button 
          className={activeTab === 'view' ? 'active' : ''}
          onClick={() => setActiveTab('view')}
        >
          View Feedback
        </button>
      </nav>

      <main className="app-main">
        {renderContent()}
      </main>

     <footer className="app-footer">
      <div className="footer-simple">
        <p>© 2025 Limkokwing University of Creative Technology Lesotho</p>
      </div>
     </footer>
    </div>
  );
}

export default App;