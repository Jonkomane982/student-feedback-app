-- =============================================
-- Student Feedback Application Database Schema
-- PostgreSQL - Comprehensive Schema with User Management
-- =============================================

-- Create database (run this first in PostgreSQL admin)
-- CREATE DATABASE student_feedback_app;

-- Connect to student_feedback_app database first, then run below:

-- =============================================
-- Table: users
-- Base table for all system users (students and lecturers)
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('student', 'lecturer', 'admin')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Table: students
-- Stores student-specific information
-- =============================================
CREATE TABLE IF NOT EXISTS students (
    student_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    student_number VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE,
    phone_number VARCHAR(20),
    address TEXT,
    program VARCHAR(100) DEFAULT 'BSc. in Information Technology',
    academic_year VARCHAR(10) DEFAULT '2024',
    semester VARCHAR(10) DEFAULT '1',
    
    CONSTRAINT fk_student_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(user_id) 
        ON DELETE CASCADE
);

-- =============================================
-- Table: lecturers
-- Stores lecturer-specific information
-- =============================================
CREATE TABLE IF NOT EXISTS lecturers (
    lecturer_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    staff_number VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    department VARCHAR(100) DEFAULT 'Faculty of Information & Communication Technology',
    qualification VARCHAR(100),
    office_location VARCHAR(50),
    phone_extension VARCHAR(10),
    
    CONSTRAINT fk_lecturer_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(user_id) 
        ON DELETE CASCADE
);

-- =============================================
-- Table: courses
-- Stores available courses information
-- =============================================
CREATE TABLE IF NOT EXISTS courses (
    course_id SERIAL PRIMARY KEY,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    description TEXT,
    credits INTEGER DEFAULT 3,
    department VARCHAR(100) DEFAULT 'Faculty of Information & Communication Technology',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Table: course_assignments
-- Links lecturers to courses they teach
-- =============================================
CREATE TABLE IF NOT EXISTS course_assignments (
    assignment_id SERIAL PRIMARY KEY,
    lecturer_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    academic_year VARCHAR(10) DEFAULT '2024',
    semester VARCHAR(10) DEFAULT '1',
    is_active BOOLEAN DEFAULT TRUE,
    
    CONSTRAINT fk_assignment_lecturer 
        FOREIGN KEY (lecturer_id) 
        REFERENCES lecturers(lecturer_id) 
        ON DELETE CASCADE,
    
    CONSTRAINT fk_assignment_course 
        FOREIGN KEY (course_id) 
        REFERENCES courses(course_id) 
        ON DELETE CASCADE,
    
    CONSTRAINT unique_lecturer_course 
        UNIQUE (lecturer_id, course_id, academic_year, semester)
);

-- =============================================
-- Table: student_enrollments
-- Links students to courses they are enrolled in
-- =============================================
CREATE TABLE IF NOT EXISTS student_enrollments (
    enrollment_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    academic_year VARCHAR(10) DEFAULT '2024',
    semester VARCHAR(10) DEFAULT '1',
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'completed', 'dropped')),
    
    CONSTRAINT fk_enrollment_student 
        FOREIGN KEY (student_id) 
        REFERENCES students(student_id) 
        ON DELETE CASCADE,
    
    CONSTRAINT fk_enrollment_course 
        FOREIGN KEY (course_id) 
        REFERENCES courses(course_id) 
        ON DELETE CASCADE,
    
    CONSTRAINT unique_student_course 
        UNIQUE (student_id, course_id, academic_year, semester)
);

-- =============================================
-- Table: feedback
-- Main table for storing student feedback
-- =============================================
CREATE TABLE IF NOT EXISTS feedback (
    feedback_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    lecturer_id INTEGER NOT NULL,
    comments TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    academic_year VARCHAR(20) DEFAULT '2024',
    semester VARCHAR(20) DEFAULT '1',
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_approved BOOLEAN DEFAULT TRUE,
    is_anonymous BOOLEAN DEFAULT FALSE,
    
    -- Foreign key constraints
    CONSTRAINT fk_feedback_student 
        FOREIGN KEY (student_id) 
        REFERENCES students(student_id) 
        ON DELETE CASCADE,
    
    CONSTRAINT fk_feedback_course 
        FOREIGN KEY (course_id) 
        REFERENCES courses(course_id) 
        ON DELETE CASCADE,
    
    CONSTRAINT fk_feedback_lecturer 
        FOREIGN KEY (lecturer_id) 
        REFERENCES lecturers(lecturer_id) 
        ON DELETE CASCADE,
    
    -- Ensure student can only submit one feedback per course per lecturer per semester
    CONSTRAINT unique_feedback_submission 
        UNIQUE (student_id, course_id, lecturer_id, academic_year, semester)
);

