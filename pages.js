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
    ],
    notices: [
        { title: "Annual Sports Day", date: "12 Oct 2025", content: "Sports day will be held on 20th Oct. All class teachers to submit participant lists." },
        { title: "Diwali Holidays", date: "10 Oct 2025", content: "School will remain closed from 28th Oct to 2nd Nov for Diwali break." }
    ]
};

const Pages = {
    // Inner Templates for SPA Dashboard switching
    staffInner: {
        dashboard: `
            <div class="fade-in">
                <div class="admin-stats-grid">
                    <div class="admin-stat-card">
                        <div class="stat-label">Assigned Classes</div>
                        <div class="stat-value">3</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">10-A, 10-B, 9-A</div>
                    </div>
                    <div class="admin-stat-card">
                        <div class="stat-label">Total Students</div>
                        <div class="stat-value">135</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">Across your classes</div>
                    </div>
                    <div class="admin-stat-card">
                        <div class="stat-label">Attendance Today</div>
                        <div class="stat-value">92%</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">Average daily rate</div>
                    </div>
                     <div class="admin-stat-card">
                        <div class="stat-label">Pending Tasks</div>
                        <div class="stat-value">2</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">Marks upload pending</div>
                    </div>
                </div>
                <section class="section slide-up">
                    <h2 class="section-title">Quick Actions</h2>
                    <div class="card-grid">
                        <div class="card card-premium delay-100">
                            <h3>Mark Attendance</h3>
                            <p>Mark daily attendance for your assigned classes.</p>
                            <button class="btn btn-white mt-lg" onclick="app.openModal('markAttendanceModal')">Mark Attendance</button>
                        </div>
                        <div class="card card-premium delay-200">
                            <h3>Upload Marks</h3>
                            <p>Upload results for completed examinations.</p>
                            <button class="btn btn-white mt-lg" onclick="app.openModal('uploadMarksModal')">Upload Marks</button>
                        </div>
                         <div class="card card-premium delay-300">
                            <h3>View Students</h3>
                            <p>Access student profiles and academic records.</p>
                            <button class="btn btn-white mt-lg menu-link" data-dashboard-page="students">Student List</button>
                        </div>
                        <div class="card card-premium delay-100">
                            <h3>Exam Schedule</h3>
                            <p>View upcoming exams and invigilation duties.</p>
                            <button class="btn btn-white mt-lg menu-link" data-dashboard-page="exams">View Exams</button>
                        </div>
                    </div>
                </section>
                <!-- Modals -->
                <!-- Modals -->
                <div id="markAttendanceModal" class="modal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>Mark Attendance</h3>
                            <button class="modal-close" onclick="app.closeModal('markAttendanceModal')">&times;</button>
                        </div>
                        <form id="markAttendanceForm">
                             <div class="form-group">
                                <select class="form-control" id="swMarkClass" required>
                                    <option value="">Select Class</option>
                                    <option value="10-A">10-A</option>
                                    <option value="10-B">10-B</option>
                                </select>
                                <label for="swMarkClass">Class</label>
                            </div>
                            <div class="form-group">
                                <input type="date" class="form-control" id="swMarkDate" required placeholder=" ">
                                <label for="swMarkDate">Date</label>
                            </div>
                            <button type="submit" class="btn btn-primary btn-full mt-lg">Submit</button>
                        </form>
                    </div>
                </div>
                <div id="uploadMarksModal" class="modal">
                     <div class="modal-content">
                        <div class="modal-header">
                            <h3>Upload Marks</h3>
                            <button class="modal-close" onclick="app.closeModal('uploadMarksModal')">&times;</button>
                        </div>
                        <form id="uploadMarksForm">
                             <div class="form-group">
                                <select class="form-control" id="swUpExam" required>
                                    <option value="">Select Exam</option>
                                    <option value="Mid-Term 2025">Mid-Term 2025</option>
                                </select>
                                <label for="swUpExam">Exam</label>
                            </div>
                            <button type="submit" class="btn btn-primary btn-full mt-lg">Upload</button>
                        </form>
                    </div>
                </div>
            </div>
        `,
        attendance: `
            <div class="fade-in">
                <div class="card"><h3>Recent Logs</h3><p>Attendance logs table here...</p></div>
            </div>
        `,
        exams: `
            <div class="fade-in">
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

        assignedClasses: `
            <div class="fade-in">
                <div class="data-table">
                    <table>
                        <thead><tr><th>Class</th><th>Subject</th><th>Students</th><th>Schedule</th></tr></thead>
                        <tbody>
                            <tr><td>10-A</td><td>Science</td><td>45</td><td>Mon, Wed, Fri</td></tr>
                            <tr><td>10-B</td><td>Science</td><td>42</td><td>Tue, Thu, Sat</td></tr>
                            <tr><td>9-A</td><td>Physics</td><td>48</td><td>Mon-Fri</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `,
        markAttendance: `
            <div class="fade-in">
                <div class="content-header"><h2>Mark Attendance</h2><p>Daily attendance log.</p></div>
                 <div class="card mb-lg">
                    <button class="btn btn-primary" onclick="app.openModal('markAttendanceModal')">+ Mark New Attendance</button>
                </div>
                <div class="data-table">
                    <table>
                        <thead><tr><th>Date</th><th>Class</th><th>Status</th><th>Submitted By</th></tr></thead>
                        <tbody>
                            <tr><td>2025-10-24</td><td>10-A</td><td><span style="color: green;">Success</span></td><td>You</td></tr>
                            <tr><td>2025-10-24</td><td>10-B</td><td><span style="color: green;">Success</span></td><td>You</td></tr>
                            <tr><td>2025-10-23</td><td>9-A</td><td><span style="color: orange;">Late</span></td><td>You</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `,
        uploadMarks: `
            <div class="fade-in">
                <div class="content-header"><h2>Upload Marks</h2><p>Manage exam results.</p></div>
                <div class="card mb-lg">
                    <button class="btn btn-primary" onclick="app.openModal('uploadMarksModal')">+ Upload New Marks</button>
                </div>
                <div class="data-table">
                    <table>
                        <thead><tr><th>Exam Name</th><th>Class</th><th>Subject</th><th>Status</th></tr></thead>
                        <tbody>
                            <tr><td>Mid-Term 2025</td><td>10-A</td><td>Science</td><td><span style="color: green;">Published</span></td></tr>
                            <tr><td>Unit Test 1</td><td>9-A</td><td>Physics</td><td><span style="color: orange;">Draft</span></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `,
        notices: `
            <div class="fade-in">
                 <div class="content-header"><h2>Notices Board</h2><p>Important announcements.</p></div>
                 <div class="card-grid">
                    <div class="card">
                        <h3>Annual Sports Day</h3>
                        <p class="text-sm text-gray">Posted on: 12 Oct 2025</p>
                        <p style="margin-top:0.5rem;">Sports day will be held on 20th Oct. All class teachers to submit participant lists.</p>
                    </div>
                    <div class="card">
                        <h3>Diwali Holidays</h3>
                        <p class="text-sm text-gray">Posted on: 10 Oct 2025</p>
                        <p style="margin-top:0.5rem;">School will remain closed from 28th Oct to 2nd Nov for Diwali break.</p>
                    </div>
                 </div>
            </div>
        `,
        students: `
            <div class="fade-in">
                <div class="content-header"><h2>Student Directory</h2></div>
                <div class="data-table">
                    <table>
                        <thead><tr><th>Name</th><th>Class</th><th>Roll</th><th>Attendance</th></tr></thead>
                        <tbody>
                            ${staffMockData.students.map(s => `<tr><td>${s.name}</td><td>${s.class}</td><td>${s.roll}</td><td>${s.attendance}</td></tr>`).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `
    },

    parentInner: {
        dashboard: `
            <div class="fade-in">
                <div class="admin-stats-grid">
                    <div class="admin-stat-card">
                        <div class="stat-label">Total Attendance</div>
                        <div class="stat-value">96%</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">Overall percentage</div>
                    </div>
                    <div class="admin-stat-card">
                        <div class="stat-label">Fee Status</div>
                        <div class="stat-value">Paid</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">No dues remaining</div>
                    </div>
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

    adminInner: {
        dashboard: `
            <div class="fade-in">
                <div class="admin-stats-grid">
                    <div class="admin-stat-card">
                        <div class="stat-label">Total Students</div>
                        <div class="stat-value">1,245</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">Registered students</div>
                    </div>
                    <div class="admin-stat-card">
                        <div class="stat-label">Total Staff</div>
                        <div class="stat-value">87</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">Teachers & Support</div>
                    </div>
                    <div class="admin-stat-card">
                        <div class="stat-label">Pending Admissions</div>
                        <div class="stat-value">12</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">Awaiting review</div>
                    </div>
                    <div class="admin-stat-card">
                        <div class="stat-label">Fees Collected</div>
                        <div class="stat-value">₹45.2L</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">This session</div>
                    </div>
                </div>

                 <section class="section slide-up">
                    <h2 class="section-title">Management Sections</h2>
                    <div class="card-grid">
                        <div class="card card-premium delay-100">
                            <h3>Create Staff</h3>
                            <p>Add new staff members.</p>
                            <a href="#create-staff" class="btn btn-white mt-lg">Add Staff</a>
                        </div>
                        <div class="card card-premium delay-200">
                            <h3>Create Parent</h3>
                            <p>Add new parent accounts.</p>
                            <a href="#create-parent" class="btn btn-white mt-lg">Add Parent</a>
                        </div>
                         <div class="card card-premium delay-300">
                            <h3>Admissions</h3>
                            <p>Manage applications.</p>
                            <a href="#admissions" class="btn btn-white mt-lg">View</a>
                        </div>
                    </div>
                </section>
            </div>
        `,
        createStaff: `
            <div class="fade-in">
                <div class="card" style="max-width: 800px;">
                    <form id="createStaffForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Full Name</label>
                                <input type="text" name="name" required placeholder="Ex: John Doe">
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" name="email" required placeholder="email@school.com">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Mobile</label>
                                <input type="tel" name="mobile" required placeholder="+91 XXXXX XXXXX">
                            </div>
                            <div class="form-group">
                                <label>Role / Designation</label>
                                <select name="role" class="form-control" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
                                    <option value="Teacher">Teacher</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Support">Support Staff</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                             <div class="form-group">
                                <label>Department</label>
                                <input type="text" name="department" required placeholder="Ex: Science">
                            </div>
                            <div class="form-group">
                                <label>Subject</label>
                                <input type="text" name="subject" placeholder="Ex: Physics (Optional)">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Password</label>
                                <div class="password-wrapper">
                                    <input type="password" id="staffCreatePassword" name="password" required placeholder="Set initial password">
                                    <span class="password-toggle-icon" onclick="app.togglePasswordVisibility('staffCreatePassword')">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary">Create Staff</button>
                    </form>
                </div>
            </div>
        `,
        createParent: `
            <div class="fade-in">
                <div class="content-header">
                    <h2>Create Parent Account</h2>
                    <p>Register a new parent.</p>
                </div>
                 <div class="card" style="max-width: 800px;">
                    <form id="createParentForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Parent Name</label>
                                <input type="text" name="parentName" required placeholder="Ex: Mr. Sharma">
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" name="email" required placeholder="parent@gmail.com">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Mobile</label>
                                <input type="tel" name="mobile" required placeholder="+91 XXXXX XXXXX">
                            </div>
                            <div class="form-group">
                                <label>Student Name</label>
                                <input type="text" name="studentName" required placeholder="Child's Name">
                            </div>
                        </div>
                         <div class="form-row">
                            <div class="form-group">
                                <label>Class / Section</label>
                                <input type="text" name="classSection" required placeholder="Ex: 10-A">
                            </div>
                            <div class="form-group">
                                <label>Password</label>
                                <div class="password-wrapper">
                                    <input type="password" id="parentCreatePassword" name="password" required placeholder="Set initial password">
                                    <span class="password-toggle-icon" onclick="app.togglePasswordVisibility('parentCreatePassword')">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary">Create Parent</button>
                    </form>
                </div>
            </div>
        `,
        teachers: `
            <div class="fade-in">
                <div class="content-header">
                    <h2>Teachers List</h2>
                    <p>View and manage all registered teachers.</p>
                </div>
                <div class="data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Department</th>
                                <th>Subject</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Mock Data for Display -->
                            <tr>
                                <td>Damini Bhatu More</td>
                                <td>damini.more@school.com</td>
                                <td>Teacher</td>
                                <td>Science</td>
                                <td>Physics</td>
                            </tr>
                            <tr>
                                <td>Rajesh Kumar</td>
                                <td>rajesh.k@school.com</td>
                                <td>Teacher</td>
                                <td>Mathematics</td>
                                <td>Maths</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `,
        students: `
            <div class="fade-in">
                <div class="content-header">
                    <h2>Student List</h2>
                    <p>View students by class.</p>
                </div>
                <div class="card mb-lg">
                    <div class="form-group" style="max-width: 300px;">
                        <label>Select Class</label>
                        <select id="classSelector" class="form-control" onchange="app.filterStudents(this.value)">
                            <option value="">-- Select Class --</option>
                            <option value="10-A">Class 10-A</option>
                            <option value="10-B">Class 10-B</option>
                            <option value="9-A">Class 9-A</option>
                        </select>
                    </div>
                </div>
                
                <div id="studentsTableContainer" class="data-table" style="display: none;">
                    <table>
                        <thead>
                            <tr>
                                <th>Roll No</th>
                                <th>Student Name</th>
                                <th>Parent Name</th>
                                <th>Contact</th>
                            </tr>
                        </thead>
                        <tbody id="studentsTableBody">
                            <!-- Populated via JS -->
                        </tbody>
                    </table>
                </div>
                <p id="selectClassMsg" style="color: var(--text-gray); text-align: center; margin-top: 2rem;">Please select a class to view students.</p>
            </div>
        `,
        admissions: `<div class="fade-in"><div class="content-header"><h2>Admissions</h2><p>Manage pending admissions.</p></div><div class="card"><p class="text-center">Admissions module placeholder.</p></div></div>`,
        fees: `<div class="fade-in"><div class="content-header"><h2>Fees Management</h2><p>Track fee payments.</p></div><div class="card"><p class="text-center">Fees module placeholder.</p></div></div>`,
        attendance: `<div class="fade-in"><div class="content-header"><h2>Attendance</h2><p>Overall attendance stats.</p></div><div class="card"><p class="text-center">Attendance module placeholder.</p></div></div>`,
        reports: `<div class="fade-in"><div class="content-header"><h2>Reports</h2><p>School performance reports.</p></div><div class="card"><p class="text-center">Reports module placeholder.</p></div></div>`
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
                    <ul class="nav-menu" style="gap: 2rem;">
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
                    <h1 style="margin-bottom: 2rem;">Excellence in Education</h1>
                    <h2 style="color: var(--primary-blue); font-weight: 700; margin-bottom: 1.5rem;">Empowering Minds, Shaping Futures</h2>
                    <p style="max-width: 700px; margin-bottom: 3.5rem;">Welcome to Pucho Public School, where we nurture curiosity, creativity, and character. Join us in our journey of academic excellence and holistic development.</p>
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
                                <input type="text" id="name" required placeholder=" ">
                                <label for="name">Your Name</label>
                            </div>
                            <div class="form-group">
                                <input type="email" id="email" required placeholder=" ">
                                <label for="email">Email Address</label>
                            </div>
                            <div class="form-group">
                                <textarea id="message" required placeholder=" "></textarea>
                                <label for="message">Message</label>
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
            <div class="login-box glass-card">
                <div style="text-align: center; margin-bottom: 2rem;">
                     <a href="/" class="logo" style="justify-content: center; font-size: 1.5rem;" data-link>
                        <img src="assets/logo.png" alt="Logo" style="height: 50px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));">
                        Pucho Public School
                    </a>
                </div>
                <h2>Staff Login</h2>
                <p>Welcome back! Please access your dashboard.</p>
                
                <form id="staffLoginForm" autocomplete="off">
                    <div class="form-group slide-up delay-100">
                        <input type="email" id="staffEmail" required placeholder=" " autocomplete="new-password">
                        <label for="staffEmail">Email Address or Staff ID</label>
                    </div>
                    
                    <div class="form-group slide-up delay-200">
                        <div class="password-wrapper">
                            <input type="password" id="staffPassword" required placeholder=" " autocomplete="new-password">
                            <label for="staffPassword">Password</label>
                             <span class="password-toggle-icon" onclick="app.togglePasswordVisibility('staffPassword')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            </span>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-full slide-up delay-300" style="width: 100%;">Sign In</button>
                    <div style="text-align: center; margin-top: 1rem;" class="slide-up delay-300">
                      <a href="/forgot-password" data-link style="color: var(--primary-blue); font-size: 0.9rem; text-decoration: none;">Forgot Password?</a>
                    </div>
                </form>
                
                <a href="/" class="back-link slide-up delay-300" data-link>← Back to Home</a>
            </div>
        </div>
    `,

    // ========================================
    // PARENT LOGIN
    // ========================================
    parentLogin: () => `
        <div class="login-container">
            <div class="login-box glass-card">
                 <div style="text-align: center; margin-bottom: 2rem;">
                     <a href="/" class="logo" style="justify-content: center; font-size: 1.5rem;" data-link>
                        <img src="assets/logo.png" alt="Logo" style="height: 50px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));">
                        Pucho Public School
                    </a>
                </div>
                <h2>Parent Portal</h2>
                <p>Monitor your child's progress</p>
                
                <form id="parentLoginForm" autocomplete="off">
                    <div class="form-group slide-up delay-100">
                        <input type="email" id="parentEmail" required placeholder=" " autocomplete="new-password">
                        <label for="parentEmail">Registered Email</label>
                    </div>
                    
                    <div class="form-group slide-up delay-200">
                        <div class="password-wrapper">
                            <input type="password" id="parentPassword" required placeholder=" " autocomplete="new-password">
                            <label for="parentPassword">Password</label>
                            <span class="password-toggle-icon" onclick="app.togglePasswordVisibility('parentPassword')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            </span>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-full slide-up delay-300" style="width: 100%;">Access Portal</button>
                    <div style="text-align: center; margin-top: 1rem;" class="slide-up delay-300">
                        <a href="/forgot-password" data-link style="color: var(--primary-blue); font-size: 0.9rem; text-decoration: none;">Forgot Password?</a>
                    </div>
                </form>
                
                <a href="/" class="back-link slide-up delay-300" data-link>← Back to Home</a>
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
                        <input type="text" id="adminUsername" required placeholder=" ">
                        <label for="adminUsername">Username</label>
                    </div>
                    
                    <div class="form-group">
                        <div class="password-wrapper">
                            <input type="password" id="adminPassword" required placeholder=" ">
                            <label for="adminPassword">Password</label>
                            <span class="password-toggle-icon" onclick="app.togglePasswordVisibility('adminPassword')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </span>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-full">Login</button>
                </form>
                
                <a href="/" class="back-link" data-link>← Back to Home</a>
            </div>
        </div>
            </div>
        </div>
    `,

    // ========================================
    // FORGOT PASSWORD
    // ========================================
    forgotPassword: () => `
        <div class="login-container">
            <div class="login-box glass-card">
                <div style="text-align: center; margin-bottom: 2rem;">
                     <a href="/" class="logo" style="justify-content: center; font-size: 1.5rem;" data-link>
                        <img src="assets/logo.png" alt="Logo" style="height: 50px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));">
                        Pucho Public School
                    </a>
                </div>
                <h2>Reset Password</h2>
                <p>Enter your email and new password</p>
                
                <form id="forgotPasswordForm" autocomplete="off">
                    <div class="form-group slide-up delay-100">
                        <input type="email" id="resetEmail" required placeholder=" " autocomplete="new-password">
                        <label for="resetEmail">Email Address</label>
                    </div>
                    
                    <div class="form-group slide-up delay-200">
                        <div class="password-wrapper">
                            <input type="password" id="newPassword" required placeholder=" " autocomplete="new-password">
                            <label for="newPassword">New Password</label>
                             <span class="password-toggle-icon" onclick="app.togglePasswordVisibility('newPassword')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </span>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-full slide-up delay-300" style="width: 100%;">Update Password</button>
                </form>
                
                <a href="/" class="back-link slide-up delay-300" data-link>← Back to Home</a>
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
                    <div class="sidebar-header">
                        <img src="assets/logo.png" alt="Logo" style="height: 32px;">
                        <h2>Staff Portal</h2>
                    </div>
                    <ul class="sidebar-menu">
                        <li><a href="#" class="menu-link active" data-dashboard-page="dashboard">Dashboard</a></li>
                        <li><a href="#" class="menu-link" data-dashboard-page="assignedClasses">Assigned Classes</a></li>
                        <li><a href="#" class="menu-link" data-dashboard-page="markAttendance">Mark Attendance</a></li>
                        <li><a href="#" class="menu-link" data-dashboard-page="uploadMarks">Upload Marks</a></li>
                        <li><a href="#" class="menu-link" data-dashboard-page="students">View Students</a></li>
                        <li><a href="#" class="menu-link" data-dashboard-page="notices">Notices</a></li>
                        <li><a href="#" onclick="app.openModal('changePasswordModal')">Change Password</a></li>
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
                            <div class="stat-label">Approvals needed</div>
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
                
                <!-- Change Password Modal -->
                <div id="changePasswordModal" class="modal">
                    <div class="modal-content" style="max-width: 400px;">
                        <span class="close" onclick="app.closeModal('changePasswordModal')">&times;</span>
                        <h2>Change Password</h2>
                        <form id="changePasswordForm">
                            <div class="form-group">
                                <label>Current Password</label>
                                <input type="password" name="currentPassword" required>
                            </div>
                            <div class="form-group">
                                <label>New Password</label>
                                <input type="password" name="newPassword" required>
                            </div>
                            <div class="form-group">
                                <label>Confirm New Password</label>
                                <input type="password" name="confirmPassword" required>
                            </div>
                            <button type="submit" class="btn btn-primary btn-full">Update Password</button>
                        </form>
                    </div>
                </div>
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
                        <li><a href="#dashboard" class="active">Dashboard</a></li>
                        <li><a href="#create-staff">Create Staff</a></li>
                        <li><a href="#create-parent">Create Parent</a></li>
                        <li><a href="#teachers">Teachers List</a></li>
                        <li><a href="#students">Students List</a></li>
                        <li><a href="#admissions">Admissions</a></li>
                        <li><a href="#fees">Fees Management</a></li>
                        <li><a href="#attendance">Attendance</a></li>
                        <li><a href="#reports">Reports</a></li>
                        <li><a href="#" id="logoutBtn">Logout</a></li>
                    </ul>
                </aside>

                <main class="dashboard-content" id="adminMainContent">
                    <!-- Dynamic content will happen here via app.js initAdminDashboard -->
                    ${Pages.adminInner.dashboard}
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
