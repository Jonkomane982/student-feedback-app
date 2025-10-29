import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple build script that creates a static HTML site
const buildDir = path.join(__dirname, 'build');
const publicDir = path.join(__dirname, 'public');

// Create build directory
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Copy public files if they exist
if (fs.existsSync(publicDir)) {
  const publicFiles = fs.readdirSync(publicDir);
  publicFiles.forEach(file => {
    const source = path.join(publicDir, file);
    const dest = path.join(buildDir, file);
    if (fs.statSync(source).isDirectory()) {
      copyDir(source, dest);
    } else {
      fs.copyFileSync(source, dest);
    }
  });
}

// Create the main HTML file
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Feedback App</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: #f5f5f5; 
            line-height: 1.6;
        }
        .app-container { min-height: 100vh; display: flex; flex-direction: column; }
        
        .app-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            text-align: center;
        }
        .app-header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .app-header p { font-size: 1.1rem; opacity: 0.9; }
        
        .app-nav {
            background: white;
            padding: 1rem;
            display: flex;
            justify-content: center;
            gap: 1rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .app-nav button {
            padding: 0.75rem 1.5rem;
            border: none;
            background: #f8f9fa;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        .app-nav button:hover {
            background: #e9ecef;
            transform: translateY(-2px);
        }
        .app-nav button.active {
            background: #667eea;
            color: white;
        }
        
        .app-main {
            flex: 1;
            padding: 2rem;
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
        }
        
        .content-section {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }
        
        .app-footer {
            background: #2c3e50;
            color: white;
            text-align: center;
            padding: 1rem;
            margin-top: auto;
        }
        
        .feedback-form {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            max-width: 600px;
            margin: 0 auto;
        }
        
        .form-group {
            display: flex;
            flex-direction: column;
        }
        
        .form-group label {
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #555;
        }
        
        .form-group input,
        .form-group textarea,
        .form-group select {
            padding: 0.75rem;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-size: 1rem;
        }
        
        .submit-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem 2rem;
            border: none;
            border-radius: 8px;
            font-size: 1.1rem;
            cursor: pointer;
            margin-top: 1rem;
        }
        
        .feedback-card {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            border-left: 4px solid #667eea;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-top: 1rem;
        }
        
        .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            border-radius: 12px;
            text-align: center;
        }
        
        .stat-value {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
        }
        
        .loading {
            text-align: center;
            padding: 2rem;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="app-container">
        <header class="app-header">
            <h1> Student Feedback Application</h1>
            <p>Share your feedback about courses and view what others have to say</p>
        </header>

        <nav class="app-nav">
            <button onclick="showTab('dashboard')" class="active"> Dashboard</button>
            <button onclick="showTab('submit')"> Submit Feedback</button>
            <button onclick="showTab('view')"> View Feedback</button>
        </nav>

        <main class="app-main">
            <!-- Dashboard Tab -->
            <div id="dashboard" class="content-section">
                <h2>Feedback Dashboard</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value" id="totalFeedbacks">0</div>
                        <div>Total Feedbacks</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="totalStudents">0</div>
                        <div>Unique Students</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="totalCourses">0</div>
                        <div>Courses Rated</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="averageRating">0.0</div>
                        <div>Average Rating</div>
                    </div>
                </div>
            </div>

            <!-- Submit Feedback Tab -->
            <div id="submit" class="content-section" style="display: none;">
                <h2>Submit Course Feedback</h2>
                <form class="feedback-form" onsubmit="submitFeedback(event)">
                    <div class="form-group">
                        <label for="studentName">Student Name *</label>
                        <input type="text" id="studentName" name="studentName" required placeholder="Enter your full name">
                    </div>
                    
                    <div class="form-group">
                        <label for="courseCode">Course Code *</label>
                        <input type="text" id="courseCode" name="courseCode" required placeholder="e.g., BIWA2110">
                    </div>
                    
                    <div class="form-group">
                        <label for="comments">Comments *</label>
                        <textarea id="comments" name="comments" required rows="4" placeholder="Share your feedback about the course..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="rating">Rating *</label>
                        <select id="rating" name="rating" required>
                            <option value="">Select rating</option>
                            <option value="1">1  - Poor</option>
                            <option value="2">2  - Fair</option>
                            <option value="3">3  - Good</option>
                            <option value="4">4  - Very Good</option>
                            <option value="5">5   - Excellent</option>
                        </select>
                    </div>
                    
                    <button type="submit" class="submit-btn">Submit Feedback</button>
                </form>
                <div id="formMessage" style="margin-top: 1rem;"></div>
            </div>

            <!-- View Feedback Tab -->
            <div id="view" class="content-section" style="display: none;">
                <h2>Course Feedback</h2>
                <div id="feedbackList" class="loading">
                    Loading feedback...
                </div>
            </div>
        </main>

        <footer class="app-footer">
            <p>BIWA2110 Web Application Development - Lab Test 2 | Limkokwing University of Creative Technology Lesotho</p>
        </footer>
    </div>

    <script>
        const API_BASE_URL = 'https://student-feedback-backend2.onrender.com/api';
        
        // Tab navigation
        function showTab(tabName) {
            // Hide all tabs
            document.getElementById('dashboard').style.display = 'none';
            document.getElementById('submit').style.display = 'none';
            document.getElementById('view').style.display = 'none';
            
            // Remove active class from all buttons
            document.querySelectorAll('.app-nav button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Show selected tab and set active button
            document.getElementById(tabName).style.display = 'block';
            event.target.classList.add('active');
            
            // Load data for the tab
            if (tabName === 'dashboard') loadDashboard();
            if (tabName === 'view') loadFeedback();
        }
        
        // Load dashboard statistics
        async function loadDashboard() {
            try {
                const response = await fetch(API_BASE_URL + '/feedback/dashboard/stats');
                const data = await response.json();
                
                if (data.success) {
                    document.getElementById('totalFeedbacks').textContent = data.data.total_feedbacks;
                    document.getElementById('totalStudents').textContent = data.data.total_students;
                    document.getElementById('totalCourses').textContent = data.data.total_courses;
                    document.getElementById('averageRating').textContent = data.data.average_rating;
                }
            } catch (error) {
                console.error('Error loading dashboard:', error);
            }
        }
        
        // Load feedback list
        async function loadFeedback() {
            const container = document.getElementById('feedbackList');
            container.innerHTML = '<div class="loading">Loading feedback...</div>';
            
            try {
                const response = await fetch(API_BASE_URL + '/feedback');
                const data = await response.json();
                
                if (data.success && data.data.length > 0) {
                    let html = '';
                    data.data.forEach(feedback => {
                        html += \`
                            <div class="feedback-card">
                                <strong>\${feedback.student_name}</strong> - \${feedback.course_code}
                                <div style="color: #667eea; margin: 0.5rem 0;">Rating: \${feedback.rating}/5</div>
                                <p>"\${feedback.comments}"</p>
                                <small style="color: #666;">Submitted on \${new Date(feedback.submission_date).toLocaleDateString()}</small>
                            </div>
                        \`;
                    });
                    container.innerHTML = html;
                } else {
                    container.innerHTML = '<div class="loading">No feedback submitted yet.</div>';
                }
            } catch (error) {
                console.error('Error loading feedback:', error);
                container.innerHTML = '<div class="loading">Error loading feedback. Please try again.</div>';
            }
        }
        
        // Submit feedback
        async function submitFeedback(event) {
            event.preventDefault();
            
            const formData = {
                student_name: document.getElementById('studentName').value,
                course_code: document.getElementById('courseCode').value,
                comments: document.getElementById('comments').value,
                rating: parseInt(document.getElementById('rating').value)
            };
            
            const messageDiv = document.getElementById('formMessage');
            messageDiv.innerHTML = '<div style="color: #666;">Submitting...</div>';
            
            try {
                const response = await fetch(API_BASE_URL + '/feedback', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    messageDiv.innerHTML = '<div style="color: green;">✅ Feedback submitted successfully!</div>';
                    // Clear form
                    event.target.reset();
                    // Reload dashboard and feedback list
                    loadDashboard();
                    setTimeout(loadFeedback, 1000);
                } else {
                    messageDiv.innerHTML = '<div style="color: red;">❌ Error: ' + data.message + '</div>';
                }
            } catch (error) {
                console.error('Error submitting feedback:', error);
                messageDiv.innerHTML = '<div style="color: red;">❌ Network error. Please try again.</div>';
            }
        }
        
        // Load dashboard on page load
        document.addEventListener('DOMContentLoaded', function() {
            loadDashboard();
            loadFeedback();
        });
    </script>
</body>
</html>`;

// Write the HTML file
fs.writeFileSync(path.join(buildDir, 'index.html'), htmlContent);

console.log('✅ Static site built successfully!');

// Helper function to copy directories
function copyDir(source, destination) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }
  
  const files = fs.readdirSync(source);
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      copyDir(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  });
}