-- =============================================
-- Table: feedback_analytics
-- For dashboard and reporting
-- =============================================
CREATE TABLE IF NOT EXISTS feedback_analytics (
    analytics_id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL,
    lecturer_id INTEGER NOT NULL,
    total_feedbacks INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    rating_1_count INTEGER DEFAULT 0,
    rating_2_count INTEGER DEFAULT 0,
    rating_3_count INTEGER DEFAULT 0,
    rating_4_count INTEGER DEFAULT 0,
    rating_5_count INTEGER DEFAULT 0,
    last_calculated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_analytics_course 
        FOREIGN KEY (course_id) 
        REFERENCES courses(course_id) 
        ON DELETE CASCADE,
    
    CONSTRAINT fk_analytics_lecturer 
        FOREIGN KEY (lecturer_id) 
        REFERENCES lecturers(lecturer_id) 
        ON DELETE CASCADE,
    
    CONSTRAINT unique_course_lecturer_analytics 
        UNIQUE (course_id, lecturer_id)
);

-- =============================================
-- Table: audit_log
-- For tracking changes
-- =============================================
CREATE TABLE IF NOT EXISTS audit_log (
    log_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(20) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_audit_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(user_id) 
        ON DELETE SET NULL
);

-- =============================================
-- INDEXES for Performance Optimization
-- =============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_students_student_number ON students(student_number);
CREATE INDEX IF NOT EXISTS idx_lecturers_staff_number ON lecturers(staff_number);
CREATE INDEX IF NOT EXISTS idx_feedback_student_id ON feedback(student_id);
CREATE INDEX IF NOT EXISTS idx_feedback_course_id ON feedback(course_id);
CREATE INDEX IF NOT EXISTS idx_feedback_lecturer_id ON feedback(lecturer_id);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON feedback(rating);
CREATE INDEX IF NOT EXISTS idx_feedback_submission_date ON feedback(submission_date);
CREATE INDEX IF NOT EXISTS idx_courses_course_code ON courses(course_code);
CREATE INDEX IF NOT EXISTS idx_enrollments_student_course ON student_enrollments(student_id, course_id);
CREATE INDEX IF NOT EXISTS idx_assignments_lecturer_course ON course_assignments(lecturer_id, course_id);

-- =============================================
-- FUNCTIONS for Database Operations
-- =============================================

-- Function to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to validate student enrollment before feedback
CREATE OR REPLACE FUNCTION validate_feedback_submission()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if student is enrolled in the course
    IF NOT EXISTS (
        SELECT 1 FROM student_enrollments 
        WHERE student_id = NEW.student_id 
        AND course_id = NEW.course_id 
        AND academic_year = NEW.academic_year 
        AND semester = NEW.semester 
        AND status = 'enrolled'
    ) THEN
        RAISE EXCEPTION 'Student is not enrolled in this course for the specified academic period';
    END IF;
    
    -- Check if lecturer is assigned to the course
    IF NOT EXISTS (
        SELECT 1 FROM course_assignments 
        WHERE lecturer_id = NEW.lecturer_id 
        AND course_id = NEW.course_id 
        AND academic_year = NEW.academic_year 
        AND semester = NEW.semester 
        AND is_active = TRUE
    ) THEN
        RAISE EXCEPTION 'Lecturer is not assigned to this course for the specified academic period';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update analytics when new feedback is added
CREATE OR REPLACE FUNCTION update_feedback_analytics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update or insert analytics for the course and lecturer
    INSERT INTO feedback_analytics (
        course_id,
        lecturer_id,
        total_feedbacks,
        average_rating,
        rating_1_count,
        rating_2_count,
        rating_3_count,
        rating_4_count,
        rating_5_count,
        last_calculated
    )
    SELECT 
        NEW.course_id,
        NEW.lecturer_id,
        COUNT(*) as total_feedbacks,
        ROUND(AVG(rating)::numeric, 2) as average_rating,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as rating_1_count,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as rating_2_count,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as rating_3_count,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as rating_4_count,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as rating_5_count,
        CURRENT_TIMESTAMP
    FROM feedback 
    WHERE course_id = NEW.course_id 
    AND lecturer_id = NEW.lecturer_id 
    AND is_approved = TRUE
    ON CONFLICT (course_id, lecturer_id) 
    DO UPDATE SET
        total_feedbacks = EXCLUDED.total_feedbacks,
        average_rating = EXCLUDED.average_rating,
        rating_1_count = EXCLUDED.rating_1_count,
        rating_2_count = EXCLUDED.rating_2_count,
        rating_3_count = EXCLUDED.rating_3_count,
        rating_4_count = EXCLUDED.rating_4_count,
        rating_5_count = EXCLUDED.rating_5_count,
        last_calculated = EXCLUDED.last_calculated;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function for comprehensive audit logging
