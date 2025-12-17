// ========================================
// ADMIN DASHBOARD - MAIN JAVASCRIPT
// ========================================

// Mock Data Storage (in real app, this would be a database)
const mockData = {
    staff: [],
    parents: [],
    admissions: [],
    fees: [],
    attendance: {
        today: { total: 0, present: 0, absent: 0, percentage: 0 },
        thisMonth: { percentage: 0 },
        thisYear: { percentage: 0 }
    },
    exams: []
};

// Page Templates
const pageTemplates = {
    dashboard: `
        <div class="fade-in">
        <div class="content-header">
            <h2>Dashboard Overview</h2>
            <p>Welcome to the admin dashboard. Here's a summary of your school management system.</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <h3>Total Students</h3>
                <div class="stat-value">1,245</div>
                <div class="stat-label">Active Students</div>
            </div>

            <div class="stat-card">
                <h3>Total Staff</h3>
                <div class="stat-value">${mockData.staff.length}</div>
                <div class="stat-label">Active Staff Members</div>
            </div>

            <div class="stat-card">
                <h3>Pending Admissions</h3>
                <div class="stat-value">${mockData.admissions.filter(a => a.status === 'Pending').length}</div>
                <div class="stat-label">Awaiting Approval</div>
            </div>

            <div class="stat-card">
                <h3>Pending Fees</h3>
                <div class="stat-value">₹${mockData.fees.reduce((sum, f) => sum + f.pending, 0).toLocaleString('en-IN')}</div>
                <div class="stat-label">Total Outstanding</div>
            </div>

            <div class="stat-card">
                <h3>Attendance Today</h3>
                <div class="stat-value">${mockData.attendance.today.percentage}%</div>
                <div class="stat-label">${mockData.attendance.today.present} / ${mockData.attendance.today.total} present</div>
            </div>
        </div>

        <section class="section">
            <h2 class="section-title">Quick Actions</h2>
            <div class="card-grid">
                <div class="card">
                    <h3>Staff Management</h3>
                    <p>Manage staff accounts, add new teachers, and update staff information.</p>
                    <button class="btn btn-primary mt-lg menu-link" data-page="staff">Manage Staff</button>
                </div>
                <div class="card">
                    <h3>Admissions</h3>
                    <p>Review and approve pending admission applications.</p>
                    <button class="btn btn-primary mt-lg menu-link" data-page="admissions">View Admissions</button>
                </div>
                <div class="card">
                    <h3>Fee Management</h3>
                    <p>Track fee payments and manage outstanding dues.</p>
                    <button class="btn btn-primary mt-lg menu-link" data-page="fees">Manage Fees</button>
                </div>
                <div class="card">
                    <h3>Reports</h3>
                    <p>Generate and view comprehensive school reports.</p>
                    <button class="btn btn-primary mt-lg menu-link" data-page="reports">View Reports</button>
                </div>
            </div>
        </section>
    `,

    staff: `
        <div class="fade-in">
        <div class="content-header">
            <h2>Staff Management</h2>
            <p>Manage staff accounts and add new staff members.</p>
        </div>

        <div style="margin-bottom: 1.5rem;">
            <button class="btn btn-primary" onclick="openModal('addStaffModal')">+ Add New Staff</button>
        </div>

        <div class="data-table">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${mockData.staff.map(staff => `
                        <tr>
                            <td>${staff.name}</td>
                            <td>${staff.email}</td>
                            <td>${staff.role}</td>
                            <td><span class="badge badge-success">${staff.status}</span></td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn btn-sm btn-primary">Edit</button>
                                    <button class="btn btn-sm btn-danger">Remove</button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `,

    parents: `
        <div class="fade-in">
        <div class="content-header">
            <h2>Parent Management</h2>
            <p>Manage parent accounts and create new parent logins.</p>
        </div>

        <div style="margin-bottom: 1.5rem;">
            <button class="btn btn-primary" onclick="openModal('addParentModal')">+ Create Parent Account</button>
        </div>

        <div class="data-table">
            <table>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Parent Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Class</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${mockData.parents.map(parent => `
                        <tr>
                            <td>${parent.studentName}</td>
                            <td>${parent.parentName}</td>
                            <td>${parent.email}</td>
                            <td>${parent.phone}</td>
                            <td>${parent.class}-${parent.section}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn btn-sm btn-primary">Edit</button>
                                    <button class="btn btn-sm btn-danger">Remove</button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
`,

    admissions: `
        <div class="fade-in">
        <div class="content-header">
            <h2>Admissions Management</h2>
            <p>Review and approve admission applications.</p>
        </div>

        <div style="margin-bottom: 1.5rem;">
            <button class="btn btn-primary" onclick="openModal('addAdmissionModal')">+ New Admission</button>
        </div>

        <div class="data-table">
            <table>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Parent Name</th>
                        <th>Phone</th>
                        <th>Class</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${mockData.admissions.map(admission => `
                        <tr>
                            <td>${admission.studentName}</td>
                            <td>${admission.parentName}</td>
                            <td>${admission.phone}</td>
                            <td>Class ${admission.class}</td>
                            <td>${admission.date}</td>
                            <td><span class="badge ${admission.status === 'Pending' ? 'badge-warning' : 'badge-success'}">${admission.status}</span></td>
                            <td>
                                <div class="action-buttons">
                                    ${admission.status === 'Pending' ? `
                                        <button class="btn btn-sm btn-success" onclick="approveAdmission(${admission.id})">Approve</button>
                                        <button class="btn btn-sm btn-danger" onclick="rejectAdmission(${admission.id})">Reject</button>
                                    ` : `
                                        <button class="btn btn-sm btn-primary">View</button>
                                    `}
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `,

    fees: `
        <div class="fade-in">
        <div class="content-header">
            <h2>Fees Management</h2>
            <p>Track fee payments and manage outstanding dues.</p>
        </div>

        <div style="margin-bottom: 1.5rem;">
            <button class="btn btn-primary" onclick="openModal('addFeeModal')">+ Record Payment</button>
        </div>

        <div class="stats-grid" style="margin-bottom: 2rem;">
            <div class="stat-card">
                <h3>Total Fees</h3>
                <div class="stat-value">₹${mockData.fees.reduce((sum, f) => sum + f.amount, 0).toLocaleString('en-IN')}</div>
                <div class="stat-label">Total Amount</div>
            </div>
            <div class="stat-card">
                <h3>Collected</h3>
                <div class="stat-value">₹${mockData.fees.reduce((sum, f) => sum + f.paid, 0).toLocaleString('en-IN')}</div>
                <div class="stat-label">Paid Amount</div>
            </div>
            <div class="stat-card">
                <h3>Pending</h3>
                <div class="stat-value">₹${mockData.fees.reduce((sum, f) => sum + f.pending, 0).toLocaleString('en-IN')}</div>
                <div class="stat-label">Outstanding Amount</div>
            </div>
        </div>

        <div class="data-table">
            <table>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Class</th>
                        <th>Total Amount</th>
                        <th>Paid</th>
                        <th>Pending</th>
                        <th>Status</th>
                        <th>Due Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${mockData.fees.map(fee => `
                        <tr>
                            <td>${fee.studentName}</td>
                            <td>${fee.class}</td>
                            <td>₹${fee.amount.toLocaleString('en-IN')}</td>
                            <td>₹${fee.paid.toLocaleString('en-IN')}</td>
                            <td>₹${fee.pending.toLocaleString('en-IN')}</td>
                            <td><span class="badge ${fee.status === 'Paid' ? 'badge-success' : fee.status === 'Partial' ? 'badge-warning' : 'badge-danger'}">${fee.status}</span></td>
                            <td>${fee.dueDate}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn btn-sm btn-primary">Update</button>
                                    <button class="btn btn-sm btn-success">Receipt</button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
`,

    attendance: `
        <div class="fade-in">
        <div class="content-header">
            <h2>Attendance Reports</h2>
            <p>View overall attendance statistics and reports.</p>
        </div>

        <div class="stats-grid" style="margin-bottom: 2rem;">
            <div class="stat-card">
                <h3>Today's Attendance</h3>
                <div class="stat-value">${mockData.attendance.today.percentage}%</div>
                <div class="stat-label">${mockData.attendance.today.present} / ${mockData.attendance.today.total} students</div>
            </div>
            <div class="stat-card">
                <h3>This Month</h3>
                <div class="stat-value">${mockData.attendance.thisMonth.percentage}%</div>
                <div class="stat-label">Average Attendance</div>
            </div>
            <div class="stat-card">
                <h3>This Year</h3>
                <div class="stat-value">${mockData.attendance.thisYear.percentage}%</div>
                <div class="stat-label">Overall Attendance</div>
            </div>
        </div>

        <section class="section section-alt">
            <h2 class="section-title">Attendance Details</h2>
            <div class="card">
                <h3>Class-wise Attendance (Today)</h3>
                <div class="data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Class</th>
                                <th>Total Students</th>
                                <th>Present</th>
                                <th>Absent</th>
                                <th>Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>Class 10-A</td><td>45</td><td>43</td><td>2</td><td><span class="badge badge-success">95.6%</span></td></tr>
                            <tr><td>Class 10-B</td><td>42</td><td>39</td><td>3</td><td><span class="badge badge-success">92.9%</span></td></tr>
                            <tr><td>Class 9-A</td><td>48</td><td>46</td><td>2</td><td><span class="badge badge-success">95.8%</span></td></tr>
                            <tr><td>Class 9-B</td><td>44</td><td>41</td><td>3</td><td><span class="badge badge-success">93.2%</span></td></tr>
                            <tr><td>Class 8-A</td><td>50</td><td>47</td><td>3</td><td><span class="badge badge-success">94.0%</span></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    `,

    exams: `
        <div class="fade-in">
        <div class="content-header">
            <h2>Exam Management</h2>
            <p>View exam schedules and manage examination records.</p>
        </div>

        <div style="margin-bottom: 1.5rem;">
            <button class="btn btn-primary" onclick="openModal('addExamModal')">+ Schedule Exam</button>
        </div>

        <div class="data-table">
            <table>
                <thead>
                    <tr>
                        <th>Exam Name</th>
                        <th>Class</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${mockData.exams.map(exam => `
                        <tr>
                            <td>${exam.name}</td>
                            <td>${exam.class}</td>
                            <td>${exam.startDate}</td>
                            <td>${exam.endDate}</td>
                            <td><span class="badge badge-info">${exam.status}</span></td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn btn-sm btn-primary">View Details</button>
                                    <button class="btn btn-sm btn-success">Results</button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <section class="section section-alt" style="margin-top: 2rem;">
            <h2 class="section-title">Recent Results</h2>
            <div class="card">
                <h3>Class 10 - Mid-Term Results</h3>
                <p style="color: var(--text-gray); margin-top: 0.5rem;">Average Score: 87.5% | Pass Rate: 100%</p>
                <button class="btn btn-primary mt-lg">View Full Results</button>
            </div>
        </section>
`,

    reports: `
        <div class="fade-in">
        <div class="content-header">
            <h2>Reports</h2>
            <p>Generate and view comprehensive school reports.</p>
        </div>

        <div class="card-grid">
            <div class="card">
                <h3>Student Reports</h3>
                <p>View detailed student performance and attendance reports.</p>
                <button class="btn btn-primary mt-lg">Generate Report</button>
            </div>
            <div class="card">
                <h3>Fee Reports</h3>
                <p>View fee collection reports and outstanding dues summary.</p>
                <button class="btn btn-primary mt-lg">Generate Report</button>
            </div>
            <div class="card">
                <h3>Attendance Reports</h3>
                <p>View class-wise and student-wise attendance reports.</p>
                <button class="btn btn-primary mt-lg">Generate Report</button>
            </div>
            <div class="card">
                <h3>Exam Reports</h3>
                <p>View examination results and performance analysis.</p>
                <button class="btn btn-primary mt-lg">Generate Report</button>
            </div>
        </div>

        <section class="section section-alt" style="margin-top: 2rem;">
            <h2 class="section-title">Quick Statistics</h2>
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>Total Students</h3>
                    <div class="stat-value">1,245</div>
                </div>
                <div class="stat-card">
                    <h3>Average Attendance</h3>
                    <div class="stat-value">94.2%</div>
                </div>
                <div class="stat-card">
                    <h3>Fee Collection Rate</h3>
                    <div class="stat-value">88.5%</div>
                </div>
                <div class="stat-card">
                    <h3>Pass Percentage</h3>
                    <div class="stat-value">96.8%</div>
                </div>
            </div>
        </section>
    `
};

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function () {
    // Load dashboard page by default
    loadPage('dashboard');

    // Set up menu click handlers
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('menu-link') || e.target.hasAttribute('data-page')) {
            e.preventDefault();
            const page = e.target.getAttribute('data-page');
            if (page) {
                loadPage(page);

                // Update active state
                document.querySelectorAll('.menu-link').forEach(link => {
                    link.classList.remove('active');
                });
                if (e.target.classList.contains('menu-link')) {
                    e.target.classList.add('active');
                }
            }
        }
    });

    // Set up form handlers
    setupFormHandlers();
});

// Load Page Content
function loadPage(pageName) {
    const mainContent = document.getElementById('mainContent');
    if (pageTemplates[pageName]) {
        mainContent.innerHTML = pageTemplates[pageName];
    }
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Form Handlers
function setupFormHandlers() {
    // Add Staff Form
    const addStaffForm = document.getElementById('addStaffForm');
    if (addStaffForm) {
        addStaffForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const newStaff = {
                id: mockData.staff.length + 1,
                name: document.getElementById('staffName').value,
                email: document.getElementById('staffEmail').value,
                role: document.getElementById('staffRole').value,
                status: 'Active'
            };

            mockData.staff.push(newStaff);

            alert('Staff member added successfully!');
            closeModal('addStaffModal');
            addStaffForm.reset();
            loadPage('staff');
        });
    }

    // Add Parent Form
    const addParentForm = document.getElementById('addParentForm');
    if (addParentForm) {
        addParentForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const newParent = {
                id: mockData.parents.length + 1,
                studentName: document.getElementById('studentName').value,
                parentName: document.getElementById('parentName').value,
                email: document.getElementById('parentEmail').value,
                phone: document.getElementById('parentPhone').value,
                class: document.getElementById('studentClass').value,
                section: document.getElementById('studentSection').value
            };

            mockData.parents.push(newParent);

            alert('Parent account created successfully!\nLogin credentials have been sent to the parent\'s email.');
            closeModal('addParentModal');
            addParentForm.reset();
            loadPage('parents');
        });
    }

    // Add Admission Form
    const addAdmissionForm = document.getElementById('addAdmissionForm');
    if (addAdmissionForm) {
        addAdmissionForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const newAdmission = {
                id: mockData.admissions.length + 1,
                studentName: document.getElementById('admStudentName').value,
                parentName: document.getElementById('admParentName').value,
                phone: document.getElementById('admPhone').value,
                class: document.getElementById('admClass').value,
                date: new Date().toISOString().split('T')[0],
                status: 'Pending'
            };
            mockData.admissions.push(newAdmission);
            alert('Admission application submitted successfully!');
            closeModal('addAdmissionModal');
            addAdmissionForm.reset();
            loadPage('admissions');
        });
    }

    // Add Fee Form
    const addFeeForm = document.getElementById('addFeeForm');
    if (addFeeForm) {
        addFeeForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const amount = parseFloat(document.getElementById('feeAmount').value);
            const paid = parseFloat(document.getElementById('feePaid').value);
            const pending = amount - paid;

            const newFee = {
                id: mockData.fees.length + 1,
                studentName: document.getElementById('feeStudentName').value,
                class: document.getElementById('feeClass').value,
                amount: amount,
                paid: paid,
                pending: pending,
                status: pending === 0 ? 'Paid' : (pending < amount ? 'Partial' : 'Pending'),
                dueDate: document.getElementById('feeDueDate').value
            };
            mockData.fees.push(newFee);
            alert('Fee payment recorded successfully!');
            closeModal('addFeeModal');
            addFeeForm.reset();
            loadPage('fees');
        });
    }

    // Add Exam Form
    const addExamForm = document.getElementById('addExamForm');
    if (addExamForm) {
        addExamForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const newExam = {
                id: mockData.exams.length + 1,
                name: document.getElementById('examName').value,
                class: document.getElementById('examClass').value,
                startDate: document.getElementById('examStart').value,
                endDate: document.getElementById('examEnd').value,
                status: 'Scheduled'
            };
            mockData.exams.push(newExam);
            alert('Exam scheduled successfully!');
            closeModal('addExamModal');
            addExamForm.reset();
            loadPage('exams');
        });
    }
}

// Admission Actions
function approveAdmission(id) {
    const admission = mockData.admissions.find(a => a.id === id);
    if (admission) {
        admission.status = 'Approved';
        alert(`Admission approved for ${admission.studentName}`);
        loadPage('admissions');
    }
}

function rejectAdmission(id) {
    const admission = mockData.admissions.find(a => a.id === id);
    if (admission && confirm(`Are you sure you want to reject admission for ${admission.studentName}?`)) {
        admission.status = 'Rejected';
        alert(`Admission rejected for ${admission.studentName}`);
        loadPage('admissions');
    }
}
