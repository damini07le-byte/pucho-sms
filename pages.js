// ========================================
// PAGE COMPONENTS
// ========================================

const Pages = {
    // ========================================
    // HOME PAGE
    // ========================================
    home: () => `
        <div class="login-container">
            <div class="login-box" style="max-width: 800px;">
                <div style="text-align: center; margin-bottom: 2rem;">
                     <a href="/" class="logo" style="justify-content: center; font-size: 2rem; margin-bottom: 1rem;" data-link>
                        <img src="assets/logo.png" alt="Logo" style="height: 60px;">
                        Pucho Public School
                    </a>
                    <p style="color: var(--text-gray); font-size: 1.1rem;">Select your portal to continue</p>
                </div>
                
                <div class="form-row" style="gap: 2rem;">
                    <div class="card" style="text-align: center; border: 2px solid var(--light-blue); transition: all 0.3s ease;">
                        <h3 style="color: var(--primary-blue); margin-bottom: 1rem;">Staff Portal</h3>
                        <p style="margin-bottom: 1.5rem; color: var(--text-gray);">For Teachers, Admin & Staff</p>
                        <a href="/login/staff" class="btn btn-primary btn-full" data-link>Staff Login</a>
                    </div>

                    <div class="card" style="text-align: center; border: 2px solid var(--light-blue); transition: all 0.3s ease;">
                        <h3 style="color: var(--primary-blue); margin-bottom: 1rem;">Parent Portal</h3>
                        <p style="margin-bottom: 1.5rem; color: var(--text-gray);">For Parents & Students</p>
                        <a href="/login/parent" class="btn btn-primary btn-full" data-link>Parent Login</a>
                    </div>
                </div>

                <div style="text-align: center; margin-top: 2rem;">
                    <a href="/login/admin" class="btn btn-outline btn-sm" data-link>Admin Login</a>
                </div>
            </div>
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
