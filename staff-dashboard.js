// ========================================
// STAFF DASHBOARD JAVASCRIPT
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

// Page Templates
const staffTemplates = {
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
                        <button class="btn btn-primary mt-lg" onclick="openModal('markAttendanceModal')">Mark Attendance</button>
                    </div>
                    <div class="card">
                        <h3>Upload Marks</h3>
                        <p>Upload results for completed examinations.</p>
                        <button class="btn btn-primary mt-lg" onclick="openModal('uploadMarksModal')">Upload Marks</button>
                    </div>
                    <div class="card">
                        <h3>View Students</h3>
                        <p>Access student profiles and academic records.</p>
                        <button class="btn btn-primary mt-lg menu-link" data-page="students">Student List</button>
                    </div>
                    <div class="card">
                        <h3>Exam Schedule</h3>
                        <p>View upcoming exams and invigilation duties.</p>
                        <button class="btn btn-primary mt-lg menu-link" data-page="exams">View Exams</button>
                    </div>
                </div>
            </section>
        </div>
    `,

    attendance: `
        <div class="fade-in">
            <div class="content-header">
                <h2>Attendance Management</h2>
                <p>Track and manage student attendance.</p>
            </div>

            <div style="margin-bottom: 2rem;">
                <button class="btn btn-primary" onclick="openModal('markAttendanceModal')">+ Mark New Attendance</button>
            </div>

            <div class="card">
                <h3>Recent Attendance Logs</h3>
                <div class="data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Class</th>
                                <th>Status</th>
                                <th>Marked By</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>2025-12-16</td>
                                <td>10-A</td>
                                <td><span class="badge badge-success">Completed</span></td>
                                <td>You</td>
                            </tr>
                            <tr>
                                <td>2025-12-16</td>
                                <td>10-B</td>
                                <td><span class="badge badge-success">Completed</span></td>
                                <td>You</td>
                            </tr>
                            <tr>
                                <td>2025-12-15</td>
                                <td>10-A</td>
                                <td><span class="badge badge-success">Completed</span></td>
                                <td>You</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `,

    exams: `
        <div class="fade-in">
            <div class="content-header">
                <h2>Exam Management</h2>
                <p>Schedule exams and upload marks.</p>
            </div>

            <div style="margin-bottom: 2rem;">
                <button class="btn btn-primary" onclick="openModal('uploadMarksModal')">Upload Marks</button>
            </div>

            <div class="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>Exam Name</th>
                            <th>Class</th>
                            <th>Subject</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${staffMockData.exams.map(exam => `
                            <tr>
                                <td>${exam.name}</td>
                                <td>${exam.class}</td>
                                <td>${exam.subject}</td>
                                <td>${exam.date}</td>
                                <td><span class="badge badge-info">Scheduled</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `,

    students: `
        <div class="fade-in">
            <div class="content-header">
                <h2>Student Directory</h2>
                <p>View all students assigned to you.</p>
            </div>

            <div class="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>Roll No</th>
                            <th>Name</th>
                            <th>Class</th>
                            <th>Attendance %</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${staffMockData.students.map(student => `
                            <tr>
                                <td>${student.roll}</td>
                                <td>${student.name}</td>
                                <td>${student.class}</td>
                                <td><span class="badge badge-success">${student.attendance}</span></td>
                                <td>
                                    <button class="btn btn-sm btn-outline">Profile</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `,

    // Placeholder for other tabs to prevent errors
    admissions: `<div class="fade-in"><h2>Admissions</h2><p>You have read-only access to admissions.</p></div>`,
    fees: `<div class="fade-in"><h2>Fees</h2><p>Fee records are managed by Admin.</p></div>`,
    reports: `<div class="fade-in"><h2>Reports</h2><p>Generate academic reports here.</p></div>`
};

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    loadPage('dashboard');

    // Menu Navigation
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Handle Logout
            if (this.id === 'staffLogout') {
                if (confirm('Are you sure you want to logout?')) {
                    window.location.href = '/';
                }
                return;
            }

            // Remove active class from all
            document.querySelectorAll('.sidebar-menu a').forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Determine page based on text content (simple mapping)
            const text = this.innerText.toLowerCase();
            let page = 'dashboard';
            if (text.includes('admissions')) page = 'admissions';
            else if (text.includes('fees')) page = 'fees';
            else if (text.includes('attendance')) page = 'attendance';
            else if (text.includes('exams')) page = 'exams';
            else if (text.includes('students')) page = 'students';
            else if (text.includes('reports')) page = 'reports';

            loadPage(page);
        });
    });

    // Form Handlers
    const attForm = document.getElementById('markAttendanceForm');
    if (attForm) {
        attForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Attendance marked successfully!');
            closeModal('markAttendanceModal');
            attForm.reset();
        });
    }

    const marksForm = document.getElementById('uploadMarksForm');
    if (marksForm) {
        marksForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Marks uploaded successfully!');
            closeModal('uploadMarksModal');
            marksForm.reset();
        });
    }
});

// Helper Functions
function loadPage(pageName) {
    const content = document.getElementById('mainContent');
    if (staffTemplates[pageName]) {
        content.innerHTML = staffTemplates[pageName];

        // Re-attach listeners for dynamic buttons if needed
        // (In this simple version, global onclicks in HTML string work because functions are global)
    } else {
        content.innerHTML = `<h2>Page not found</h2>`;
    }
}

function openModal(id) {
    document.getElementById(id).classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}
