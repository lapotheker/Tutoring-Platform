-- -- Drop existing tables if they exist (in reverse order of dependencies)
-- DROP TABLE IF EXISTS admin_action;
-- DROP TABLE IF EXISTS reported_item;
-- DROP TABLE IF EXISTS in_site_message;
-- DROP TABLE IF EXISTS sample_material;
-- DROP TABLE IF EXISTS tutor_profile_photo;
-- DROP TABLE IF EXISTS tutor_profile_language;
-- DROP TABLE IF EXISTS tutor_profile_subject_tag;
-- DROP TABLE IF EXISTS tutor_profile_course;
-- DROP TABLE IF EXISTS tutor_profile;
-- DROP TABLE IF EXISTS language;
-- DROP TABLE IF EXISTS subject_tag;
-- DROP TABLE IF EXISTS course_number;
-- DROP TABLE IF EXISTS user;

-- -- User table
-- CREATE TABLE user (
--     user_id INT AUTO_INCREMENT PRIMARY KEY,
--     full_name VARCHAR(255) NOT NULL,
--     sfsu_email VARCHAR(255) NOT NULL UNIQUE,
--     password_hash VARCHAR(255) NOT NULL,
--     role ENUM('Student', 'Tutor', 'Administrator') NOT NULL,
--     account_status ENUM('Active', 'Disabled') NOT NULL DEFAULT 'Active',
--     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     last_login_at TIMESTAMP NULL,
--     CONSTRAINT chk_email CHECK (sfsu_email LIKE '%@sfsu.edu')
-- );

-- -- Course Number table
-- CREATE TABLE course_number (
--     course_id INT AUTO_INCREMENT PRIMARY KEY,
--     code VARCHAR(50) NOT NULL UNIQUE,
--     title VARCHAR(255),
--     department VARCHAR(50),
--     notes TEXT
-- );

-- -- Subject Tag table
-- CREATE TABLE subject_tag (
--     tag_id INT AUTO_INCREMENT PRIMARY KEY,
--     tag_name VARCHAR(100) NOT NULL UNIQUE,
--     description TEXT,
--     status ENUM('Active', 'Deprecated') NOT NULL DEFAULT 'Active'
-- );

-- -- Language table
-- CREATE TABLE language (
--     language_id INT AUTO_INCREMENT PRIMARY KEY,
--     language_name VARCHAR(100) NOT NULL UNIQUE,
--     status ENUM('Active', 'Deprecated') NOT NULL DEFAULT 'Active'
-- );

-- -- Tutor Profile table
-- CREATE TABLE tutor_profile (
--     tutor_profile_id INT AUTO_INCREMENT PRIMARY KEY,
--     tutor_user_id INT NOT NULL,
--     display_name VARCHAR(255) NOT NULL,
--     hourly_rate DECIMAL(10, 2) NOT NULL,
--     availability_summary TEXT NOT NULL,
--     approval_status ENUM('Pending', 'Approved', 'Rejected', 'Removed') NOT NULL DEFAULT 'Pending',
--     visibility ENUM('Public', 'Hidden') NOT NULL DEFAULT 'Public',
--     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     created_by INT NOT NULL,
--     updated_by INT NOT NULL,
--     FOREIGN KEY (tutor_user_id) REFERENCES user(user_id) ON DELETE CASCADE,
--     FOREIGN KEY (created_by) REFERENCES user(user_id),
--     FOREIGN KEY (updated_by) REFERENCES user(user_id)
-- );

-- -- Tutor Profile Course (junction table)
-- CREATE TABLE tutor_profile_course (
--     tutor_profile_id INT NOT NULL,
--     course_id INT NOT NULL,
--     PRIMARY KEY (tutor_profile_id, course_id),
--     FOREIGN KEY (tutor_profile_id) REFERENCES tutor_profile(tutor_profile_id) ON DELETE CASCADE,
--     FOREIGN KEY (course_id) REFERENCES course_number(course_id) ON DELETE CASCADE
-- );

-- -- Tutor Profile Subject Tag (junction table)
-- CREATE TABLE tutor_profile_subject_tag (
--     tutor_profile_id INT NOT NULL,
--     tag_id INT NOT NULL,
--     PRIMARY KEY (tutor_profile_id, tag_id),
--     FOREIGN KEY (tutor_profile_id) REFERENCES tutor_profile(tutor_profile_id) ON DELETE CASCADE,
--     FOREIGN KEY (tag_id) REFERENCES subject_tag(tag_id) ON DELETE CASCADE
-- );

