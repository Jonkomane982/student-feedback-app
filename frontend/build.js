const fs = require('fs');
const path = require('path');

// Simple build script that copies files to build directory
const buildDir = path.join(__dirname, 'build');
const publicDir = path.join(__dirname, 'public');
const srcDir = path.join(__dirname, 'src');

// Create build directory
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Copy public files
if (fs.existsSync(publicDir)) {
  const publicFiles = fs.readdirSync(publicDir);
  publicFiles.forEach(file => {
    const source = path.join(publicDir, file);
    const dest = path.join(buildDir, file);
    if (fs.statSync(source).isDirectory()) {
      // Copy directory recursively
      copyDir(source, dest);
    } else {
      fs.copyFileSync(source, dest);
    }
  });
}

// Create basic HTML file
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Feedback App</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; padding: 2rem; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; text-align: center; }
        .nav { background: white; padding: 1rem; display: flex; gap: 1rem; justify-content: center; }
        .nav button { padding: 0.75rem 1.5rem; border: none; background: #f8f9fa; border-radius: 8px; cursor: pointer; }
        .content { background: white; padding: 2rem; border-radius: 12px; margin-top: 2rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .footer { background: #2c3e50; color: white; text-align: center; padding: 1rem; margin-top: 2rem; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📚 Student Feedback Application</h1>
        <p>Share your feedback about courses and view what others have to say</p>
    </div>

    <div class="nav">
        <button onclick="showTab('dashboard')">📊 Dashboard</button>
        <button onclick="showTab('submit')">✏️ Submit Feedback</button>
        <button onclick="showTab('view')">👁️ View Feedback</button>
    </div>

    <div class="container">
        <div id="dashboard" class="content">
            <h2>Dashboard</h2>
            <p>Loading dashboard data...</p>
        </div>

        <div id="submit" class="content" style="display: none;">
            <h2>Submit Feedback</h2>
            <p>Feedback form will be available when React loads.</p>
        </div>

        <div id="view" class="content" style="display: none;">
            <h2>View Feedback</h2>
            <p>Loading feedback data...</p>
        </div>
    </div>

    <div class="footer">
        <p>BIWA2110 Web Application Development - Lab Test 2 | Limkokwing University of Creative Technology Lesotho</p>
    </div>

    <script>
        function showTab(tabName) {
            // Hide all tabs
            document.getElementById('dashboard').style.display = 'none';
            document.getElementById('submit').style.display = 'none';
            document.getElementById('view').style.display = 'none';
            
            // Show selected tab
            document.getElementById(tabName).style.display = 'block';
        }
        
        // Show dashboard by default
        showTab('dashboard');
    </script>
</body>
</html>`;

fs.writeFileSync(path.join(buildDir, 'index.html'), htmlContent);

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

console.log('✅ Build completed successfully!');