CREATE OR REPLACE FUNCTION log_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, record_id, action, new_values)
        VALUES (TG_TABLE_NAME, NEW.feedback_id, 'INSERT', row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, record_id, action, old_values, new_values)
        VALUES (TG_TABLE_NAME, NEW.feedback_id, 'UPDATE', row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, record_id, action, old_values)
        VALUES (TG_TABLE_NAME, OLD.feedback_id, 'DELETE', row_to_json(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS for Automated Operations
-- =============================================

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at 
    BEFORE UPDATE ON courses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger to validate feedback submission
CREATE TRIGGER trigger_validate_feedback
    BEFORE INSERT ON feedback
    FOR EACH ROW
    EXECUTE FUNCTION validate_feedback_submission();

-- Trigger to update analytics when feedback changes
CREATE TRIGGER trigger_update_analytics
    AFTER INSERT OR UPDATE OR DELETE ON feedback
    FOR EACH ROW
    EXECUTE FUNCTION update_feedback_analytics();

-- Trigger for audit logging
CREATE TRIGGER trigger_feedback_audit
    AFTER INSERT OR UPDATE OR DELETE ON feedback
    FOR EACH ROW
    EXECUTE FUNCTION log_changes();

-- =============================================
-- VIEWS for Simplified Queries
-- =============================================

-- View for student dashboard
CREATE OR REPLACE VIEW student_dashboard_view AS
SELECT 
    s.student_id,
    u.username,
    s.student_number,
    s.first_name,
    s.last_name,
    s.program,
    s.academic_year,
    s.semester,
    COUNT(DISTINCT se.course_id) as enrolled_courses,
    COUNT(DISTINCT f.feedback_id) as feedbacks_submitted
FROM students s
JOIN users u ON s.user_id = u.user_id
LEFT JOIN student_enrollments se ON s.student_id = se.student_id AND se.status = 'enrolled'
LEFT JOIN feedback f ON s.student_id = f.student_id
WHERE u.is_active = TRUE
GROUP BY s.student_id, u.username, s.student_number, s.first_name, s.last_name, s.program, s.academic_year, s.semester;

-- View for lecturer dashboard
CREATE OR REPLACE VIEW lecturer_dashboard_view AS
SELECT 
    l.lecturer_id,
    u.username,
    l.staff_number,
    l.first_name,
    l.last_name,
    l.department,
    COUNT(DISTINCT ca.course_id) as courses_teaching,
    COALESCE(SUM(fa.total_feedbacks), 0) as total_feedbacks,
    COALESCE(ROUND(AVG(fa.average_rating), 2), 0) as overall_rating
FROM lecturers l
JOIN users u ON l.user_id = u.user_id
LEFT JOIN course_assignments ca ON l.lecturer_id = ca.lecturer_id AND ca.is_active = TRUE
LEFT JOIN feedback_analytics fa ON l.lecturer_id = fa.lecturer_id
WHERE u.is_active = TRUE
GROUP BY l.lecturer_id, u.username, l.staff_number, l.first_name, l.last_name, l.department;

-- View for detailed feedback with all related information
CREATE OR REPLACE VIEW feedback_details_view AS
SELECT 
    f.feedback_id,
    f.student_id,
    s.first_name || ' ' || s.last_name as student_name,
    s.student_number,
    f.course_id,
    c.course_code,
    c.course_name,
    f.lecturer_id,
    l.first_name || ' ' || l.last_name as lecturer_name,
    f.comments,
    f.rating,
    f.academic_year,
    f.semester,
    f.submission_date,
    f.is_approved,
    f.is_anonymous
FROM feedback f
JOIN students s ON f.student_id = s.student_id
JOIN courses c ON f.course_id = c.course_id
JOIN lecturers l ON f.lecturer_id = l.lecturer_id;

-- View for admin dashboard
CREATE OR REPLACE VIEW admin_dashboard_view AS
SELECT 
    (SELECT COUNT(*) FROM users WHERE user_type = 'student' AND is_active = TRUE) as active_students,
    (SELECT COUNT(*) FROM users WHERE user_type = 'lecturer' AND is_active = TRUE) as active_lecturers,
    (SELECT COUNT(*) FROM courses WHERE is_active = TRUE) as active_courses,
    (SELECT COUNT(*) FROM feedback WHERE is_approved = TRUE) as approved_feedbacks,
    (SELECT ROUND(AVG(rating), 2) FROM feedback WHERE is_approved = TRUE) as overall_rating_avg,
    (SELECT COUNT(*) FROM feedback WHERE submission_date >= CURRENT_DATE - INTERVAL '7 days') as feedbacks_last_7_days;

-- =============================================
-- Display created tables and views
-- =============================================
SELECT 'Comprehensive schema created successfully!' as status;

-- Show all tables
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Show all views
SELECT 
    table_name as view_name
FROM information_schema.views 
WHERE table_schema = 'public' 
ORDER BY table_name;