-- -- Tutor Profile Language (junction table)
-- CREATE TABLE tutor_profile_language (
--     tutor_profile_id INT NOT NULL,
--     language_id INT NOT NULL,
--     PRIMARY KEY (tutor_profile_id, language_id),
--     FOREIGN KEY (tutor_profile_id) REFERENCES tutor_profile(tutor_profile_id) ON DELETE CASCADE,
--     FOREIGN KEY (language_id) REFERENCES language(language_id) ON DELETE CASCADE
-- );

-- -- Tutor Profile Photo table
-- CREATE TABLE tutor_profile_photo (
--     media_id INT AUTO_INCREMENT PRIMARY KEY,
--     tutor_profile_id INT NOT NULL,
--     file_path VARCHAR(500) NOT NULL,
--     caption TEXT,
--     policy_check ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
--     uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (tutor_profile_id) REFERENCES tutor_profile(tutor_profile_id) ON DELETE CASCADE
-- );

-- -- Sample Material table
-- CREATE TABLE sample_material (
--     media_id INT AUTO_INCREMENT PRIMARY KEY,
--     tutor_profile_id INT NOT NULL,
--     title VARCHAR(255),
--     type ENUM('PDF', 'Image', 'Link') NOT NULL,
--     file_path VARCHAR(500) NOT NULL,
--     policy_check ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
--     uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (tutor_profile_id) REFERENCES tutor_profile(tutor_profile_id) ON DELETE CASCADE
-- );

-- -- In-Site Message table
-- CREATE TABLE in_site_message (
--     message_id INT AUTO_INCREMENT PRIMARY KEY,
--     sender_user_id INT NOT NULL,
--     recipient_user_id INT NOT NULL,
--     message TEXT NOT NULL,
--     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     message_status ENUM('Sent', 'Reported', 'Removed') NOT NULL DEFAULT 'Sent',
--     linked_report_id INT NULL,
--     FOREIGN KEY (sender_user_id) REFERENCES user(user_id) ON DELETE CASCADE,
--     FOREIGN KEY (recipient_user_id) REFERENCES user(user_id) ON DELETE CASCADE
-- );

-- -- Reported Item table
-- CREATE TABLE reported_item (
--     report_id INT AUTO_INCREMENT PRIMARY KEY,
--     target_type ENUM('Tutor Profile', 'In-Site Message', 'User') NOT NULL,
--     target_id INT NOT NULL,
--     report_reason ENUM('Harassment/Abuse', 'Inappropriate Content', 'Spam/Solicitation', 'Privacy/Safety', 'Other') NOT NULL,
--     details TEXT,
--     status ENUM('New', 'Under Review', 'Resolved', 'Dismissed') NOT NULL DEFAULT 'New',
--     created_by INT NOT NULL,
--     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     resolved_by INT NULL,
--     resolved_at TIMESTAMP NULL,
--     resolution_notes TEXT,
--     FOREIGN KEY (created_by) REFERENCES user(user_id) ON DELETE CASCADE,
--     FOREIGN KEY (resolved_by) REFERENCES user(user_id)
-- );

-- -- Add foreign key for linked_report_id after reported_item table is created
-- ALTER TABLE in_site_message
--     ADD FOREIGN KEY (linked_report_id) REFERENCES reported_item(report_id);

-- -- Admin Action table
-- CREATE TABLE admin_action (
--     admin_action_id INT AUTO_INCREMENT PRIMARY KEY,
--     action_type ENUM('ApproveProfile', 'RejectProfile', 'RemoveListing', 'DisableUser', 'ReenableUser', 'RemoveMessage') NOT NULL,
--     target_type ENUM('Tutor Profile', 'In-Site Message', 'User') NOT NULL,
--     target_id INT NOT NULL,
--     reason_notes TEXT,
--     performed_by INT NOT NULL,
--     timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     originating_report_id INT NULL,
--     FOREIGN KEY (performed_by) REFERENCES user(user_id) ON DELETE CASCADE,
--     FOREIGN KEY (originating_report_id) REFERENCES reported_item(report_id)
-- );

-- -- Indexes for better query performance
-- CREATE INDEX idx_user_email ON user(sfsu_email);
-- CREATE INDEX idx_user_role ON user(role);
-- CREATE INDEX idx_tutor_profile_status ON tutor_profile(approval_status);
-- CREATE INDEX idx_tutor_profile_visibility ON tutor_profile(visibility);
-- CREATE INDEX idx_message_sender ON in_site_message(sender_user_id);
-- CREATE INDEX idx_message_recipient ON in_site_message(recipient_user_id);
-- CREATE INDEX idx_message_status ON in_site_message(message_status);
-- CREATE INDEX idx_report_status ON reported_item(status);
-- CREATE INDEX idx_report_target ON reported_item(target_type, target_id);

