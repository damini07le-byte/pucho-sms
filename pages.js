// ========================================
// PAGE COMPONENTS
// ========================================

// Mock Data
const staffMockData = {
    students: [
        { id: 1, name: "Rahul Sharma", class: "10-A", roll: 45, attendance: "95%" },
        { id: 2, name: "Priya Singh", class: "10-A", roll: 46, attendance: "92%" },
        { id: 3, name: "Amit Kumar", class: "9-B", roll: 12, attendance: "88%" },
        { id: 4, name: "Sneha Gupta", class: "10-B", roll: 23, attendance: "97%" }
    ],
    exams: [
        { id: 1, name: "Mid-Term 2025", class: "10-A", subject: "Maths", date: "2025-10-15" },
        { id: 2, name: "Unit Test 1", class: "9-All", subject: "Science", date: "2025-08-20" }
    ]
};

const Pages = {
    // Inner Templates for SPA Dashboard switching
    staffInner: {
        dashboard: `
            <div class="fade-in">
                <div class="content-header">
                    <h2>Staff Dashboard</h2>
                    <p>Welcome, Teacher. Here is your daily overview.</p>
                </div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>Assigned Classes</h3>
                        <div class="stat-value">3</div>
                        <div class="stat-label">Classes 10-A, 10-B, 9-A</div>
                    </div>
                    <div class="stat-card">
                        <h3>Total Students</h3>
                        <div class="stat-value">135</div>
                        <div class="stat-label">Under your mentorship</div>
                    </div>
                    <div class="stat-card">
                        <h3>Attendance Today</h3>
                        <div class="stat-value">92%</div>
                        <div class="stat-label">Average across classes</div>
                    </div>
                     <div class="stat-card">
                        <h3>Pending Tasks</h3>
                        <div class="stat-value">2</div>
                        <div class="stat-label">Marks upload pending</div>
                    </div>
                </div>
                <section class="section">
                    <h2 class="section-title">Quick Actions</h2>
                    <div class="card-grid">
                        <div class="card">
                            <h3>Mark Attendance</h3>
                            <p>Mark daily attendance for your assigned classes.</p>
                            <button class="btn btn-primary mt-lg" onclick="app.openModal('markAttendanceModal')">Mark Attendance</button>
                        </div>
                        <div class="card">
                            <h3>Upload Marks</h3>
                            <p>Upload results for completed examinations.</p>
                            <button class="btn btn-primary mt-lg" onclick="app.openModal('uploadMarksModal')">Upload Marks</button>
                        </div>
                         <div class="card">
                            <h3>View Students</h3>
                            <p>Access student profiles and academic records.</p>
                            <button class="btn btn-primary mt-lg menu-link" data-dashboard-page="students">Student List</button>
                        </div>
                        <div class="card">
                            <h3>Exam Schedule</h3>
                            <p>View upcoming exams and invigilation duties.</p>
                            <button class="btn btn-primary mt-lg menu-link" data-dashboard-page="exams">View Exams</button>
                        </div>
                    </div>
                </section>
                <!-- Modals -->
                <div id="markAttendanceModal" class="modal">
                    <div class="modal-content">
                        <span class="close" onclick="app.closeModal('markAttendanceModal')">&times;</span>
                        <h2>Mark Attendance</h2>
                        <form id="markAttendanceForm">
                             <div class="form-group">
                                <label>Class</label>
                                <select class="form-control"><option>10-A</option><option>10-B</option></select>
                            </div>
                            <div class="form-group">
                                <label>Date</label>
                                <input type="date" class="form-control" required>
                            </div>
                            <button type="submit" class="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>
                <div id="uploadMarksModal" class="modal">
                     <div class="modal-content">
                        <span class="close" onclick="app.closeModal('uploadMarksModal')">&times;</span>
                        <h2>Upload Marks</h2>
                        <form id="uploadMarksForm">
                             <div class="form-group">
                                <label>Exam</label>
                                <select class="form-control"><option>Mid-Term 2025</option></select>
                            </div>
                            <button type="submit" class="btn btn-primary">Upload</button>
                        </form>
                    </div>
                </div>
            </div>
        `,
        attendance: `
            <div class="fade-in">
                <div class="content-header"><h2>Attendance Management</h2><p>Track student attendance.</p></div>
                <div class="card"><h3>Recent Logs</h3><p>Attendance logs table here...</p></div>
            </div>
        `,
        exams: `
            <div class="fade-in">
                <div class="content-header"><h2>Exam Management</h2></div>
                <div class="data-table">
                    <table>
                        <thead><tr><th>Exam</th><th>Class</th><th>Date</th></tr></thead>
                        <tbody>
                            ${staffMockData.exams.map(e => `<tr><td>${e.name}</td><td>${e.class}</td><td>${e.date}</td></tr>`).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `,
        students: `
            <div class="fade-in">
                <div class="content-header"><h2>Student Directory</h2></div>
                <div class="data-table">
                    <table>
                        <thead><tr><th>Name</th><th>Class</th><th>Roll</th></tr></thead>
                        <tbody>
                            ${staffMockData.students.map(s => `<tr><td>${s.name}</td><td>${s.class}</td><td>${s.roll}</td></tr>`).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `
    },

    parentInner: {
        dashboard: `
            <div class="fade-in">
                <div class="content-header"><h2>Parent Dashboard</h2><p>Welcome, Parent.</p></div>
                <div class="stats-grid">
                    <div class="stat-card"><h3>Attendance</h3><div class="stat-value">96%</div></div>
                    <div class="stat-card"><h3>Fee Status</h3><div class="stat-value">Paid</div></div>
                </div>
                <section class="section">
                    <h2 class="section-title">Quick Access</h2>
                    <div class="card-grid">
                        <div class="card"><h3>View Attendance</h3><button class="btn btn-primary mt-lg menu-link" data-dashboard-page="attendance">View</button></div>
                        <div class="card"><h3>Fee Status</h3><button class="btn btn-primary mt-lg menu-link" data-dashboard-page="fee">Pay Fees</button></div>
                    </div>
                </section>
            </div>
        `,
        attendance: `<div class="fade-in"><h2>Attendance History</h2><p>Viewing attendance records...</p></div>`,
        fee: `<div class="fade-in"><h2>Fee Status</h2><p>No outstanding dues.</p></div>`,
        results: `<div class="fade-in"><h2>Exam Results</h2><p>Recent results will appear here.</p></div>`
    },

    // ========================================
    // HOME PAGE
    // ========================================
    home: () => `
        <div class="landing-page">
            <!-- Navigation -->
            <nav class="header">
                <div class="header-container">
                    <a href="/" class="logo" data-link>
                        <img src="assets/logo.png" alt="Logo">
                        Pucho Public School
                    </a>
                    <ul class="nav-menu">
                        <li><a href="/" data-link>Home</a></li>
                        <li><a href="#about" data-scroll>About</a></li>
                        <li><a href="#academics" data-scroll>Academics</a></li>
                        <li><a href="#contact" data-scroll>Contact</a></li>
                    </ul>
                    <div class="login-buttons">
                        <a href="/login/staff" class="btn btn-outline" data-link>Staff Login</a>
                        <a href="/login/parent" class="btn btn-primary" data-link>Parent Login</a>
                    </div>
                </div>
            </nav>

            <!-- Hero Section -->
            <section class="hero">
                <div class="hero-content">
                    <h1>Excellence in Education</h1>
                    <h2>Empowering Minds, Shaping Futures</h2>
                    <p>Welcome to Pucho Public School, where we nurture curiosity, creativity, and character. Join us in our journey of academic excellence and holistic development.</p>
                    <div class="hero-buttons">
                        <a href="#about" class="btn btn-white" data-scroll>Learn More</a>
                        <a href="#contact" class="btn btn-outline" style="color: white; border-color: white;" data-scroll>Contact Us</a>
                    </div>
                </div>
            </section>

            <!-- About Section -->
            <section id="about" class="section section-alt">
                <h2 class="section-title">About Our School</h2>
                <p class="section-text">
                    Established with a vision to provide world-class education, Pucho Public School combines traditional values with modern methodology. Our sprawling campus provides the perfect environment for learning and growth.
                </p>
                <div class="card-grid">
                    <div class="card">
                        <h3>Academic Excellence</h3>
                        <p>Our rigorous curriculum is designed to challenge students and foster critical thinking skills.</p>
                    </div>
                    <div class="card">
                        <h3>Holistic Development</h3>
                        <p>Beyond academics, we focus on sports, arts, and leadership to build well-rounded personalities.</p>
                    </div>
                    <div class="card">
                        <h3>State-of-the-art Facilities</h3>
                        <p>Smart classrooms, modern labs, and extensive sports facilities to support learning.</p>
                    </div>
                </div>
            </section>

            <!-- Academics/Admissions Section -->
            <section id="academics" class="section">
                <h2 class="section-title">Academics & Admissions</h2>
                <div class="contact-container">
                    <div class="card">
                        <h3>Academic Programs</h3>
                        <ul style="margin-left: 1.5rem; margin-top: 1rem; color: var(--text-gray); line-height: 1.8;">
                            <li>Primary Education (Grades 1-5)</li>
                            <li>Middle School (Grades 6-8)</li>
                            <li>Secondary Education (Grades 9-10)</li>
                            <li>Senior Secondary (Grades 11-12)</li>
                        </ul>
                    </div>
                    <div class="card">
                        <h3>Admissions Open</h3>
                        <p>Admissions for the academic year 2025-26 are now open. Apply now to secure a bright future for your child.</p>
                        <p style="margin-top: 1rem;"><strong>Eligibility:</strong> Based on entrance test and interview.</p>
                        <button class="btn btn-primary mt-lg">Apply Now</button>
                    </div>
                </div>
            </section>

            <!-- Contact Section -->
            <section id="contact" class="section section-alt">
                <h2 class="section-title">Get in Touch</h2>
                <div class="contact-container">
                    <div class="contact-info">
                        <h3>Contact Information</h3>
                        <div class="contact-details">
                            <div class="contact-item">
                                <strong>Address:</strong>
                                <p>123 Knowledge Park, Education City, New Delhi - 110001</p>
                            </div>
                            <div class="contact-item">
                                <strong>Phone:</strong>
                                <p>+91 98765 43210</p>
                            </div>
                            <div class="contact-item">
                                <strong>Email:</strong>
                                <p>info@puchopublicschool.edu.in</p>
                            </div>
                        </div>
                    </div>
                    <div class="contact-form">
                        <form id="contactForm">
                            <div class="form-group">
                                <label for="name">Your Name</label>
                                <input type="text" id="name" required>
                            </div>
                            <div class="form-group">
                                <label for="email">Email Address</label>
                                <input type="email" id="email" required>
                            </div>
                            <div class="form-group">
                                <label for="message">Message</label>
                                <textarea id="message" required></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary btn-full">Send Message</button>
                        </form>
                    </div>
                </div>
            </section>

            <!-- Footer -->
            <footer class="footer">
                <div class="footer-container">
                    <div class="footer-section">
                        <h3>Pucho Public School</h3>
                        <p>Empowering the next generation of leaders and innovators through quality education.</p>
                    </div>
                    <div class="footer-section">
                        <h3>Quick Links</h3>
                        <ul class="footer-links">
                            <li><a href="#about" data-scroll>About Us</a></li>
                            <li><a href="#academics" data-scroll>Academics</a></li>
                            <li><a href="#contact" data-scroll>Contact</a></li>
                            <li><a href="/login/admin" data-link style="font-size: 0.8rem; opacity: 0.6;">Admin Login</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h3>Connect With Us</h3>
                        <div class="social-links" style="margin-top: 1rem; display: flex; gap: 1rem;">
                            <a href="#">Facebook</a>
                            <a href="#">Twitter</a>
                            <a href="#">Instagram</a>
                        </div>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2025 Pucho Public School. All rights reserved.</p>
                </div>
            </footer>
        </div>
    `,

    // ========================================
    // STAFF LOGIN
    // ========================================
    staffLogin: () => `
        <div class="login-container">
            <div class="login-box">
                <div style="text-align: center; margin-bottom: 2rem;">
                     <a href="/" class="logo" style="justify-content: center; font-size: 1.5rem;" data-link>
                        <img src="assets/logo.png" alt="Logo" style="height: 40px;">
                        Pucho Public School
                    </a>
                </div>
                <h2>Staff Login</h2>
                <p>Access the school management system</p>
                
                <form id="staffLoginForm">
                    <div class="form-group">
                        <label for="staffEmail">Email / Staff ID</label>
                        <input type="text" id="staffEmail" required placeholder="staff@puchopublicschool.edu.in">
                    </div>
                    
                    <div class="form-group">
                        <label for="staffPassword">Password</label>
                        <input type="password" id="staffPassword" required placeholder="Enter your password">
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-full">Login</button>
                </form>
                
                <a href="/" class="back-link" data-link>← Back to Home</a>
            </div>
        </div>
    `,

    // ========================================
    // PARENT LOGIN
    // ========================================
    parentLogin: () => `
        <div class="login-container">
            <div class="login-box">
                <div style="text-align: center; margin-bottom: 2rem;">
                     <a href="/" class="logo" style="justify-content: center; font-size: 1.5rem;" data-link>
                        <img src="assets/logo.png" alt="Logo" style="height: 40px;">
                        Pucho Public School
                    </a>
                </div>
                <h2>Parent Login</h2>
                <p>View your child's academic progress</p>
                
                <form id="parentLoginForm">
                    <div class="form-group">
                        <label for="parentEmail">Email / Mobile Number</label>
                        <input type="text" id="parentEmail" required placeholder="parent@example.com or +91 98765 43210">
                    </div>
                    
                    <div class="form-group">
                        <label for="parentPassword">Password</label>
                        <input type="password" id="parentPassword" required placeholder="Enter your password">
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-full">Login</button>
                </form>
                
                <a href="/" class="back-link" data-link>← Back to Home</a>
            </div>
        </div>
    `,

    // ========================================
    // ADMIN LOGIN
    // ========================================
    adminLogin: () => `
        <div class="login-container">
            <div class="login-box">
                <div style="text-align: center; margin-bottom: 2rem;">
                     <a href="/" class="logo" style="justify-content: center; font-size: 1.5rem;" data-link>
                        <img src="assets/logo.png" alt="Logo" style="height: 40px;">
                        Pucho Public School
                    </a>
                </div>
                <h2>Admin Login</h2>
                <p>School Management System</p>
                
                <form id="adminLoginForm">
                    <div class="form-group">
                        <label for="adminUsername">Username</label>
                        <input type="text" id="adminUsername" required placeholder="admin">
                    </div>
                    
                    <div class="form-group">
                        <label for="adminPassword">Password</label>
                        <input type="password" id="adminPassword" required placeholder="Enter your password">
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-full">Login</button>
                </form>
                
                <a href="/" class="back-link" data-link>← Back to Home</a>
            </div>
        </div>
    `,

    // ========================================
    // STAFF DASHBOARD
    // ========================================
    staffDashboard: () => {
        const user = Auth.getUser();
        return `
            <div class="dashboard">
                <aside class="sidebar">
                    <h2>Staff Portal</h2>
                    <ul class="sidebar-menu">
                        <li><a href="#" class="active">Dashboard</a></li>
                        <li><a href="#">Assigned Classes</a></li>
                        <li><a href="#">Mark Attendance</a></li>
                        <li><a href="#">Upload Marks</a></li>
                        <li><a href="#">View Students</a></li>
                        <li><a href="#">Notices</a></li>
                        <li><a href="#" id="logoutBtn">Logout</a></li>
                    </ul>
                </aside>

                <main class="dashboard-content">
                    <div class="dashboard-header">
                        <h1>Staff Dashboard</h1>
                        <p>Welcome back, ${user.name}!</p>
                    </div>

                    <div class="stats-grid">
                        <div class="stat-card">
                            <h3>Assigned Classes</h3>
                            <div class="stat-value">3</div>
                            <div class="stat-label">Active Classes</div>
                        </div>
                        <div class="stat-card">
                            <h3>Total Students</h3>
                            <div class="stat-value">145</div>
                            <div class="stat-label">Under your supervision</div>
                        </div>
                        <div class="stat-card">
                            <h3>Attendance Today</h3>
                            <div class="stat-value">95%</div>
                            <div class="stat-label">138 / 145 present</div>
                        </div>
                        <div class="stat-card">
                            <h3>Pending Tasks</h3>
                            <div class="stat-value">5</div>
                            <div class="stat-label">Marks to upload</div>
                        </div>
                    </div>

                    <section class="section">
                        <h2 class="section-title">Quick Actions</h2>
                        <div class="card-grid">
                            <div class="card">
                                <h3>Mark Attendance</h3>
                                <p>Mark today's attendance for your assigned classes.</p>
                                <button class="btn btn-primary mt-lg">Mark Attendance</button>
                            </div>
                            <div class="card">
                                <h3>Upload Marks</h3>
                                <p>Upload exam marks and assessment scores.</p>
                                <button class="btn btn-primary mt-lg">Upload Marks</button>
                            </div>
                            <div class="card">
                                <h3>View Students</h3>
                                <p>View student profiles and academic records.</p>
                                <button class="btn btn-primary mt-lg">View Students</button>
                            </div>
                            <div class="card">
                                <h3>Notices</h3>
                                <p>View and post notices for students and parents.</p>
                                <button class="btn btn-primary mt-lg">View Notices</button>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        `;
    },

    // ========================================
    // PARENT DASHBOARD
    // ========================================
    parentDashboard: () => {
        const user = Auth.getUser();
        return `
            <div class="dashboard">
                <aside class="sidebar">
                    <h2>Parent Portal</h2>
                    <ul class="sidebar-menu">
                        <li><a href="#" class="active">Dashboard</a></li>
                        <li><a href="#">Student Profile</a></li>
                        <li><a href="#">Attendance</a></li>
                        <li><a href="#">Fees Status</a></li>
                        <li><a href="#">Exam Results</a></li>
                        <li><a href="#">Notices</a></li>
                        <li><a href="#" id="logoutBtn">Logout</a></li>
                    </ul>
                </aside>

                <main class="dashboard-content">
                    <div class="dashboard-header">
                        <h1>Parent Dashboard</h1>
                        <p>Welcome, ${user.name}!</p>
                    </div>

                    <div class="card mb-lg">
                        <h3>Student Information</h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem; color: var(--text-gray);">
                            <div><strong style="color: var(--primary-blue);">Name:</strong><br>Rahul Sharma</div>
                            <div><strong style="color: var(--primary-blue);">Class:</strong><br>10th Standard - Section A</div>
                            <div><strong style="color: var(--primary-blue);">Roll Number:</strong><br>2025-10A-045</div>
                            <div><strong style="color: var(--primary-blue);">Admission Year:</strong><br>2020</div>
                        </div>
                    </div>

                    <div class="stats-grid">
                        <div class="stat-card">
                            <h3>Attendance</h3>
                            <div class="stat-value">96.2%</div>
                            <div class="stat-label">This Month</div>
                        </div>
                        <div class="stat-card">
                            <h3>Fee Status</h3>
                            <div class="stat-value">Paid</div>
                            <div class="stat-label">All dues cleared</div>
                        </div>
                        <div class="stat-card">
                            <h3>Last Exam</h3>
                            <div class="stat-value">87.5%</div>
                            <div class="stat-label">Mid-term examination</div>
                        </div>
                        <div class="stat-card">
                            <h3>Class Rank</h3>
                            <div class="stat-value">5th</div>
                            <div class="stat-label">Out of 45 students</div>
                        </div>
                    </div>

                    <section class="section">
                        <h2 class="section-title">Quick Access</h2>
                        <div class="card-grid">
                            <div class="card">
                                <h3>View Attendance</h3>
                                <p>Check your child's attendance records and monthly reports.</p>
                                <button class="btn btn-primary mt-lg">View Attendance</button>
                            </div>
                            <div class="card">
                                <h3>Fee Status</h3>
                                <p>View fee payment history and pending dues.</p>
                                <button class="btn btn-primary mt-lg">View Fees</button>
                            </div>
                            <div class="card">
                                <h3>Exam Results</h3>
                                <p>View exam results and performance analysis.</p>
                                <button class="btn btn-primary mt-lg">View Results</button>
                            </div>
                            <div class="card">
                                <h3>Notices</h3>
                                <p>View important notices and announcements from school.</p>
                                <button class="btn btn-primary mt-lg">View Notices</button>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        `;
    },

    // ========================================
    // ADMIN DASHBOARD
    // ========================================
    adminDashboard: () => {
        const user = Auth.getUser();
        return `
            <div class="dashboard">
                <aside class="sidebar">
                    <h2>Admin Panel</h2>
                    <ul class="sidebar-menu">
                        <li><a href="#" class="active">Dashboard</a></li>
                        <li><a href="#">Create Staff</a></li>
                        <li><a href="#">Create Parent</a></li>
                        <li><a href="#">Admissions</a></li>
                        <li><a href="#">Fees Management</a></li>
                        <li><a href="#">Attendance</a></li>
                        <li><a href="#">Reports</a></li>
                        <li><a href="#" id="logoutBtn">Logout</a></li>
                    </ul>
                </aside>

                <main class="dashboard-content">
                    <div class="dashboard-header">
                        <h1>Admin Dashboard</h1>
                        <p>Welcome, Administrator!</p>
                    </div>

                    <div class="stats-grid">
                        <div class="stat-card">
                            <h3>Total Students</h3>
                            <div class="stat-value">1,245</div>
                            <div class="stat-label">Active Students</div>
                        </div>
                        <div class="stat-card">
                            <h3>Total Staff</h3>
                            <div class="stat-value">87</div>
                            <div class="stat-label">Teaching & Non-teaching</div>
                        </div>
                        <div class="stat-card">
                            <h3>Pending Admissions</h3>
                            <div class="stat-value">12</div>
                            <div class="stat-label">Awaiting Approval</div>
                        </div>
                        <div class="stat-card">
                            <h3>Fees Collected</h3>
                            <div class="stat-value">₹45.2L</div>
                            <div class="stat-label">This Month</div>
                        </div>
                    </div>

                    <section class="section">
                        <h2 class="section-title">Management Sections</h2>
                        <div class="card-grid">
                            <div class="card">
                                <h3>Create Staff Account</h3>
                                <p>Add new staff members and assign roles.</p>
                                <button class="btn btn-primary mt-lg">Create Staff</button>
                            </div>
                            <div class="card">
                                <h3>Create Parent Account</h3>
                                <p>Create parent accounts linked to students.</p>
                                <button class="btn btn-primary mt-lg">Create Parent</button>
                            </div>
                            <div class="card">
                                <h3>View Admissions</h3>
                                <p>Review and approve pending admission applications.</p>
                                <button class="btn btn-primary mt-lg">View Admissions</button>
                            </div>
                            <div class="card">
                                <h3>Fees Management</h3>
                                <p>Track fee payments and manage outstanding dues.</p>
                                <button class="btn btn-primary mt-lg">Manage Fees</button>
                            </div>
                            <div class="card">
                                <h3>Attendance Overview</h3>
                                <p>View overall attendance statistics and reports.</p>
                                <button class="btn btn-primary mt-lg">View Attendance</button>
                            </div>
                            <div class="card">
                                <h3>Generate Reports</h3>
                                <p>Generate comprehensive school management reports.</p>
                                <button class="btn btn-primary mt-lg">Generate Reports</button>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        `;
    },

    // ========================================
    // 404 PAGE
    // ========================================
    notFound: () => `
        <div class="login-container">
            <div class="login-box" style="text-align: center;">
                <h1 style="font-size: 4rem; color: var(--primary-blue); margin-bottom: 1rem;">404</h1>
                <h2>Page Not Found</h2>
                <p style="margin: 1.5rem 0;">The page you are looking for does not exist.</p>
                <a href="/" class="btn btn-primary" data-link>Go to Home</a>
            </div>
        </div>
    `
};
