// ========================================
// PARENT DASHBOARD JAVASCRIPT
// ========================================

// Page Templates
const parentTemplates = {
    dashboard: `
        <div class="fade-in">
            <div class="content-header">
                <h2>Parent Dashboard</h2>
                <p>View your child's academic progress and school information.</p>
            </div>

            <!-- Student Info -->
            <div class="card mb-lg">
                <h3>Student Information</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem; color: var(--text-gray);">
                    <div><strong style="color: var(--primary-blue);">Name:</strong><br>Rahul Sharma</div>
                    <div><strong style="color: var(--primary-blue);">Class:</strong><br>10th Standard - Section A</div>
                    <div><strong style="color: var(--primary-blue);">Roll Number:</strong><br>2025-10A-045</div>
                    <div><strong style="color: var(--primary-blue);">Admission Year:</strong><br>2020</div>
                </div>
            </div>

            <!-- Statistics Cards -->
            <div class="admin-stats-grid">
                <div class="admin-stat-card">
                    <div class="stat-label">Overall Attendance</div>
                    <div class="stat-value">96.2%</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">Current month</div>
                </div>
                <div class="admin-stat-card">
                    <div class="stat-label">Fee Status</div>
                    <div class="stat-value">Paid</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">No dues remaining</div>
                </div>
                <div class="admin-stat-card">
                    <div class="stat-label">Last Exam Result</div>
                    <div class="stat-value">87.5%</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">Mid-term average</div>
                </div>
                <div class="admin-stat-card">
                    <div class="stat-label">Current Rank</div>
                    <div class="stat-value">5th</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">Out of 45 students</div>
                </div>
            </div>

            <section class="section slide-up">
                <h2 class="section-title">Quick Access</h2>
                <div class="card-grid">
                    <div class="card card-premium delay-100">
                        <h3>View Attendance</h3>
                        <p>Check your child's attendance records and monthly reports.</p>
                        <button class="btn btn-white mt-lg menu-link" onclick="loadPage('attendance')">View Attendance</button>
                    </div>
                    <div class="card card-premium delay-200">
                        <h3>Fee Status</h3>
                        <p>View fee payment history and pending dues.</p>
                        <button class="btn btn-white mt-lg menu-link" onclick="loadPage('fee')">View Fees</button>
                    </div>
                    <div class="card card-premium delay-300">
                        <h3>Exam Results</h3>
                        <p>View exam results and performance analysis.</p>
                        <button class="btn btn-white mt-lg menu-link" onclick="loadPage('results')">View Results</button>
                    </div>
                    <div class="card card-premium delay-100">
                        <h3>Timetable</h3>
                        <p>View your child's weekly class schedule.</p>
                        <button class="btn btn-white mt-lg menu-link" onclick="loadPage('timetable')">View Timetable</button>
                    </div>
                </div>
            </section>
        </div>
    `,

    attendance: `
        <div class="fade-in">
            <div class="content-header">
                <h2>Attendance Record</h2>
                <p>Monthly attendance summary.</p>
            </div>

            <div class="card">
                <h3>Monthly Breakdown</h3>
                <div class="data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>Total Days</th>
                                <th>Present</th>
                                <th>Absent</th>
                                <th>Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>December 2025</td><td>22</td><td>21</td><td>1</td><td><span class="badge badge-success">95.4%</span></td></tr>
                            <tr><td>November 2025</td><td>20</td><td>20</td><td>0</td><td><span class="badge badge-success">100%</span></td></tr>
                            <tr><td>October 2025</td><td>22</td><td>20</td><td>2</td><td><span class="badge badge-success">90.9%</span></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `,

    fee: `
        <div class="fade-in">
            <div class="content-header">
                <h2>Fee Status</h2>
                <p>Payment history and outstanding dues.</p>
            </div>

            <div class="stats-grid mb-lg">
                 <div class="stat-card">
                    <h3>Outstanding Amount</h3>
                    <div class="stat-value">₹0</div>
                    <div class="stat-label">No pending dues</div>
                </div>
            </div>

            <div class="card">
                <h3>Payment History</h3>
                <div class="data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Date Paid</th>
                                <th>Status</th>
                                <th>Receipt</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>Term 3 Tuition Fee</td><td>₹15,000</td><td>2025-01-05</td><td><span class="badge badge-success">Paid</span></td><td><button class="btn btn-sm btn-outline">Download</button></td></tr>
                            <tr><td>Term 2 Tuition Fee</td><td>₹15,000</td><td>2024-09-10</td><td><span class="badge badge-success">Paid</span></td><td><button class="btn btn-sm btn-outline">Download</button></td></tr>
                            <tr><td>Annual Charges</td><td>₹5,000</td><td>2024-04-10</td><td><span class="badge badge-success">Paid</span></td><td><button class="btn btn-sm btn-outline">Download</button></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `,

    results: `
        <div class="fade-in">
            <div class="content-header">
                <h2>Exam Results</h2>
                <p>Performance in recent examinations.</p>
            </div>

            <div class="card">
                <h3>Mid-Term Examination 2025</h3>
                <div class="data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Max Marks</th>
                                <th>Obtained</th>
                                <th>Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>Mathematics</td><td>100</td><td>92</td><td>A+</td></tr>
                            <tr><td>Science</td><td>100</td><td>88</td><td>A</td></tr>
                            <tr><td>English</td><td>100</td><td>85</td><td>A</td></tr>
                            <tr><td>Social Studies</td><td>100</td><td>90</td><td>A+</td></tr>
                            <tr><td>Hindi</td><td>100</td><td>82</td><td>B+</td></tr>
                        </tbody>
                        <tfoot>
                            <tr style="font-weight: bold; background: var(--light-blue);">
                                <td>Total</td>
                                <td>500</td>
                                <td>437</td>
                                <td>87.4%</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    `,

    timetable: `
        <div class="fade-in">
            <div class="content-header">
                <h2>Class Timetable</h2>
                <p>Weekly schedule for Class 10-A.</p>
            </div>
            <div class="card">
                <p>Timetable view placeholder.</p>
            </div>
        </div>
    `,

    notifications: `
        <div class="fade-in">
            <div class="content-header">
                <h2>Notifications</h2>
                <p>Important announcements from school.</p>
            </div>
            <div class="card">
               <ul style="color: var(--text-gray); line-height: 2;">
                    <li>Parent-teacher meeting scheduled on 20th December 2025</li>
                    <li>Annual sports day on 15th January 2026</li>
                    <li>Mid-term exam results published</li>
                    <li>Winter break from 25th December to 5th January</li>
                </ul>
            </div>
        </div>
    `
};

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    loadPage('dashboard');

    // Menu Navigation
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            if (this.id === 'parentLogout') {
                if (confirm('Are you sure you want to logout?')) {
                    window.location.href = '/';
                }
                return;
            }

            // Remove active class
            document.querySelectorAll('.sidebar-menu a').forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Determine page
            const text = this.innerText.toLowerCase();
            let page = 'dashboard';
            if (text.includes('attendance')) page = 'attendance';
            else if (text.includes('fee')) page = 'fee';
            else if (text.includes('result')) page = 'results';
            else if (text.includes('timetable')) page = 'timetable';
            else if (text.includes('notification')) page = 'notifications';

            loadPage(page);
        });
    });
});

function loadPage(pageName) {
    const content = document.getElementById('mainContent');
    if (parentTemplates[pageName]) {
        content.innerHTML = parentTemplates[pageName];
    } else {
        content.innerHTML = `<h2>Page not found</h2>`;
    }
}