-- -- =========================
-- -- SEED DATA FOR TUTORING APP
-- -- =========================

-- -- USERS (1 admin, 3 tutors, 4 students)
-- INSERT INTO user (user_id, full_name, sfsu_email, password_hash, role, account_status, last_login_at) VALUES
-- (1, 'Alice Admin',   'alice.admin@sfsu.edu',   '$2b$10$abcdefghijklmnopqrstuvabcdefghijklmnopqrstuvabcdefghi', 'Administrator', 'Active', NOW()),
-- (2, 'Darien Sngoeun','darien.sngoeun@sfsu.edu','$2b$10$abcdefghijklmnopqrstuvabcdefghijklmnopqrstuvabcdefghj', 'Tutor',         'Active', NOW()),
-- (3, 'Maya Chen',     'maya.chen@sfsu.edu',     '$2b$10$abcdefghijklmnopqrstuvabcdefghijklmnopqrstuvabcdefghk', 'Tutor',         'Active', NOW()),
-- (4, 'Victor Nguyen', 'victor.nguyen@sfsu.edu', '$2b$10$abcdefghijklmnopqrstuvabcdefghijklmnopqrstuvabcdefghi', 'Tutor',         'Active', NOW()),
-- (5, 'Jordan Lee',    'jordan.lee@sfsu.edu',    '$2b$10$abcdefghijklmnopqrstuvabcdefghijklmnopqrstuvabcdefghm', 'Student',       'Active', NOW()),
-- (6, 'Priya Patel',   'priya.patel@sfsu.edu',   '$2b$10$abcdefghijklmnopqrstuvabcdefghijklmnopqrstuvfghijklm',  'Student',       'Active', NOW()),
-- (7, 'Daniel Kim',    'daniel.kim@sfsu.edu',    '$2b$10$abcdefghijklmnopqrstuvabcdefghijklmnopqrstuvabcdefghi', 'Student',       'Active', NOW()),
-- (8, 'Sofia Garcia',  'sofia.garcia@sfsu.edu',  '$2b$10$abcdefghijklmnopqrstuvabcdefghijklmnopqrstuvabcdefghn', 'Student',       'Active', NOW());

-- -- COURSES
-- INSERT INTO course_number (course_id, code, title, department, notes) VALUES
-- (10, 'CSC 210', 'Introduction to Computer Science', 'CSC', NULL),
-- (11, 'CSC 220', 'Data Structures',                   'CSC', NULL),
-- (12, 'MATH 226','Calculus I',                        'MATH',NULL),
-- (13, 'PHYS 220','General Physics I',                 'PHYS',NULL),
-- (14, 'ENGL 214','Second Year Written Composition',   'ENGL',NULL);

-- -- SUBJECT TAGS
-- INSERT INTO subject_tag (tag_id, tag_name, description, status) VALUES
-- (20, 'Calculus',         'Differential and integral calculus', 'Active'),
-- (21, 'Linear Algebra',   'Matrices, vectors, eigen-stuff',     'Active'),
-- (22, 'Data Structures',  'Arrays, lists, trees, graphs',       'Active'),
-- (23, 'Web Development',  'Frontend/Backend fundamentals',      'Active'),
-- (24, 'Physics',          'Mechanics, E&M, problem solving',    'Active'),
-- (25, 'Writing',          'Academic writing and composition',   'Active');

-- -- LANGUAGES
-- INSERT INTO language (language_id, language_name, status) VALUES
-- (30, 'English',            'Active'),
-- (31, 'Spanish',            'Active'),
-- (32, 'Chinese (Mandarin)', 'Active'),
-- (33, 'Vietnamese',         'Active'),
-- (34, 'Korean',             'Active');

-- -- TUTOR PROFILES (approved & public)
-- INSERT INTO tutor_profile
-- (tutor_profile_id, tutor_user_id, display_name, hourly_rate, availability_summary,
--  approval_status, visibility, created_by, updated_by)
-- VALUES
-- (100, 2, 'Darien S.', 25.00, 'Weeknights 6–9pm; Sat mornings', 'Approved', 'Public', 1, 1),
-- (101, 3, 'Maya C.',   28.00, 'Mon/Wed/Fri afternoons; Sun 2–5', 'Approved', 'Public', 1, 1),
-- (102, 4, 'Victor N.', 22.50, 'Tue/Thu evenings; flexible on weekends', 'Approved', 'Public', 1, 1);

-- -- MAP PROFILES → COURSES
-- INSERT INTO tutor_profile_course (tutor_profile_id, course_id) VALUES
-- (100, 11),  -- Darien → CSC 220 Data Structures
-- (100, 12),  -- Darien → MATH 226 Calculus I
-- (101, 10),  -- Maya   → CSC 210
-- (101, 11),  -- Maya   → CSC 220
-- (102, 13),  -- Victor → PHYS 220
-- (102, 12);  -- Victor → MATH 226

-- -- MAP PROFILES → SUBJECT TAGS
-- INSERT INTO tutor_profile_subject_tag (tutor_profile_id, tag_id) VALUES
-- (100, 22), (100, 20),        -- Darien: Data Structures, Calculus
-- (101, 22), (101, 23),        -- Maya:   Data Structures, Web Dev
-- (102, 24), (102, 20);        -- Victor: Physics, Calculus

-- -- MAP PROFILES → LANGUAGES
-- INSERT INTO tutor_profile_language (tutor_profile_id, language_id) VALUES
-- (100, 30), (100, 33),        -- Darien: English, Vietnamese
-- (101, 30), (101, 32),        -- Maya:   English, Mandarin
-- (102, 30), (102, 34);        -- Victor: English, Korean

-- -- PROFILE PHOTOS (Approved)
-- INSERT INTO tutor_profile_photo (media_id, tutor_profile_id, file_path, caption, policy_check) VALUES
-- (2000, 100, '/media/tutors/100.jpg', 'Profile photo - Darien', 'Approved'),
-- (2001, 101, '/media/tutors/101.jpg', 'Profile photo - Maya',   'Approved'),
-- (2002, 102, '/media/tutors/102.jpg', 'Profile photo - Victor', 'Approved');

-- -- SAMPLE MATERIALS
-- INSERT INTO sample_material (media_id, tutor_profile_id, title, type, file_path, policy_check) VALUES
-- (3000, 100, 'Trees & Graphs Cheatsheet', 'PDF',  '/media/samples/darien-ds-cheatsheet.pdf', 'Approved'),
-- (3001, 101, 'React Hooks Quickstart',     'Link', 'https://example.edu/react-hooks-notes',  'Approved'),
-- (3002, 102, 'Kinematics Problem Set',     'PDF',  '/media/samples/victor-physics-kinematics.pdf', 'Approved');

-- -- MESSAGES (one will be reported)
-- INSERT INTO in_site_message (message_id, sender_user_id, recipient_user_id, message, message_status) VALUES
-- (1000, 5, 2, 'Hi Darien, do you have time for DS this week?',            'Sent'),
-- (1001, 2, 5, 'Yes, I can do Wed 7pm. Bring recent HW.',                   'Sent'),
-- (1002, 6, 4, 'Your profile photo looks fake. Not cool.',                  'Reported'), -- will be linked to a report
-- (1003, 7, 3, 'Hi Maya, can we cover Big-O for arrays and trees?',         'Sent');

-- -- REPORTS (link one to message 1002)
-- INSERT INTO reported_item
-- (report_id, target_type, target_id, report_reason, details, status, created_by, resolved_by)
-- VALUES
-- (5000, 'In-Site Message', 1002, 'Harassment/Abuse', 'Rude/abusive message', 'Under Review', 6, NULL);

-- -- Link the message to the report
-- UPDATE in_site_message SET linked_report_id = 5000 WHERE message_id = 1002;

-- -- ADMIN ACTION (log an action based on the report)
-- INSERT INTO admin_action
-- (admin_action_id, action_type, target_type, target_id, reason_notes, performed_by, originating_report_id)
-- VALUES
-- (9000, 'RemoveMessage', 'In-Site Message', 1002, 'Removed abusive message per policy', 1, 5000);

-- -- OPTIONAL: a second report on a tutor profile (example)
-- INSERT INTO reported_item
-- (report_id, target_type, target_id, report_reason, details, status, created_by, resolved_by, resolved_at, resolution_notes)
-- VALUES
-- (5001, 'Tutor Profile', 102, 'Inappropriate Content', 'Off-topic sample material', 'Resolved', 8, 1, NOW(), 'Content edited; profile remains visible');

-- INSERT INTO admin_action
-- (admin_action_id, action_type, target_type, target_id, reason_notes, performed_by, originating_report_id)
-- VALUES
-- (9001, 'ApproveProfile', 'Tutor Profile', 102, 'Profile reviewed and approved after edit', 1, 5001);



