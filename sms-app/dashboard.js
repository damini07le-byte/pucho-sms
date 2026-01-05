// MASTER DASHBOARD ENGINE
const dashboard = {
    // Supabase Config (Direct DB Access)
    supabaseUrl: 'https://zpkjmfaqwjnkoppvrsrl.supabase.co', // Aapka Project URL
    supabaseKey: 'YOUR_SUPABASE_ANON_KEY', // Yahan apni Anon Key dalein

    // Initial Load Logic
    init: function () {
        this.renderSidebar();
        this.loadPage('overview');
    },

    getMenuItems: function (role) {
        role = role.toLowerCase(); // Ensure case-insensitive matching
        const common = [{ id: 'overview', name: 'Overview', icon: '📊' }];

        // Check if Parent has linked students
        let isNewParent = false;
        if (role === 'parent') {
            const myKids = schoolDB.students.filter(s => s.guardian === auth.currentUser.name);
            isNewParent = myKids.length === 0;
        }

        const menus = {
            admin: [
                { id: 'admissions', name: 'Admissions', icon: '🏫' },
                { id: 'students', name: 'Students', icon: '👨‍🎓' },
                { id: 'staff', name: 'Staff Management', icon: '👩‍🏫' },
                { id: 'fees', name: 'Fee Management', icon: '💰' },
                { id: 'exams', name: 'Exams & Results', icon: '📝' },
                { id: 'attendance_all', name: 'Attendance', icon: '📅' },
                { id: 'safety_monitor', name: 'Safety Monitor', icon: '🛡️' },
                { id: 'ai_insights', name: 'AI Insights', icon: '🧠' },
                { id: 'communication', name: 'Communication', icon: '📢' },
                { id: 'reports', name: 'Reports', icon: '📈' },
                { id: 'manage_profile', name: 'My Profile', icon: '👤' },
                { id: 'settings', name: 'Settings', icon: '⚙️' }
            ],
            staff: [
                { id: 'my_classes', name: 'My Classes', icon: '📚' },
                { id: 'mark_attendance', name: 'Mark Attendance', icon: '✅' },
                { id: 'exam_marks', name: 'Enter Marks', icon: '📝' },
                { id: 'manage_quizzes', name: 'Quiz Builder', icon: '⚡' },
                { id: 'homework', name: 'Homework', icon: '📖' },
                { id: 'ai_insights', name: 'Student Insights', icon: '🧠' },
                { id: 'staff_notices', name: 'Notices', icon: '📢' },
                { id: 'manage_profile', name: 'My Profile', icon: '👤' },
                { id: 'settings', name: 'Settings', icon: '⚙️' }
            ],
            parent: isNewParent ? [
                { id: 'new_application', name: 'New Application', icon: '📝' },
                { id: 'my_applications', name: 'My Applications', icon: '📂' },
                { id: 'manage_profile', name: 'My Profile', icon: '👤' },
                { id: 'settings', name: 'Settings', icon: '⚙️' }
            ] : [
                { id: 'student_profile', name: 'My Child', icon: '👤' },
                { id: 'parent_attendance', name: 'Attendance', icon: '📅' },
                { id: 'parent_homework', name: 'Homework', icon: '📖' },
                { id: 'parent_fees', name: 'Fees & Dues', icon: '💳' },
                { id: 'parent_results', name: 'Results', icon: '📜' },
                { id: 'parent_leave', name: 'Leave Application', icon: '📝' },
                { id: 'parent_notices', name: 'Announcements', icon: '🔔' },
                { id: 'manage_profile', name: 'My Profile', icon: '👤' },
                { id: 'settings', name: 'Settings', icon: '⚙️' }
            ]
        };
        return [...common, ...(menus[role] || [])];
    },

    // Utility Functions
    submitApplication: function (e) {
        e.preventDefault();
        const appData = {
            id: "ADM-" + Math.floor(Math.random() * 10000),
            studentName: document.getElementById('appName').value,
            grade: document.getElementById('appGrade').value,
            dob: document.getElementById('appDob').value,
            parentName: document.getElementById('appFather').value,
            parentEmail: auth.currentUser.email, // Link to logged in user
            phone: document.getElementById('appPhone').value,
            address: document.getElementById('appAddress').value,
            status: 'Pending',
            date: new Date().toLocaleDateString()
        };

        schoolDB.admissions.push(appData);
        showToast('🎉 Application Submitted Successfully!\nYou can track the status in "My Applications".', 'success');
        this.loadPage('my_applications');
    },

    renderSidebar: function () {
        const role = auth.currentUser.role.toLowerCase();
        const nav = document.getElementById('navLinks');
        nav.innerHTML = '';

        const items = this.getMenuItems(role);
        items.forEach(item => {
            const link = document.createElement('a');
            link.href = '#';
            link.className = `flex items-center gap-[12px] px-[16px] h-[44px] rounded-[22px] text-[14px] font-medium transition-all duration-200 hover:bg-gray-50 text-pucho-dark group`;
            if (item.id === 'overview') link.classList.add('bg-pucho-purple/10', 'active-nav');

            link.innerHTML = `
                <span class="text-xl opacity-70 group-hover:scale-110 transition-transform">${item.icon}</span> 
                <span class="truncate">${item.name}</span>
            `;
            link.onclick = (e) => {
                e.preventDefault();
                document.querySelectorAll('#navLinks a').forEach(l => l.classList.remove('bg-pucho-purple/10', 'active-nav'));
                link.classList.add('bg-pucho-purple/10', 'active-nav');
                this.loadPage(item.id);
            };
            nav.appendChild(link);
        });
    },

    loadPage: function (id) {
        const content = document.getElementById('mainContent');
        const title = document.getElementById('pageTitle');
        const desc = document.getElementById('pageDesc');
        const role = auth.currentUser.role;

        const metadata = {
            overview: { title: 'Dashboard Overview', desc: 'Quick summary of school activity' },
            admissions: { title: 'Admissions Hall', desc: 'Track and process new student applications' },
            students: { title: 'Student Database', desc: 'Manage profiles, classes, and sections' },
            staff: { title: 'Staff Directory', desc: 'Manage teachers, clerks, and accountants' },
            fees: { title: 'Finance Center', desc: 'Fee structures, billing, and collection' },
            exams: { title: 'Examination Office', desc: 'Schedule exams and manage academic results' },
            attendance_all: { title: 'Global Attendance', desc: 'Monitor daily presence for students and staff' },
            safety_monitor: { title: 'Safety & Security', desc: 'Real-time student tracking and emergency alerts' },
            ai_insights: { title: 'AI Academic Insights', desc: 'Predictive analytics and performance intervention' },
            communication: { title: 'Broadcast Room', desc: 'Send circulars and notifications' },
            reports: { title: 'System Reports', desc: 'Detailed analytics and exportable reports' },
            settings: { title: 'System Settings', desc: 'Configure school profile and academic year' },
            my_classes: { title: 'My Schedule', desc: 'Assigned classes and teaching subjects' },
            mark_attendance: { title: 'Student Register', desc: 'Mark and submit daily class attendance' },
            exam_marks: { title: 'Grade Book', desc: 'Enter student marks for tests and exams' },
            manage_quizzes: { title: 'Quiz Builder', desc: 'Create and deploy evaluations' },
            homework: { title: 'Academics', desc: 'Upload homework and study materials' },
            staff_notices: { title: 'Internal Notices', desc: 'Important staff announcements' },
            parent_attendance: { title: 'Attendance Log', desc: 'View your child\'s presence history' },
            parent_homework: { title: 'Homework & Tasks', desc: 'Daily assignments and project deadlines' },
            parent_fees: { title: 'Fee Status', desc: 'Online dues tracking and payment history' },
            parent_results: { title: 'Report Cards', desc: 'Academic performance and results summary' },
            parent_leave: { title: 'Leave Application', desc: 'Apply for absence or viewing leave history' },
            parent_notices: { title: 'School Notices', desc: 'Announcements and events for parents' },
            manage_profile: { title: 'My Profile', desc: 'Manage your personal account details' },
            settings: { title: 'Settings', desc: 'Configure application preferences' }
        };

        const meta = metadata[id] || { title: 'Module', desc: 'Section Details' };
        title.innerText = meta.title;
        desc.innerText = meta.desc;

        if (this.templates[id]) {
            content.innerHTML = this.templates[id](role);
        } else {
            content.innerHTML = `
                <div class="flex flex-col items-center justify-center p-20 animate-fade-in text-center">
                    <div class="text-8xl mb-6">🚧</div>
                    <h2 class="text-3xl font-bold text-pucho-dark mb-2">${meta.title} Module</h2>
                    <p class="text-gray-400 font-inter max-w-md">The ${id} system is currently being populated with Master Prompt logic. Stay tuned!</p>
                </div>
            `;
        }
    },

    showAddStaffModal: function () {
        document.getElementById('staffModal').classList.remove('hidden');
        document.querySelector('#staffModal h1').innerText = "Add New Staff";
        document.getElementById('staffForm').reset();
        delete document.getElementById('staffForm').dataset.editId;
        const form = document.getElementById('staffForm');
        form.onsubmit = (e) => {
            e.preventDefault();
            this.submitStaffData();
        };
    },

    loadAttendanceStudents: function () {
        const cls = document.getElementById('attClass').value;
        const div = document.getElementById('attDiv').value;
        const list = document.getElementById('attendanceList');

        if (!cls || !div) return;

        // Filter students
        const students = schoolDB.students.filter(s => s.class === cls && s.division === div);

        if (students.length === 0) {
            list.innerHTML = `<div class="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-3xl text-center animate-fade-in">
                <div class="text-4xl mb-4">📭</div>
                <h4 class="font-bold text-gray-600">No Students Found</h4>
                <p class="text-sm text-gray-400">No students enrolled in ${cls} - ${div}</p>
            </div>`;
            return;
        }

        list.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
            ${students.map((s, i) => `
                <div class="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-subtle transition-all group">
                     <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center font-bold text-xs text-blue-500 border border-blue-100">${s.rollNo || i + 1}</div>
                        <div>
                            <p class="font-bold text-sm text-pucho-dark">${s.name}</p>
                            <p class="text-[10px] font-bold text-gray-400">ID: ${s.id}</p>
                        </div>
                     </div>
                     <button onclick="this.classList.toggle('bg-red-50'); this.classList.toggle('text-red-600'); this.classList.toggle('border-red-200'); this.classList.toggle('bg-green-50'); this.classList.toggle('text-green-600'); this.classList.toggle('border-green-200'); this.innerText = this.innerText === 'P' ? 'A' : 'P'" 
                     class="w-10 h-10 rounded-xl bg-green-50 text-green-600 border border-green-200 font-bold hover:scale-110 transition-all shadow-sm">P</button>
                </div>
            `).join('')}
        </div>`;
    },

    publishQuiz: function () {
        const cls = document.getElementById('quizClass').value;
        const div = document.getElementById('quizDiv').value;
        const subject = document.getElementById('quizSubject').value;
        const type = document.getElementById('quizType').value;
        const title = document.getElementById('quizTitle').value;

        if (!cls || !subject || !type || !title) {
            showToast("Please fill all fields!", 'error');
            return;
        }

        const newQuiz = {
            id: 'QZ-' + Math.floor(Math.random() * 10000),
            title, class: cls, division: div || 'All', subject, type,
            date: new Date().toLocaleDateString(),
            status: 'Active'
        };

        schoolDB.quizzes.unshift(newQuiz);
        showToast(`Assesssment Published for ${cls} ${div || ''}!`, 'success');
        this.loadPage('manage_quizzes');
    },

    submitStaffData: function () {
        const editId = document.getElementById('staffForm').dataset.editId;
        const staffData = {
            id: editId || 'S' + Math.floor(Math.random() * 1000),
            name: document.getElementById('staffName').value,
            email: document.getElementById('staffEmail').value,
            mobile: document.getElementById('staffPhone').value,
            dept: document.getElementById('staffDept').value,
            role: document.getElementById('staffRole').value,
            class_assigned: document.getElementById('staffClass').value,
            division_assigned: document.getElementById('staffDivision').value,
            subject: document.getElementById('staffSubject').value,
            password: document.getElementById('staffPass').value,
            joining_date: document.getElementById('staffJoiningDate').value,
            action: editId ? 'update_staff_account' : 'create_staff_account'
        };

        const webhookUrl = 'https://studio.pucho.ai/api/v1/webhooks/NySXblkkRlsCPEPo87hOm';
        const submitBtn = document.querySelector('#staffForm button');
        const originalText = submitBtn.innerText;

        submitBtn.innerText = 'Processing...';
        submitBtn.disabled = true;

        fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(staffData)
        })
            .then(response => {
                if (response.ok) {
                    showToast(editId ? 'Staff updated via flow!' : 'Staff added and credentials flow triggered!', 'success');
                    document.getElementById('staffModal').classList.add('hidden');

                    if (editId) {
                        const index = schoolDB.staff.findIndex(s => s.id === editId);
                        if (index !== -1) schoolDB.staff[index] = { ...schoolDB.staff[index], ...staffData };
                    } else {
                        schoolDB.staff.push({ ...staffData, status: 'Active' });
                    }
                    this.loadPage('staff');
                } else {
                    throw new Error('Webhook failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showToast('Failed to trigger automation flow.', 'error');
            })
            .finally(() => {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            });
    },

    approveAdmission: function (id) {
        if (!confirm("Approve this admission? This will enroll the student.")) return;

        const admissionIndex = schoolDB.admissions.findIndex(a => a.id === id);
        if (admissionIndex === -1) return;

        const admission = schoolDB.admissions[admissionIndex];

        // Generate Student ID (Roll No)
        const studentId = "STD-" + (schoolDB.students.length + 1).toString().padStart(3, '0');

        const newStudent = {
            id: studentId,
            name: admission.studentName || admission.childName, // Handle variation
            class: admission.grade,
            division: 'A', // Default
            rollNo: schoolDB.students.length + 1,
            guardian: admission.parentName,
            contact: admission.phone,
            email: admission.email,
            attendance: '0%', // Initial
            fees_status: 'Pending',
            status: 'Active'
        };

        // Move to Students
        schoolDB.students.push(newStudent);

        // Remove from Admissions
        schoolDB.admissions.splice(admissionIndex, 1);

        showToast(`Student Enrolled Successfully!\nName: ${newStudent.name}\nID: ${newStudent.id}\nClass: ${newStudent.class}`, 'success');

        // Refresh Page
        this.loadPage('admissions');
    },

    editStaff: function (id) {
        const staff = schoolDB.staff.find(s => s.id === id);
        if (!staff) return;

        document.getElementById('staffModal').classList.remove('hidden');
        document.querySelector('#staffModal h1').innerText = "Edit Staff Member";
        document.getElementById('staffForm').dataset.editId = id;

        document.getElementById('staffName').value = staff.name;
        document.getElementById('staffEmail').value = staff.email;
        document.getElementById('staffPhone').value = staff.mobile || staff.phone || '';
        document.getElementById('staffDept').value = staff.dept;
        document.getElementById('staffRole').value = staff.role;
        document.getElementById('staffClass').value = staff.class_assigned || '';
        document.getElementById('staffDivision').value = staff.division_assigned || '';
        document.getElementById('staffSubject').value = staff.subject || '';
        document.getElementById('staffPass').value = staff.password || '';
        document.getElementById('staffJoiningDate').value = staff.joining_date || '';

        document.getElementById('staffForm').onsubmit = (e) => {
            e.preventDefault();
            this.submitStaffData();
        };
    },

    deleteStaff: function (id) {
        if (confirm('Are you sure you want to delete this staff member? This will delete directly from Supabase.')) {
            // Webhook nahi, seedha Database se delete
            const directDbUrl = `${this.supabaseUrl}/rest/v1/staff?id=eq.${id}`;

            fetch(directDbUrl, {
                method: 'DELETE',
                headers: {
                    'apikey': this.supabaseKey,
                    'Authorization': `Bearer ${this.supabaseKey}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (response.ok) {
                        schoolDB.staff = schoolDB.staff.filter(s => s.id !== id);
                        this.loadPage('staff');
                    }
                })
                .catch(err => {
                    console.error('Delete tech error:', err);
                });
        }
    },

    showChangePasswordModal: function () {
        document.getElementById('passwordModal').classList.remove('hidden');
        document.getElementById('passwordForm').reset();
    },

    submitNewPassword: function () {
        const newPass = document.getElementById('newPassword').value;
        const confirmPass = document.getElementById('confirmPassword').value;

        if (newPass !== confirmPass) {
            showToast("Passwords do not match!", 'error');
            return;
        }

        // Current User Check (For Demo, we assume a simulated user ID or email)
        const currentUser = auth.currentUser;
        if (!currentUser) {
            showToast("No user logged in.", 'error');
            return;
        }

        const submitBtn = document.querySelector('#passwordForm button');
        submitBtn.innerText = "Updating...";
        submitBtn.disabled = true;

        // Try to find the user in our local staff list by email to get their Supabase ID
        const staffRecord = schoolDB.staff.find(s => s.email === currentUser.email);
        const userId = staffRecord ? staffRecord.id : null;

        if (!userId) {
            setTimeout(() => {
                showToast("Password updated locally! (In a real app, this would sync to DB)", 'success');
                document.getElementById('passwordModal').classList.add('hidden');
                submitBtn.innerText = "Update Password";
                submitBtn.disabled = false;
            }, 1000);
            return;
        }

        const directDbUrl = `${this.supabaseUrl}/rest/v1/staff?id=eq.${userId}`;

        fetch(directDbUrl, {
            method: 'PATCH',
            headers: {
                'apikey': this.supabaseKey,
                'Authorization': `Bearer ${this.supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ password: newPass })
        })
            .then(response => {
                if (response.ok) {
                    showToast('Password successfully updated in Database!', 'success');
                    document.getElementById('passwordModal').classList.add('hidden');
                } else {
                    showToast('Failed to update password. Check console.', 'error');
                    console.error('Update failed', response);
                }
            })
            .catch(err => {
                console.error('Error:', err);
                showToast('Connection error.', 'error');
            })
            .finally(() => {
                submitBtn.innerText = "Update Password";
                submitBtn.disabled = false;
            });
    },

    filterStaff: function () {
        const classFilter = document.getElementById('filterClass').value;
        const divFilter = document.getElementById('filterDivision').value;
        const tbody = document.getElementById('staffTableBody');

        const filteredStaff = schoolDB.staff.filter(s => {
            const matchClass = classFilter === '' || s.class_assigned === classFilter;
            const matchDiv = divFilter === '' || s.division_assigned === divFilter;
            return matchClass && matchDiv;
        });

        if (filteredStaff.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="p-8 text-center text-gray-400">No staff found for selected filters</td></tr>`;
            return;
        }

        tbody.innerHTML = filteredStaff.map(s => {
            const classInfo = s.class_assigned ? `<br><span class="text-[10px] text-gray-400 font-medium">Class ${s.class_assigned}-${s.division_assigned || 'A'}</span>` : '';
            return `<tr class="hover:bg-gray-50/50 font-inter animate-fade-in">
                <td class="p-6 border-b border-gray-50 font-bold">${s.name}</td>
                <td class="p-6 border-b border-gray-50">
                    <span class="text-xs font-bold text-pucho-purple">${s.role}</span>
                    ${classInfo}
                </td>
                <td class="p-6 border-b border-gray-50 text-sm text-gray-400">${s.mobile || s.phone || 'N/A'}</td>
                <td class="p-6 border-b border-gray-50">
                    <div class="flex gap-3">
                        <button onclick="dashboard.editStaff('${s.id}')" class="text-blue-600 hover:text-blue-800 font-bold text-xs uppercase tracking-widest">Edit</button>
                        <button onclick="dashboard.deleteStaff('${s.id}')" class="text-red-600 hover:text-red-800 font-bold text-xs uppercase tracking-widest">Delete</button>
                    </div>
                </td>
            </tr>`;
        }).join('');
    },

    showBroadcastModal: function () {
        document.getElementById('broadcastModal').classList.remove('hidden');
        document.getElementById('broadcastForm').reset();
        document.getElementById('bcDate').valueAsDate = new Date();
    },

    publishNotice: function () {
        const title = document.getElementById('bcTitle').value;
        const content = document.getElementById('bcContent').value;
        const target = document.getElementById('bcTarget').value;
        const date = document.getElementById('bcDate').value;
        const noticeClass = document.getElementById('bcClass').value;
        const noticeDivision = document.getElementById('bcDivision') ? document.getElementById('bcDivision').value : '';

        if (!title || !content) {
            showToast("Title and Content are required", 'error');
            return;
        }

        const newNotice = {
            id: 'N' + Math.floor(Math.random() * 1000),
            title, content, target, date,
            class: noticeClass,
            division: noticeDivision
        };

        schoolDB.notices.unshift(newNotice);
        showToast('Notice Published Successfully!', 'success');
        document.getElementById('broadcastModal').classList.add('hidden');
        this.loadPage('communication');
    },

    // Modal Helpers
    showAddStudentModal: function () {
        const modal = document.getElementById('studentModal');
        if (modal) modal.classList.remove('hidden');
    },

    showAddStaffModal: function () {
        const modal = document.getElementById('staffModal');
        if (modal) modal.classList.remove('hidden');
    },

    // Generic Filter Helper
    filterGeneric: function (type) {
        const classFilter = document.getElementById(`filterClass_${type}`).value;
        const divFilter = document.getElementById(`filterDivision_${type}`) ? document.getElementById(`filterDivision_${type}`).value : '';
        const tbody = document.getElementById(`${type}TableBody`);

        let dataSource = [];
        let rowBuilder = null;

        if (type === 'students') {
            dataSource = schoolDB.students;
            rowBuilder = (s) => `<tr class="hover:bg-gray-50/50 font-inter animate-fade-in">
                <td class="p-6 border-b border-gray-50 font-bold">${s.name}</td>
                <td class="p-6 border-b border-gray-50 text-xs font-bold text-gray-500 uppercase">${s.id}</td>
                <td class="p-6 border-b border-gray-50 text-sm font-medium text-gray-500">${s.class}-${s.division}</td>
                <td class="p-6 border-b border-gray-50 flex gap-2"><button class="text-pucho-purple font-bold text-xs">ID CARD</button></td>
            </tr>`;
        } else if (type === 'fees') {
            // Join fees with students to filter by class
            dataSource = schoolDB.fees.map(f => {
                const student = schoolDB.students.find(s => s.id === f.studentId);
                return { ...f, class: student?.class, division: student?.division };
            });
            rowBuilder = (f) => `<tr class="font-inter animate-fade-in">
                <td class="p-6 border-b border-gray-50 font-bold">${f.studentId}</td>
                <td class="p-6 border-b border-gray-50 font-bold text-pucho-purple">₹${f.amount}</td>
                <td class="p-6 border-b border-gray-50"><span class="px-3 py-1 ${f.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} rounded-full text-[10px] font-bold">${f.status}</span></td>
            </tr>`;
        } else if (type === 'exams') {
            dataSource = schoolDB.exams;
            rowBuilder = (e) => `<tr class="font-inter animate-fade-in">
                <td class="p-6 border-b border-gray-50 font-bold">${e.title}</td>
                <td class="p-6 border-b border-gray-50 text-sm font-bold text-gray-500">${e.class}</td>
                <td class="p-6 border-b border-gray-50 text-sm text-gray-400">${e.startDate}</td>
            </tr>`;
        }

        const filteredData = dataSource.filter(item => {
            const matchClass = classFilter === '' || item.class === classFilter;
            const matchDiv = divFilter === '' || (item.division && item.division === divFilter);
            return matchClass && matchDiv;
        });

        if (filteredData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="p-8 text-center text-gray-400">No records found</td></tr>`;
            return;
        }

        tbody.innerHTML = filteredData.map(rowBuilder).join('');
    },

    templates: {
        new_application: function () {
            return `<div class="max-w-4xl mx-auto bg-white rounded-[40px] p-10 border border-gray-100 shadow-subtle animate-fade-in relative overflow-hidden">
                 <div class="absolute top-0 right-0 w-64 h-64 bg-pucho-purple/5 rounded-full blur-[80px]"></div>
                <div class="mb-8 relative z-10">
                    <h3 class="text-2xl font-bold text-pucho-dark">Student Admission Form</h3>
                    <p class="text-gray-400">Session 2024-25</p>
                </div>
                <form onsubmit="dashboard.submitApplication(event)" class="space-y-6 relative z-10 font-inter">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-bold text-gray-700 mb-1">Child's Full Name</label>
                            <input type="text" id="appName" required class="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:border-pucho-purple outline-none" placeholder="e.g. Arjun Singh">
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-gray-700 mb-1">Date of Birth</label>
                            <input type="date" id="appDob" required class="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:border-pucho-purple outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-gray-700 mb-1">Grade Applying For</label>
                             <select id="appGrade" class="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:border-pucho-purple outline-none cursor-pointer">
                                <option>Nursery</option><option>LKG</option><option>UKG</option>
                                <option>Grade 1</option><option>Grade 2</option><option>Grade 3</option>
                                <option>Grade 4</option><option>Grade 5</option><option>Grade 6</option>
                                <option>Grade 7</option><option>Grade 8</option><option>Grade 9</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-gray-700 mb-1">Previous School (Optional)</label>
                            <input type="text" id="appPrevSchool" class="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:border-pucho-purple outline-none" placeholder="e.g. St. Mary's">
                        </div>
                    </div>
                    
                    <div class="pt-6 border-t border-gray-50">
                        <h4 class="font-bold text-gray-500 text-sm uppercase tracking-widest mb-4">Parent Details</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-1">Father's Name</label>
                                <input type="text" id="appFather" required class="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:border-pucho-purple outline-none" value="${auth.currentUser.name || ''}">
                            </div>
                             <div>
                                <label class="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                                <input type="tel" id="appPhone" required class="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:border-pucho-purple outline-none" placeholder="+91...">
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-sm font-bold text-gray-700 mb-1">Residential Address</label>
                                <textarea id="appAddress" rows="2" class="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:border-pucho-purple outline-none" placeholder="Full address..."></textarea>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end pt-4">
                        <button type="submit" class="bg-pucho-dark text-white px-10 py-4 rounded-2xl font-bold shadow-glow hover:bg-pucho-purple transition-all transform active:scale-95">SUBMIT APPLICATION</button>
                    </div>
                </form>
            </div>`;
        },

        my_applications: function () {
            const myApps = schoolDB.admissions.filter(a => a.parentEmail === auth.currentUser.email || a.parentName === auth.currentUser.name);

            if (myApps.length === 0) {
                return `<div class="bg-white rounded-[40px] p-12 border border-gray-100 shadow-subtle animate-fade-in text-center">
                    <div class="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-6xl">📂</div>
                    <h3 class="text-2xl font-bold text-pucho-dark mb-2">No Applications Yet</h3>
                    <p class="text-gray-400 mb-8 max-w-md mx-auto">Start your journey with SMS Cloud by applying for admission.</p>
                    <button onclick="dashboard.loadPage('new_application')" class="btn-primary px-8 py-3 rounded-2xl shadow-glow">Start New Application</button>
                </div>`;
            }

            return `<div class="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-subtle animate-fade-in">
                 <div class="p-8 border-b border-gray-50"><h3 class="font-bold text-2xl">My Applications</h3></div>
                 <div class="divide-y divide-gray-50">
                    ${myApps.map(app => `
                        <div class="p-6 flex flex-col md:flex-row justify-between items-center hover:bg-gray-50 transition-colors gap-4">
                            <div>
                                <h4 class="font-bold text-lg text-pucho-dark">${app.studentName}</h4>
                                <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Applying for: ${app.grade}</p>
                                <p class="text-xs text-gray-400 mt-2">Submitted on: ${app.date}</p>
                            </div>
                            <div class="flex items-center gap-4">
                                <div class="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest ${app.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}">
                                    ${app.status === 'Pending' ? '⏳ Application Under Review' : '✅ Admission Granted'}
                                </div>
                                ${app.status !== 'Pending' ? '<button onclick="showToast(\'Please visit the school office to complete formalities.\', \'info\')" class="text-pucho-purple font-bold text-xs underline">Next Steps</button>' : ''}
                            </div>
                        </div>
                    `).join('')}
                 </div>
            </div>`;
        },

        communication: function () {
            let notices = schoolDB.notices.map(n => `
                <div class="bg-white p-6 rounded-[32px] border border-gray-100 shadow-subtle flex flex-col gap-4 animate-fade-in">
                    <div class="flex justify-between items-start">
                        <div>
                            <span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-[10px] font-bold uppercase tracking-widest">${n.target}</span>
                            <h4 class="text-xl font-bold text-pucho-dark mt-2">${n.title}</h4>
                            <p class="text-gray-400 text-xs font-bold mt-1">${n.date}</p>
                        </div>
                        <button class="p-2 hover:bg-gray-100 rounded-full"><svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
                    </div>
                    <p class="text-gray-600 text-sm leading-relaxed">${n.content}</p>
                    <div class="pt-4 border-t border-gray-50 flex justify-between items-center">
                        <span class="text-xs font-bold text-gray-400">By Admin</span>
                        <button class="text-pucho-purple text-xs font-bold hover:underline">Read More</button>
                    </div>
                </div>
            `).join('');

            return `<div class="space-y-8 animate-fade-in">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="font-bold text-2xl text-pucho-dark">Broadcast Room</h3>
                        <p class="text-gray-400">Send circulars and notifications</p>
                    </div>
                    <button onclick="dashboard.showBroadcastModal()" class="bg-pucho-dark text-white px-8 py-3 rounded-2xl font-bold hover:shadow-glow hover:bg-pucho-purple transition-all">+ NEW POST</button>
                </div>
                
                <div class="bg-white p-2 rounded-[24px] inline-flex mb-4">
                     <button class="px-6 py-2 bg-pucho-purple/10 text-pucho-purple rounded-[18px] text-xs font-bold uppercase tracking-widest">All</button>
                     <button class="px-6 py-2 text-gray-400 hover:text-pucho-dark rounded-[18px] text-xs font-bold uppercase tracking-widest">Parents</button>
                     <button class="px-6 py-2 text-gray-400 hover:text-pucho-dark rounded-[18px] text-xs font-bold uppercase tracking-widest">Staff</button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    ${notices}
                </div>
            </div>`;
        },
        card: function (title, value, sub, icon, color = 'pucho-purple') {
            return `<div class="p-8 bg-white border border-gray-100 rounded-[32px] shadow-subtle hover:shadow-glow transition-all">
                <div class="flex justify-between items-start mb-6">
                    <div class="w-14 h-14 rounded-2xl bg-${color}/10 flex items-center justify-center text-2xl">${icon}</div>
                    <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">${sub}</span>
                </div>
                <h4 class="text-gray-500 text-sm font-medium mb-1">${title}</h4>
                <p class="text-3xl font-bold text-pucho-dark tracking-tight">${value}</p>
            </div>`;
        },

        overview: function (role) {
            role = role.toLowerCase();
            // Check if New Parent (Logic repeated for template safety)
            let isNewParent = false;
            if (role === 'parent') {
                const myKids = schoolDB.students.filter(s => s.guardian === auth.currentUser.name);
                isNewParent = myKids.length === 0;
            }

            // --- HELPER: Simple CSS Bar Graph ---
            const createBarGraph = (title, labels, values, color = 'bg-pucho-purple') => {
                const max = Math.max(...values);
                const bars = values.map((v, i) => `
                    <div class="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                        <div class="w-full bg-gray-50 rounded-t-xl relative h-full flex items-end">
                            <div class="w-full ${color} rounded-t-xl transition-all duration-1000 relative group-hover:opacity-80" style="height: ${(v / max) * 100}%">
                                <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">${v}%</div>
                            </div>
                        </div>
                        <span class="text-[10px] font-bold text-gray-400 uppercase">${labels[i]}</span>
                    </div>
                `).join('');
                return `<div class="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm mt-6">
                    <h4 class="font-bold text-gray-500 text-xs uppercase tracking-widest mb-4">${title}</h4>
                    <div class="h-40 flex items-end gap-3">${bars}</div>
                </div>`;
            };

            let cards = '';
            let charts = ''; // New section for graphs

            if (role === 'admin') {
                // ... (Admin Logic remains same for now) ...
                const pending = schoolDB.admissions.filter(a => a.status === 'Pending').length;
                cards = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
                    ${this.card('Total Students', schoolDB.students.length, 'Students', '👨‍🎓')}
                    ${this.card('Faculty Count', schoolDB.staff.length, 'Staff', '👩‍🏫', 'blue')}
                    ${this.card('Pending Admissions', pending, 'Applications', '📝', 'orange')}
                    ${this.card('Safety Alerts', '2 Critical', 'Security', '🚨', 'red')}
                </div>`;

                // Add Safety Alert Section for Admin
                const safetyAlerts = `
                    <div class="mt-8 bg-white p-8 rounded-[40px] border border-red-100 shadow-glow animate-pulse">
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="font-bold text-xl text-red-600 flex items-center gap-2">
                                <span class="text-2xl">🚨</span> CRITICAL SAFETY ALERTS
                            </h3>
                            <div class="flex gap-4">
                                <button onclick="dashboard.triggerSafetySimulation()" class="text-[10px] font-bold bg-white px-4 py-2 border border-red-200 rounded-xl hover:bg-red-50 transition-all uppercase tracking-widest">Simulate AI Scan</button>
                                <button class="text-xs font-bold text-red-600 uppercase tracking-widest hover:underline">View All Protocols</button>
                            </div>
                        </div>
                        <div class="space-y-4">
                            <div class="p-4 bg-red-50 rounded-2xl flex items-center justify-between border border-red-100">
                                <div class="flex items-center gap-4">
                                    <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">📍</div>
                                    <div>
                                        <p class="font-bold text-pucho-dark">Arjun Das (ID: S001)</p>
                                        <p class="text-xs text-red-500 font-bold">Attendance Mismatch: Scanned on BUS (08:15 AM) but NO-SHOW in Class 10A.</p>
                                    </div>
                                </div>
                                <button class="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg" onclick="showToast('Emergency call initiated to Guardian: Vikram Das', 'warning')">CALL PARENT</button>
                            </div>
                            <div class="p-4 bg-orange-50 rounded-2xl flex items-center justify-between border border-orange-100 opacity-80">
                                <div class="flex items-center gap-4">
                                    <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">🚌</div>
                                    <div>
                                        <p class="font-bold text-pucho-dark">Riya Sharma (ID: S002)</p>
                                        <p class="text-xs text-orange-600 font-bold">Bus Delayed: Route #12 stuck in traffic (预计 10 min delay).</p>
                                    </div>
                                </div>
                                <span class="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Auto-Notified Parents</span>
                            </div>
                        </div>
                    </div>
                `;
                cards += safetyAlerts;

            } else if (role === 'staff') {
                // STAFF DASHBOARD ENHANCEMENTS
                cards = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    ${this.card('My Classes', '5 Classes', 'Schedule', '📚')}
                    ${this.card('Avg Attendance', '88%', 'Overall', '📈', 'green')}
                    ${this.card('Pending Evaluations', '3 Batches', 'To Check', '📝', 'orange')}
                </div>`;

                // Staff Charts
                charts = `<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-up bg-w">
                    ${createBarGraph('Class-wise Attendance Avg', ['9th A', '9th B', '10th A', '10th B', '11th Sci'], [92, 85, 96, 88, 90], 'bg-green-500')}
                    ${createBarGraph('Syllabus Completion', ['Maths', 'Physics', 'Chem', 'Bio', 'Eng'], [65, 40, 55, 70, 80], 'bg-blue-500')}
                </div>`;

            } else if (role === 'student' || (!isNewParent && role === 'parent')) {
                // STUDENT DASHBOARD (Keep as is)
                // PARENT DASHBOARD: OVERVIEW = ACTION CENTER
                if (role === 'parent') {
                    // Parent Overview: Focus on "What's Next?" & "Notifications"
                    cards = `<div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                        <div class="p-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-[32px] text-white shadow-lg relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer" onclick="dashboard.loadPage('parent_fees')">
                            <h4 class="font-bold text-white/70 text-sm uppercase tracking-widest mb-1">Fee Status</h4>
                            <p class="text-3xl font-bold tracking-tight">Paid</p>
                            <p class="text-xs mt-4 opacity-80">Next Due: 10 Apr 2024</p>
                        </div>
                        <div class="p-8 bg-white border border-gray-100 rounded-[32px] shadow-sm relative overflow-hidden group hover:border-pucho-purple transition-colors cursor-pointer" onclick="dashboard.loadPage('parent_homework')">
                            <h4 class="font-bold text-gray-400 text-sm uppercase tracking-widest mb-1">Homework</h4>
                            <p class="text-3xl font-bold text-pucho-dark tracking-tight">2 Pending</p>
                            <p class="text-xs text-orange-500 font-bold mt-4">Mathemtics due tomorrow</p>
                        </div>
                         <div class="p-8 bg-white border border-gray-100 rounded-[32px] shadow-sm relative overflow-hidden group hover:border-pucho-purple transition-colors cursor-pointer" onclick="dashboard.loadPage('parent_notices')">
                            <h4 class="font-bold text-gray-400 text-sm uppercase tracking-widest mb-1">Notices</h4>
                            <p class="text-3xl font-bold text-pucho-dark tracking-tight">3 New</p>
                            <p class="text-xs text-blue-500 font-bold mt-4">Latest: Annual Day</p>
                        </div>
                    </div>`;

                    charts = `<div class="mt-8 bg-white p-8 rounded-[40px] border border-gray-100 shadow-subtle">
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="font-bold text-xl text-pucho-dark">Upcoming Events</h3>
                            <button class="text-xs font-bold text-pucho-purple">View Calendar</button>
                        </div>
                        <div class="space-y-4">
                            <div class="flex gap-4 items-center p-4 hover:bg-gray-50 rounded-2xl transition-colors">
                                <div class="w-16 h-16 bg-orange-100 rounded-2xl flex flex-col items-center justify-center text-orange-600 font-bold leading-tight">
                                    <span class="text-xl">15</span><span class="text-[10px] uppercase">Jan</span>
                                </div>
                                <div>
                                    <h4 class="font-bold text-pucho-dark">Science Fair Exhibition</h4>
                                    <p class="text-xs text-gray-500">School Auditorium • 10:00 AM</p>
                                </div>
                            </div>
                             <div class="flex gap-4 items-center p-4 hover:bg-gray-50 rounded-2xl transition-colors">
                                <div class="w-16 h-16 bg-blue-100 rounded-2xl flex flex-col items-center justify-center text-blue-600 font-bold leading-tight">
                                    <span class="text-xl">20</span><span class="text-[10px] uppercase">Jan</span>
                                </div>
                                <div>
                                    <h4 class="font-bold text-pucho-dark">Inter-House Football</h4>
                                    <p class="text-xs text-gray-500">Main Ground • 03:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>`;
                } else {
                    // STUDENT OVERVIEW (Keep existing graphs)
                    const studentName = auth.currentUser.name;
                    // ... (Existing Student Logic: mock data init) ...
                    const attendanceData = [95, 80, 100, 90, 85, 92]; // Last 6 months
                    const attLabels = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];

                    const marksData = [78, 85, 92, 68, 88];
                    const subjectLabels = ['Maths', 'Sci', 'Eng', 'Hist', 'Comp'];

                    // Get Quizzes
                    const studentProfile = schoolDB.students.find(s => s.name === studentName) || { class: 'Grade 10', division: 'A' };
                    const myQuizzes = schoolDB.quizzes.filter(q => q.class === studentProfile.class);

                    const quizIcon = myQuizzes.length > 0 ? `<div class="relative">⚡ <span class="absolute -top-1 -right-1 flex h-3 w-3"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span><span class="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span></span></div>` : '⚡';

                    cards = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                        ${this.card('Attendance', '92%', 'Yearly Avg', '📅')}
                        ${this.card('Last Grade', 'A', 'Result', '🏆', 'blue')}
                        ${this.card('Assessments', `${myQuizzes.length} Active`, 'To Do', quizIcon, 'orange')}
                    </div>`;

                    charts = `<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-up">
                        ${createBarGraph('Monthly Attendance Trends', attLabels, attendanceData, 'bg-pucho-purple')}
                        ${createBarGraph('Academic Performance (Last Term)', subjectLabels, marksData, 'bg-indigo-500')}
                    </div>
                
                <!-- Recent Targeted Quizzes List -->
                 ${myQuizzes.length > 0 ? `
                <div class="mt-8">
                    <h3 class="font-bold text-xl mb-4 flex items-center gap-2">📢 Latest Updates for ${studentProfile.class} - ${studentProfile.division}</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${myQuizzes.slice(0, 4).map(q => `
                            <div class="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm flex items-center justify-between">
                                <div>
                                    <span class="text-[10px] font-bold bg-orange-50 text-orange-600 px-2 py-1 rounded-md uppercase tracking-wider mb-2 inline-block">${q.type}</span>
                                    <h4 class="font-bold text-pucho-dark">${q.title}</h4>
                                    <p class="text-xs text-gray-400 font-bold mt-1">${q.subject}</p>
                                </div>
                                <button class="bg-pucho-dark text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-pucho-purple transition-colors">START</button>
                            </div>
                        `).join('')}
                    </div>
                </div>` : ''}`;
                }
            } else if (isNewParent) {
                // New Parent (No Student yet)
                const myApps = schoolDB.admissions.filter(a => a.parentEmail === auth.currentUser.email || a.parentName === auth.currentUser.name);
                cards = `<div class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                ${this.card('Applications', myApps.length, 'Submitted', '📂')}
                ${this.card('Action Required', 'None', 'Status', '✅', 'green')}
                </div>
                <div class="bg-blue-50 border border-blue-100 p-6 rounded-3xl flex items-center justify-between mt-6">
                    <div>
                        <h4 class="font-bold text-blue-800">Complete Your Profile!</h4>
                        <p class="text-sm text-blue-600">Apply for admission to unlock full parent features.</p>
                    </div>
                    <button onclick="dashboard.loadPage('new_application')" class="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors">Apply Now</button>
                </div>`;
            }

            return `<div class="space-y-8 animate-slide-up">
                <div class="bg-gradient-to-r from-pucho-dark to-pucho-purple p-12 rounded-[40px] text-white relative overflow-hidden shadow-glow">
                    <div class="relative z-10 max-w-2xl">
                        <h2 class="text-5xl font-bold mb-4 tracking-tight">System Operational.</h2>
                        <p class="text-xl opacity-80 font-inter leading-relaxed">Welcome, ${auth.currentUser.name}. You are logged into the Master School Node: <b>${schoolDB.schoolInfo.academicYear}</b></p>
                    </div>
                    <div class="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                    <div class="absolute right-12 bottom-0 opacity-10 text-[180px]">🏫</div>
                </div>
                ${cards}
                ${charts}
            </div>`;
        },

        admissions: function () {
            if (schoolDB.admissions.length === 0) {
                return `<div class="bg-white rounded-[40px] p-12 border border-gray-100 shadow-subtle animate-fade-in text-center">
                    <div class="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-6xl">📝</div>
                    <h3 class="text-2xl font-bold text-pucho-dark mb-2">No Pending Admissions</h3>
                    <p class="text-gray-400 mb-8 max-w-md mx-auto">All applications have been processed. Good job!</p>
                </div>`;
            }

            let rows = schoolDB.admissions.map(a => `<tr class="hover:bg-gray-50/50 transition-all font-inter">
                <td class="p-6 font-bold text-pucho-dark border-b border-gray-50">${a.studentName}</td>
                <td class="p-6 text-gray-500 text-sm border-b border-gray-50">${a.grade}</td>
                <td class="p-6 text-gray-500 text-sm border-b border-gray-50">${a.parentName}</td>
                 <td class="p-6 text-gray-400 text-sm border-b border-gray-50">${a.date}</td>
                <td class="p-6 border-b border-gray-50"><span class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-[10px] font-bold uppercase tracking-widest">${a.status}</span></td>
                <td class="p-6 border-b border-gray-50">
                    <button onclick="dashboard.approveAdmission('${a.id}')" class="px-4 py-2 bg-pucho-dark text-white rounded-xl text-xs font-bold hover:bg-pucho-purple transition-all shadow-glow">Approve & Enroll</button>
                </td>
            </tr>`).join('');

            return `<div class="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-subtle animate-fade-in">
                <div class="p-8 border-b border-gray-50 flex justify-between items-center">
                    <div>
                        <h3 class="font-bold text-2xl">Admission Pipeline</h3>
                         <p class="text-gray-400 text-sm">Pending Applications: ${schoolDB.admissions.length}</p>
                    </div>
                </div>
                <table class="w-full text-left font-inter">
                    <thead class="bg-gray-50/50"><tr>
                        <th class="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student Name</th>
                        <th class="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Grade</th>
                        <th class="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Parent</th>
                         <th class="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                        <th class="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                        <th class="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Action</th>
                    </tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>`;
        },

        students: function () {
            // Empty State
            if (schoolDB.students.length === 0) {
                return `<div class="bg-white rounded-[40px] p-12 border border-gray-100 shadow-subtle animate-fade-in text-center">
                    <div class="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-6xl">🎓</div>
                    <h3 class="text-2xl font-bold text-pucho-dark mb-2">No Students Found</h3>
                    <p class="text-gray-400 mb-8 max-w-md mx-auto">Your student database is currently empty. Start by adding a new student or approving admissions.</p>
                    <button onclick="dashboard.showAddStudentModal()" class="btn-primary px-8 py-3 rounded-2xl shadow-glow hover:scale-105 transition-transform">+ ADD STUDENT</button>
                    ${this.renderStudentModal()} 
                </div>`;
            }

            setTimeout(() => dashboard.filterGeneric('students'), 0);
            return `<div class="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-subtle animate-fade-in">
                <div class="p-8 border-b border-gray-50 flex justify-between items-center">
                    <div>
                        <h3 class="font-bold text-2xl">Student Database</h3>
                        <p class="text-gray-400 text-sm">Total Students: ${schoolDB.students.length}</p>
                    </div>
                    <div class="flex gap-4">
                        <select id="filterClass_students" onchange="dashboard.filterGeneric('students')" class="px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 outline-none"><option value="">All Classes</option><option value="LKG">LKG</option><option value="UKG">UKG</option><option value="1st">1st</option><option value="2nd">2nd</option><option value="3rd">3rd</option><option value="4th">4th</option><option value="5th">5th</option><option value="6th">6th</option><option value="7th">7th</option><option value="8th">8th</option><option value="9th">9th</option><option value="10th">10th</option><option value="11th">11th</option><option value="12th">12th</option></select>
                        <select id="filterDivision_students" onchange="dashboard.filterGeneric('students')" class="px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 outline-none"><option value="">All Div</option><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option></select>
                        <button onclick="dashboard.showAddStudentModal()" class="bg-pucho-dark text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-pucho-purple transition-all">+ ADD</button>
                    </div>
                </div>
                <table class="w-full text-left font-inter">
                     <thead class="bg-gray-50/50">
                        <tr>
                            <th class="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student Info</th>
                            <th class="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Academic</th>
                            <th class="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Guardian</th>
                            <th class="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact</th>
                            <th class="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                            <th class="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Action</th>
                        </tr>
                    </thead>
                    <tbody id="studentsTableBody"></tbody>
                </table>
                ${this.renderStudentModal()}
            </div>`;
        },

        renderStudentModal: function () {
            return `<div id="studentModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-pucho-dark/40 backdrop-blur-sm hidden animate-fade-in">
                <div class="bg-white p-8 w-full max-w-2xl rounded-[32px] border border-white/30 shadow-2xl relative animate-slide-up max-h-[90vh] overflow-y-auto">
                    <button onclick="document.getElementById('studentModal').classList.add('hidden')" class="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full">✕</button>
                    <div class="mb-8 border-b border-gray-50 pb-4">
                        <h1 class="text-3xl font-bold text-pucho-dark mb-1">Add New Student</h1>
                        <p class="text-gray-500 font-inter">Complete profile setup</p>
                    </div>
                    <form id="studentForm" class="space-y-6 font-inter">
                        <!-- 1. Personal Info -->
                        <div>
                            <h4 class="text-sm font-bold text-pucho-purple uppercase tracking-widest mb-4">Personal Information</h4>
                            <div class="grid grid-cols-2 gap-4">
                                <div><label class="label-sm">First Name</label><input type="text" class="input-field" required placeholder="e.g. Arjun"></div>
                                <div><label class="label-sm">Last Name</label><input type="text" class="input-field" required placeholder="e.g. Das"></div>
                                <div><label class="label-sm">Date of Birth</label><input type="date" class="input-field" required></div>
                                <div><label class="label-sm">Gender</label><select class="input-field"><option>Male</option><option>Female</option><option>Other</option></select></div>
                            </div>
                        </div>

                        <!-- 2. Academic Info -->
                        <div>
                            <h4 class="text-sm font-bold text-pucho-purple uppercase tracking-widest mb-4">Academic Details</h4>
                            <div class="grid grid-cols-3 gap-4">
                                <div><label class="label-sm">Class</label><select class="input-field"><option>10th</option><option>9th</option><option>8th</option><option>...</option></select></div>
                                <div><label class="label-sm">Division</label><select class="input-field"><option>A</option><option>B</option><option>C</option></select></div>
                                <div><label class="label-sm">Roll No</label><input type="text" class="input-field" placeholder="001"></div>
                            </div>
                        </div>

                        <!-- 3. Guardian Info -->
                        <div>
                            <h4 class="text-sm font-bold text-pucho-purple uppercase tracking-widest mb-4">Guardian Details</h4>
                            <div class="grid grid-cols-2 gap-4">
                                <div><label class="label-sm">Father's Name</label><input type="text" class="input-field" required></div>
                                <div><label class="label-sm">Mother's Name</label><input type="text" class="input-field" required></div>
                                <div class="col-span-2"><label class="label-sm">Contact Number</label><input type="tel" class="input-field" required placeholder="+91 98765 43210"></div>
                            </div>
                        </div>

                        <div class="pt-6 border-t border-gray-50 flex justify-end gap-4">
                            <button type="button" onclick="document.getElementById('studentModal').classList.add('hidden')" class="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50">Cancel</button>
                            <button type="button" onclick="alert('Demo: Student Added!'); document.getElementById('studentModal').classList.add('hidden')" class="btn-primary px-8 py-3 rounded-2xl">Save Student</button>
                        </div>
                    </form>
                </div>
            </div>`;
        },

        staff: function () {
            // Empty State
            if (schoolDB.staff.length === 0) {
                return `<div class="bg-white rounded-[40px] p-12 border border-gray-100 shadow-subtle animate-fade-in text-center">
                    <div class="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-6xl">👩‍🏫</div>
                    <h3 class="text-2xl font-bold text-pucho-dark mb-2">No Staff Members</h3>
                    <p class="text-gray-400 mb-8 max-w-md mx-auto">Build your team by adding faculty and administrative staff.</p>
                    <button onclick="dashboard.showAddStaffModal()" class="btn-primary px-8 py-3 rounded-2xl shadow-glow hover:scale-105 transition-transform">+ ADD STAFF</button>
                    ${this.renderStaffModal()}
                </div>`;
            }

            // Initial load rows
            setTimeout(() => dashboard.filterStaff(), 0);

            return `<div class="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-subtle animate-fade-in">
                <div class="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h3 class="font-bold text-2xl">Staff Directory</h3>
                         <p class="text-gray-400 text-sm">Total Strength: ${schoolDB.staff.length}</p>
                    </div>
                    <div class="flex gap-4 items-center">
                         <select id="filterClass" onchange="dashboard.filterStaff()" class="px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 outline-none focus:border-pucho-purple">
                            <option value="">All Classes</option><option value="LKG">LKG</option><option value="UKG">UKG</option><option value="1st">1st</option><option value="2nd">2nd</option><option value="3rd">3rd</option><option value="4th">4th</option><option value="5th">5th</option><option value="6th">6th</option><option value="7th">7th</option><option value="8th">8th</option><option value="9th">9th</option><option value="10th">10th</option><option value="11th">11th</option><option value="12th">12th</option>
                        </select>
                        <select id="filterDivision" onchange="dashboard.filterStaff()" class="px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 outline-none focus:border-pucho-purple">
                            <option value="">All Div</option><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                        </select>
                        <button class="btn-primary" onclick="dashboard.showAddStaffModal()">+ ADD STAFF</button>
                    </div>
                </div>
                <table class="w-full text-left font-inter">
                    <thead class="bg-gray-50/50">
                        <tr>
                            <th class="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Faculty Details</th>
                            <th class="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Designation</th>
                            <th class="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Qualifications</th>
                            <th class="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact</th>
                            <th class="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="staffTableBody"></tbody>
                </table>
                ${this.renderStaffModal()}
            </div>`;
        },

        renderStaffModal: function () {
            return `<div id="staffModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-pucho-dark/40 backdrop-blur-sm hidden animate-fade-in">
                <div class="bg-white p-8 w-full max-w-2xl rounded-[32px] border border-white/30 shadow-2xl relative animate-slide-up max-h-[90vh] overflow-y-auto">
                    <button onclick="document.getElementById('staffModal').classList.add('hidden')" class="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full">✕</button>
                    <div class="mb-8 border-b border-gray-50 pb-4">
                        <h1 class="text-3xl font-bold text-pucho-dark mb-1">Onboard New Staff</h1>
                        <p class="text-gray-500 font-inter">Faculty & Admin Roles</p>
                    </div>
                    <form id="staffForm" class="space-y-6 font-inter">
                        <div class="grid grid-cols-2 gap-6">
                            <div><label class="label-sm">Full Name</label><input type="text" class="input-field" required placeholder="Dr. S. K. Sharma"></div>
                            <div><label class="label-sm">Employee ID</label><input type="text" class="input-field" required placeholder="EMP001"></div>
                            
                            <div><label class="label-sm">Role</label><select class="input-field"><option>Teacher</option><option>Admin</option><option>Support</option></select></div>
                            <div><label class="label-sm">Department</label><select class="input-field"><option>Science</option><option>Maths</option><option>Languages</option><option>Sports</option></select></div>

                            <div><label class="label-sm">Qualification</label><input type="text" class="input-field" placeholder="M.Sc, B.Ed"></div>
                            <div><label class="label-sm">Experience (Yrs)</label><input type="number" class="input-field" placeholder="5"></div>

                            <div><label class="label-sm">Email</label><input type="email" class="input-field" placeholder="staff@school.com"></div>
                            <div><label class="label-sm">Phone</label><input type="tel" class="input-field" placeholder="+91..."></div>
                        </div>
                        <div class="pt-6 border-t border-gray-50 flex justify-end gap-4">
                            <button type="button" onclick="document.getElementById('staffModal').classList.add('hidden')" class="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50">Cancel</button>
                            <button type="button" onclick="alert('Demo: Staff Added!'); document.getElementById('staffModal').classList.add('hidden')" class="btn-primary px-8 py-3 rounded-2xl">Onboard Staff</button>
                        </div>
                    </form>
                </div>
            </div>`;
        },

        fees: function () {
            setTimeout(() => dashboard.filterGeneric('fees'), 0);
            return `<div class="space-y-8 animate-fade-in">
                <!-- Finance Stats -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="p-8 bg-white border border-gray-100 rounded-[32px] shadow-sm hover:shadow-glow transition-all">
                        <h4 class="text-gray-500 text-sm font-medium mb-1">M-o-M Collection</h4>
                        <p class="text-3xl font-bold text-pucho-dark tracking-tight">₹4.2L <span class="text-xs text-green-500 font-bold ml-2">↑ 12%</span></p>
                    </div>
                    <div class="p-8 bg-white border border-gray-100 rounded-[32px] shadow-sm hover:shadow-glow transition-all">
                        <h4 class="text-gray-500 text-sm font-medium mb-1">Total Outstanding</h4>
                        <p class="text-3xl font-bold text-red-500 tracking-tight">₹1.8L</p>
                    </div>
                    <div class="p-8 bg-indigo-50 border border-indigo-100 rounded-[32px] shadow-sm hover:shadow-glow transition-all group">
                        <h4 class="text-indigo-600 text-sm font-medium mb-1">Recovery Flow Active</h4>
                        <p class="text-3xl font-bold text-indigo-700 tracking-tight">85% <span class="text-xs text-indigo-400 font-bold ml-2">Progressive</span></p>
                    </div>
                </div>

                <div class="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-subtle">
                    <div class="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div class="flex flex-col md:flex-row items-center gap-4">
                            <div class="flex gap-2">
                                <select id="filterClass_fees" onchange="dashboard.filterGeneric('fees')" class="px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 outline-none hover:border-pucho-purple transition-all">
                                    <option value="">All Classes</option>
                                    <option value="9th">9th</option>
                                    <option value="10th">10th</option>
                                </select>
                                <select id="filterDivision_fees" onchange="dashboard.filterGeneric('fees')" class="px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 outline-none hover:border-pucho-purple transition-all">
                                    <option value="">All Div</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                </select>
                            </div>
                            <button onclick="dashboard.runRecoveryFlow()" class="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-xs font-bold shadow-glow hover:bg-pucho-purple transition-all">RECOVERY FLOW</button>
                        </div>
                    </div>
                <table class="w-full text-left font-inter">
                     <thead class="bg-gray-50/50">
                        <tr>
                            <th class="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student ID</th>
                            <th class="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                            <th class="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                        </tr>
                    </thead>
                    <tbody id="feesTableBody"></tbody>
                </table>
            </div>`;
        },

        exams: function () {
            setTimeout(() => dashboard.filterGeneric('exams'), 0);
            return `<div class="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-subtle animate-fade-in">
                <div class="p-8 border-b border-gray-50 flex justify-between items-center">
                    <h3 class="font-bold text-2xl">Exam Schedule</h3>
                     <div class="flex gap-4">
                        <select id="filterClass_exams" onchange="dashboard.filterGeneric('exams')" class="px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 outline-none">
                            <option value="">All Classes</option>
                            <option value="LKG">LKG</option>
                            <option value="UKG">UKG</option>
                            <option value="1st">1st</option>
                            <option value="2nd">2nd</option>
                            <option value="3rd">3rd</option>
                            <option value="4th">4th</option>
                            <option value="5th">5th</option>
                            <option value="6th">6th</option>
                            <option value="7th">7th</option>
                            <option value="8th">8th</option>
                            <option value="9th">9th</option>
                            <option value="10th">10th</option>
                            <option value="11th">11th</option>
                            <option value="12th">12th</option>
                        </select>
                    </div>
                </div>
                <table class="w-full text-left font-inter">
                     <thead class="bg-gray-50/50">
                        <tr>
                            <th class="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subject</th>
                            <th class="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Class</th>
                            <th class="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                        </tr>
                    </thead>
                    <tbody id="examsTableBody"></tbody>
                </table>
            </div>`;
        },

        attendance_all: function () {
            return `<div class="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-subtle animate-fade-in mb-8">
                <div class="p-8 border-b border-gray-50 flex justify-between items-center">
                    <h3 class="font-bold text-2xl">Global Attendance</h3>
                    <div class="flex gap-4">
                        <select class="px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 outline-none">
                            <option value="">Overall</option>
                            <option value="LKG">LKG</option>
                            <option value="UKG">UKG</option>
                            <option value="1st">1st</option>
                            <option value="2nd">2nd</option>
                            <option value="3rd">3rd</option>
                            <option value="4th">4th</option>
                            <option value="5th">5th</option>
                            <option value="6th">6th</option>
                            <option value="7th">7th</option>
                            <option value="8th">8th</option>
                            <option value="9th">9th</option>
                            <option value="10th">10th</option>
                            <option value="11th">11th</option>
                            <option value="12th">12th</option>
                        </select>
                        <select class="px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 outline-none">
                            <option value="">All Div</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                        </select>
                    </div>
                </div>
                <div class="p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div class="bg-green-50/50 p-12 rounded-[32px] text-center relative overflow-hidden group hover:bg-green-50 transition-all">
                         <div class="absolute top-0 right-0 p-8 opacity-10 text-6xl group-hover:scale-110 transition-transform">👨‍🎓</div>
                        <h4 class="text-6xl font-bold text-green-600 mb-2 tracking-tighter">94.2%</h4>
                        <p class="text-green-800/60 text-xs font-bold tracking-widest uppercase">Student Attendance</p>
                    </div>
                    <div class="bg-blue-50/50 p-12 rounded-[32px] text-center relative overflow-hidden group hover:bg-blue-50 transition-all">
                        <div class="absolute top-0 right-0 p-8 opacity-10 text-6xl group-hover:scale-110 transition-transform">👩‍🏫</div>
                        <h4 class="text-6xl font-bold text-blue-600 mb-2 tracking-tighter">98.5%</h4>
                        <p class="text-blue-800/60 text-xs font-bold tracking-widest uppercase">Staff Attendance</p>
                    </div>
                </div>
            </div>`;
        },

        communication: function () {
            let notices = schoolDB.notices.map(n => `
                <div class="bg-white p-6 rounded-[32px] border border-gray-100 shadow-subtle flex flex-col gap-4 animate-fade-in hover:shadow-glow transition-all group">
                    <div class="flex justify-between items-start">
                        <div>
                            <span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-[10px] font-bold uppercase tracking-widest">${n.target}</span>
                            <h4 class="text-xl font-bold text-pucho-dark mt-2 group-hover:text-pucho-purple transition-colors">${n.title}</h4>
                            <p class="text-gray-400 text-xs font-bold mt-1">${n.date}</p>
                        </div>
                        <button class="p-2 hover:bg-gray-100 rounded-full"><svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
                    </div>
                    <p class="text-gray-600 text-sm leading-relaxed">${n.content}</p>
                    <div class="pt-4 border-t border-gray-50 flex justify-between items-center">
                        <span class="text-xs font-bold text-gray-400">By Admin</span>
                        <button class="text-pucho-purple text-xs font-bold hover:underline">Read More</button>
                    </div>
                </div>
            `).join('');

            return `<div class="space-y-8 animate-fade-in">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="font-bold text-2xl text-pucho-dark">Broadcast Room</h3>
                        <p class="text-gray-400">Send circulars and notifications</p>
                    </div>
                    <button onclick="dashboard.showBroadcastModal()" class="bg-pucho-dark text-white px-8 py-3 rounded-2xl font-bold hover:shadow-glow hover:bg-pucho-purple transition-all">+ NEW POST</button>
                </div>
                
                <div class="bg-white p-2 rounded-[24px] inline-flex mb-4 border border-gray-100">
                     <button class="px-6 py-2 bg-pucho-purple text-white rounded-[18px] text-xs font-bold uppercase tracking-widest shadow-lg shadow-pucho-purple/20">All</button>
                     <button class="px-6 py-2 text-gray-400 hover:text-pucho-dark rounded-[18px] text-xs font-bold uppercase tracking-widest">Parents</button>
                     <button class="px-6 py-2 text-gray-400 hover:text-pucho-dark rounded-[18px] text-xs font-bold uppercase tracking-widest">Staff</button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    ${notices}
                </div>
            </div>`;
        },

        reports: function () {
            // Calculate Analytics
            const totalFees = schoolDB.fees.reduce((acc, curr) => acc + curr.amount, 0);
            const collectedFees = schoolDB.fees.filter(f => f.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);
            const pendingFees = totalFees - collectedFees;
            const collectionPercentage = Math.round((collectedFees / totalFees) * 100);

            return `<div class="space-y-8 animate-fade-in font-inter">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="font-bold text-2xl text-pucho-dark">System Analytics</h3>
                        <p class="text-gray-400">Comprehensive performance reports</p>
                    </div>
                     <div class="flex gap-4">
                        <button class="px-6 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-all">Download CSV</button>
                        <button class="px-6 py-3 bg-pucho-dark text-white rounded-2xl font-bold text-sm hover:shadow-glow hover:bg-pucho-purple transition-all">Print Report</button>
                    </div>
                </div>

                <!-- Financial Health -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div class="lg:col-span-2 bg-white p-8 rounded-[40px] border border-gray-100 shadow-subtle">
                        <h4 class="font-bold text-lg mb-6">Financial Overview</h4>
                        <div class="relative h-48 bg-gray-50 rounded-3xl overflow-hidden flex items-center px-8">
                            <div class="w-full h-8 bg-gray-200 rounded-full overflow-hidden relative">
                                <div class="absolute top-0 left-0 h-full bg-green-500 transition-all duration-1000" style="width: ${collectionPercentage}%"></div>
                            </div>
                            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                <p class="text-3xl font-bold text-pucho-dark">${collectionPercentage}%</p>
                                <p class="text-xs font-bold text-gray-400 uppercase">Collection Rate</p>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-8 mt-8">
                            <div>
                                <p class="text-gray-400 text-xs font-bold uppercase">Collected</p>
                                <p class="text-2xl font-bold text-green-600">₹${collectedFees.toLocaleString()}</p>
                            </div>
                            <div>
                                <p class="text-gray-400 text-xs font-bold uppercase">Pending</p>
                                <p class="text-2xl font-bold text-red-500">₹${pendingFees.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Attendance Stats -->
                    <div class="bg-pucho-purple text-white p-10 rounded-[40px] shadow-glow flex flex-col justify-between">
                        <div>
                            <h4 class="font-bold text-xl opacity-80 mb-2">Attendance Alert</h4>
                            <p class="text-sm opacity-60">Students with low attendance</p>
                        </div>
                        <div class="text-5xl font-bold tracking-tighter my-6">12</div>
                        <button class="bg-white/20 hover:bg-white/30 p-4 rounded-2xl font-bold text-sm transition-all text-center backdrop-blur-sm">View Defaulters List</button>
                    </div>
                </div>

                <!-- Academic Performance -->
                <div class="bg-white p-8 rounded-[40px] border border-gray-100 shadow-subtle">
                     <h4 class="font-bold text-lg mb-6">Class-wise Performance (Avg GPA)</h4>
                     <div class="flex items-end gap-4 h-64 pb-8 border-b border-gray-50 overflow-x-auto">
                        ${['10th', '9th', '8th', '7th', '6th'].map(cls => {
                const height = Math.floor(Math.random() * (95 - 60) + 60);
                return `<div class="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                                <div class="w-full bg-gray-100 rounded-t-2xl relative group-hover:bg-pucho-purple/10 transition-colors h-full flex items-end">
                                    <div class="w-full bg-pucho-dark rounded-t-2xl transition-all duration-500 group-hover:bg-pucho-purple relative" style="height: ${height}%">
                                        <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">${height}%</div>
                                    </div>
                                </div>
                                <span class="text-xs font-bold text-gray-400">${cls}</span>
                            </div>`;
            }).join('')}
                     </div>
                </div>
            </div>`;
        },


        // --- STUDENT DASHBOARD TEMPLATES ---
        student_profile: function () { return this.student_overview(); }, // Alias for My Child (Parent) / Student Profile

        student_overview: function () {
            return `<div class="grid grid-cols-1 md:grid-cols-3 gap-8 p-2 animate-fade-in">
                <!-- Profile Card -->
                <div class="bg-white rounded-[40px] p-8 border border-gray-100 shadow-subtle text-center">
                    <div class="w-32 h-32 bg-pucho-purple/10 rounded-full mx-auto flex items-center justify-center text-4xl mb-4">👨‍🎓</div>
                    <h2 class="text-2xl font-bold text-pucho-dark">Arjun Das</h2>
                    <p class="text-gray-500 font-medium mb-6">Class 10th-A | Roll No: 24</p>
                    <div class="flex justify-center gap-4 text-sm font-bold">
                        <div class="bg-green-50 text-green-700 px-4 py-2 rounded-xl">Attendance: 92%</div>
                        <div class="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl">GPA: 8.8</div>
                    </div>
                </div>

                <!-- Notices -->
                <div class="md:col-span-2 bg-pucho-dark text-white rounded-[40px] p-8 shadow-glow relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-64 h-64 bg-pucho-purple rounded-full blur-[80px] opacity-20"></div>
                    <h3 class="text-xl font-bold mb-6 opacity-90">📢 Latest Notices</h3>
                    <div class="space-y-4 relative z-10">
                        <div class="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                            <h4 class="font-bold text-sm">Science Fair Registration</h4>
                            <p class="text-xs opacity-70 mt-1">School closed from 25th Dec to 2nd Jan.</p>
                        </div>
                    </div>
                </div>

                <!-- Quick Stats -->
                <div class="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <p class="text-xs font-bold text-gray-400 uppercase">Next Exam</p>
                        <p class="text-lg font-bold text-pucho-dark mt-1">Mathematics</p>
                        <p class="text-xs text-red-500 font-bold">In 3 Days</p>
                    </div>
                     <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <p class="text-xs font-bold text-gray-400 uppercase">Fees Due</p>
                        <p class="text-lg font-bold text-pucho-dark mt-1">₹0</p>
                        <p class="text-xs text-green-500 font-bold">Paid</p>
                    </div>
                </div>
            </div>`;
        },

        settings: function () {
            const role = auth.currentUser.role;
            const isParent = role === 'parent';
            const isStaff = role === 'staff';

            // Common Settings (Password)
            let content = `<div class="bg-white rounded-[40px] p-8 border border-gray-100 shadow-subtle animate-fade-in font-inter mb-8">
                <h3 class="font-bold text-2xl mb-6">Security Settings</h3>
                <div class="flex flex-col md:flex-row gap-6 items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <div>
                        <h4 class="font-bold text-lg">Change Password</h4>
                        <p class="text-sm text-gray-400">Update your account password regularly</p>
                    </div>
                    <button onclick="dashboard.showChangePasswordModal()" class="bg-white border border-gray-200 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all">Update Password</button>
                </div>
            </div>`;

            // Admin Specific (System Controls)
            if (role === 'admin') {
                content += `<div class="bg-white rounded-[40px] p-8 border border-gray-100 shadow-subtle animate-fade-in font-inter">
                    <h3 class="font-bold text-2xl mb-6">System Controls</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="p-6 bg-red-50 rounded-3xl border border-red-100">
                            <h4 class="font-bold text-red-700 text-lg mb-2">Reset Academic Year</h4>
                             <p class="text-xs text-red-400 mb-6 font-bold">WARNING: Archives all current data</p>
                            <button onclick="showToast('Initiating System Reset Protocol...', 'error')" class="bg-red-600 text-white px-6 py-3 rounded-xl font-bold w-full hover:bg-red-700">RESET SYSTEM</button>
                        </div>
                        <div class="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                            <h4 class="font-bold text-blue-700 text-lg mb-2">Promote Students</h4>
                             <p class="text-xs text-blue-400 mb-6 font-bold">Move all students to next grade</p>
                            <button onclick="showToast('Promotion Wizard Started!', 'info')" class="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold w-full hover:bg-blue-700">START PROMOTION</button>
                        </div>
                    </div>
                </div>`;
            }

            // Parent Specific (Notifications)
            if (isParent) {
                content += `<div class="bg-white rounded-[40px] p-8 border border-gray-100 shadow-subtle animate-fade-in font-inter">
                     <h3 class="font-bold text-2xl mb-6">Notification Preferences</h3>
                      <div class="space-y-4">
                        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                            <span class="font-bold text-gray-600">SMS Alerts (Fee Due)</span>
                            <input type="checkbox" checked class="w-6 h-6 accent-pucho-purple cursor-pointer">
                        </div>
                        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                            <span class="font-bold text-gray-600">Email Updates (Results)</span>
                            <input type="checkbox" checked class="w-6 h-6 accent-pucho-purple cursor-pointer">
                        </div>
                         <div class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                            <span class="font-bold text-gray-600">WhatsApp Circulars</span>
                            <input type="checkbox" class="w-6 h-6 accent-pucho-purple cursor-pointer">
                        </div>
                      </div>
                      <div class="flex justify-end mt-6">
                         <button onclick="showToast('Preferences Saved!', 'success')" class="bg-pucho-dark text-white px-8 py-3 rounded-xl font-bold hover:bg-pucho-purple transition-all">SAVE CHANGES</button>
                      </div>
                </div>`;
            }

            return content;
        },

        safety_monitor: function () {
            return `
                <div class="space-y-8 animate-fade-in">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="p-8 bg-white border border-gray-100 rounded-[32px] shadow-sm hover:shadow-glow transition-all">
                            <h4 class="text-gray-500 text-sm font-medium mb-1">Active Buses</h4>
                            <p class="text-3xl font-bold text-pucho-dark tracking-tight">12 <span class="text-xs text-green-500 uppercase tracking-widest font-bold ml-2">● On Route</span></p>
                        </div>
                        <div class="p-8 bg-white border border-gray-100 rounded-[32px] shadow-sm hover:shadow-glow transition-all">
                            <h4 class="text-gray-500 text-sm font-medium mb-1">Student Check-ins</h4>
                            <p class="text-3xl font-bold text-pucho-dark tracking-tight">1,492 / 1,500</p>
                        </div>
                        <div class="p-8 bg-red-50 border border-red-100 rounded-[32px] shadow-sm hover:shadow-glow transition-all">
                            <h4 class="text-red-500 text-sm font-medium mb-1">Mismatch Alerts</h4>
                            <p class="text-3xl font-bold text-red-600 tracking-tight">2 Critical</p>
                        </div>
                    </div>

                    <div class="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-subtle">
                        <div class="p-8 border-b border-gray-50 flex justify-between items-center">
                            <div>
                                <h3 class="font-bold text-2xl">Real-time Safety Logs</h3>
                                <p class="text-xs text-gray-400 mt-1 font-inter">Last Sync: Just Now</p>
                            </div>
                            <span class="px-4 py-2 bg-green-100 text-green-700 rounded-full text-xs font-bold animate-pulse">LIVE TRACKING</span>
                        </div>
                        <div class="divide-y divide-gray-50">
                            <div class="p-6 flex items-center justify-between hover:bg-red-50 transition-colors group">
                                <div class="flex items-center gap-4">
                                    <div class="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">⚠️</div>
                                    <div>
                                        <h4 class="font-bold text-pucho-dark">Arjun Das (10A)</h4>
                                        <p class="text-xs text-gray-400">Bus Scan: 08:15 AM | Class Scan: <span class="text-red-600 font-bold uppercase tracking-widest">MISSING</span></p>
                                    </div>
                                </div>
                                <div class="flex gap-2">
                                    <button class="px-5 py-2.5 bg-pucho-dark text-white rounded-xl text-xs font-bold shadow-lg hover:bg-pucho-purple transition-all" onclick="dashboard.initProtocol('Arjun Das')">LOG PROTOCOL</button>
                                    <button class="px-5 py-2.5 border-2 border-red-200 text-red-600 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition-all" onclick="showToast('Panic Alert sent to Local Security & Principal', 'error')">EMERGENCY</button>
                                </div>
                            </div>
                            <div class="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                                <div class="flex items-center gap-4">
                                    <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">🚌</div>
                                    <div>
                                        <h4 class="font-bold text-pucho-dark">Route #4 (South Campus)</h4>
                                        <p class="text-xs text-gray-400 font-inter">GPS: Near Central Mall | Status: <span class="text-green-600 font-bold font-sans">On Schedule</span></p>
                                    </div>
                                </div>
                                <button class="text-pucho-purple text-xs font-bold hover:underline underline-offset-4 decoration-2">TRACK BUS</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        ai_insights: function () {
            return `
                <div class="space-y-8 animate-fade-in">
                    <div class="bg-gradient-to-r from-pucho-purple to-indigo-600 p-8 rounded-[40px] text-white shadow-glow relative overflow-hidden mb-8">
                        <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
                        <div class="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div class="max-w-xl">
                                <h3 class="text-3xl font-bold mb-2">Predictive Academic Analysis</h3>
                                <p class="text-white/70">AI has analyzed 450+ data points across attendance, test scores, and behavior modules.</p>
                            </div>
                            <div class="flex gap-4">
                                <div class="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10 text-center min-w-[120px]">
                                    <p class="text-2xl font-bold">84%</p>
                                    <p class="text-[10px] uppercase font-bold opacity-60">Avg Stability</p>
                                </div>
                                <div class="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10 text-center min-w-[120px]">
                                    <p class="text-2xl font-bold text-orange-300">12</p>
                                    <p class="text-[10px] uppercase font-bold opacity-60">High Risk</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <!-- Risk List -->
                        <div class="bg-white rounded-[40px] p-8 border border-gray-100 shadow-subtle">
                            <h3 class="font-bold text-xl mb-6 flex items-center gap-2">⚠️ Performance Drop Alerts</h3>
                            <div class="space-y-6">
                                <div class="p-6 bg-orange-50 rounded-3xl border border-orange-100 hover:scale-[1.02] transition-transform cursor-pointer">
                                    <div class="flex justify-between items-start mb-4">
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-orange-600">AS</div>
                                            <div>
                                                <p class="font-bold text-pucho-dark">Aarav Gupta</p>
                                                <p class="text-[10px] text-gray-400 font-bold uppercase">Grade 10-A</p>
                                            </div>
                                        </div>
                                        <span class="px-3 py-1 bg-red-100 text-red-600 rounded-full text-[10px] font-bold">-22% Drop</span>
                                    </div>
                                    <p class="text-sm text-gray-600 mb-4">Significant decline in <span class="font-bold">Mathematics</span> and <span class="font-bold">Physics</span> over the last 2 unit tests.</p>
                                    <div class="flex gap-2">
                                        <button class="flex-1 py-2 bg-pucho-dark text-white rounded-xl text-xs font-bold" onclick="showToast('Academic Support Kit emailed to parents.', 'success')">SEND SUPPORT KIT</button>
                                        <button class="py-2 px-4 border border-gray-200 rounded-xl text-xs font-bold">IGNORE</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Retention Insights -->
                        <div class="bg-white rounded-[40px] p-8 border border-gray-100 shadow-subtle">
                             <h3 class="font-bold text-xl mb-6">💡 Growth Suggestions</h3>
                             <div class="space-y-4">
                                <div class="flex items-start gap-4 p-4 border-b border-gray-50">
                                    <div class="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">📈</div>
                                    <div>
                                        <p class="font-bold text-sm">Group Study Potential</p>
                                        <p class="text-xs text-gray-400 mt-1">Section 9-B shows high disparity. Recommend peer-mentoring between Top 5 and Bottom 5 performers.</p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-4 p-4">
                                    <div class="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">🔬</div>
                                    <div>
                                        <p class="font-bold text-sm">Lab Engagement</p>
                                        <p class="text-xs text-gray-400 mt-1">Attendance in Labs is 15% lower than theory classes. Consider gamifying practical assessments.</p>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            `;
        },

        manage_profile: function () {
            const user = auth.currentUser;
            const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

            return `<div class="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-subtle animate-fade-in font-inter relative">
                <div class="h-48 bg-gradient-to-r from-pucho-purple to-indigo-600 relative">
                     <div class="absolute -bottom-16 left-10 p-2 bg-white rounded-full">
                        <div class="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center text-4xl font-bold text-gray-400 border-4 border-white shadow-lg">
                            ${initials}
                        </div>
                     </div>
                </div>
                <div class="pt-20 px-10 pb-10">
                    <div class="flex justify-between items-start mb-8">
                        <div>
                             <h1 class="text-4xl font-bold text-pucho-dark mb-2">${user.name}</h1>
                             <span class="px-4 py-2 bg-pucho-purple/10 text-pucho-purple rounded-xl text-sm font-bold uppercase tracking-widest">${user.role}</span>
                        </div>
                        <button class="border border-gray-200 px-6 py-2 rounded-xl font-bold hover:bg-gray-50 transition-all text-sm">Edit Profile</button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                            <h4 class="text-gray-400 font-bold text-xs uppercase tracking-widest mb-4">Contact Information</h4>
                            <div class="space-y-4">
                                <div>
                                    <p class="text-xs text-gray-400 font-bold uppercase">Email Address</p>
                                    <p class="font-bold text-lg text-gray-800">${user.email}</p>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-400 font-bold uppercase">User ID</p>
                                    <p class="font-bold text-lg text-gray-800">USR-${Math.floor(Math.random() * 10000)}</p>
                                </div>
                            </div>
                        </div>
                         <div class="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                            <h4 class="text-gray-400 font-bold text-xs uppercase tracking-widest mb-4">Account Status</h4>
                            <div class="flex items-center gap-3 mb-4">
                                <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span class="font-bold text-green-600">Active</span>
                            </div>
                            <p class="text-sm text-gray-500">Last login: ${new Date().toLocaleString()}</p>
                        </div>
                    </div>
                </div>
             </div>`;
        },

        student_profile: function () {
            // Get student data
            const student = schoolDB.students.find(s => s.guardian === auth.currentUser.name) || schoolDB.students[0];

            // Re-use Graph Helper (Define locally as simple string builder for this scope or duplication for simplicity in single-file)
            const createBarGraph = (title, labels, values, color = 'bg-pucho-purple') => {
                const max = Math.max(...values);
                const bars = values.map((v, i) => `
                    <div class="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                        <div class="w-full bg-gray-50 rounded-t-xl relative h-full flex items-end">
                            <div class="w-full ${color} rounded-t-xl transition-all duration-1000 relative group-hover:opacity-80" style="height: ${(v / max) * 100}%">
                                <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">${v}%</div>
                            </div>
                        </div>
                        <span class="text-[10px] font-bold text-gray-400 uppercase">${labels[i]}</span>
                    </div>
                `).join('');
                return `<div class="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm h-full">
                    <h4 class="font-bold text-gray-500 text-xs uppercase tracking-widest mb-4">${title}</h4>
                    <div class="h-40 flex items-end gap-3">${bars}</div>
                </div>`;
            };

            const attendanceData = [95, 80, 100, 90, 85, 92];
            const marksData = [78, 85, 92, 68, 88];

            return `<div class="animate-fade-in space-y-8">
                <!-- ID Card Section -->
                <div class="bg-white rounded-[40px] p-8 md:p-12 border border-gray-100 shadow-subtle relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-64 h-64 bg-pucho-purple/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    
                    <div class="flex flex-col md:flex-row gap-10 items-center relative z-10">
                        <div class="flex-none text-center">
                            <div class="w-40 h-40 bg-gray-100 rounded-full border-4 border-white shadow-xl mx-auto mb-4 flex items-center justify-center text-6xl">
                                👨‍🎓
                            </div>
                            <span class="bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Active Student</span>
                        </div>
                        
                        <div class="flex-1 text-center md:text-left">
                            <h2 class="text-4xl font-bold text-pucho-dark mb-2">${student.name}</h2>
                            <p class="text-xl text-gray-400 font-light mb-6">Class ${student.class} - Division ${student.division}</p>
                            
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                    <p class="text-xs font-bold text-gray-400 uppercase mb-1">Roll Number</p>
                                    <p class="font-bold text-lg text-pucho-dark">#${student.roll}</p>
                                </div>
                                <div>
                                    <p class="text-xs font-bold text-gray-400 uppercase mb-1">Blood Group</p>
                                    <p class="font-bold text-lg text-pucho-dark">O+</p>
                                </div>
                                <div>
                                    <p class="text-xs font-bold text-gray-400 uppercase mb-1">Date of Birth</p>
                                    <p class="font-bold text-lg text-pucho-dark">12 Aug 2008</p>
                                </div>
                                <div>
                                    <p class="text-xs font-bold text-gray-400 uppercase mb-1">House</p>
                                    <p class="font-bold text-lg text-red-500">Ruby (Red)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Deep Dive Analytics -->
                <h3 class="text-2xl font-bold ml-2">Performance Analytics</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    ${createBarGraph('Attendance Trends (6 Months)', ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'], attendanceData, 'bg-pucho-purple')}
                    ${createBarGraph('Academic Consistency', ['Maths', 'Sci', 'Eng', 'Hist', 'Comp'], marksData, 'bg-blue-500')}
                </div>
                
                <!-- Teacher Remarks -->
                 <div class="bg-gray-50 rounded-[40px] p-8 border border-gray-100">
                    <h3 class="font-bold text-xl mb-6">Teacher Remarks</h3>
                    <div class="space-y-4">
                        <div class="bg-white p-6 rounded-3xl border border-gray-100 flex gap-4">
                            <div class="text-2xl">🌟</div>
                            <div>
                                <p class="text-sm font-bold text-pucho-dark">Class Teacher</p>
                                <p class="text-sm text-gray-500 mt-1">"Arjun is showing great improvement in Science. Needs to focus a bit more on History dates. Overall excellent conduct."</p>
                                <p class="text-[10px] font-bold text-gray-400 mt-2">12th Dec 2023</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        },

        parent_attendance: function () { return this.my_attendance(); }, // Alias for Parent
        my_attendance: function () {
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const currentMonthIndex = new Date().getMonth();

            // Generate Grid Logic
            const generateGrid = (monthIndex) => {
                const daysInMonth = new Date(2024, monthIndex + 1, 0).getDate(); // Mock Year 2024
                let gridHtml = '';
                let present = 0;
                let absent = 0;

                for (let i = 1; i <= daysInMonth; i++) {
                    // Deterministic "random" based on day index to keep it consistent per month for demo
                    const isAbsent = (i + monthIndex) % 7 === 0;
                    if (isAbsent) absent++; else present++;

                    const statusClass = isAbsent ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700';
                    gridHtml += `<div class="${statusClass} aspect-square rounded-xl flex items-center justify-center font-bold text-sm animate-fade-in" style="animation-delay: ${i * 10}ms">${i}</div>`;
                }
                return { html: gridHtml, p: present, a: absent };
            };

            const initialData = generateGrid(currentMonthIndex);

            setTimeout(() => {
                // Attach global handler if not exists
                dashboard.updateAttendance = function (select) {
                    const monthIdx = parseInt(select.value);
                    const data = generateGrid(monthIdx);
                    document.getElementById('attGrid').innerHTML = data.html;
                    document.getElementById('attStats').innerHTML = `
                        <span class="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-lg"><span class="w-2 h-2 rounded-full bg-green-500"></span> Present (${data.p})</span>
                        <span class="flex items-center gap-2 bg-red-50 px-3 py-1 rounded-lg"><span class="w-2 h-2 rounded-full bg-red-500"></span> Absent (${data.a})</span>
                    `;
                }
            }, 100);

            return `<div class="bg-white rounded-[40px] p-8 border border-gray-100 shadow-subtle animate-fade-in text-center font-inter">
                <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h3 class="font-bold text-2xl text-pucho-dark">Attendance Record</h3>
                        <p class="text-gray-400 text-sm">Track daily presence</p>
                    </div>
                    <div class="relative">
                         <select onchange="dashboard.updateAttendance(this)" class="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-6 py-2 font-bold text-sm outline-none text-pucho-dark pr-10 hover:border-pucho-purple transition-colors cursor-pointer min-w-[150px]">
                            ${months.map((m, i) => `<option value="${i}" ${i === currentMonthIndex ? 'selected' : ''}>${m} 2024</option>`).join('')}
                        </select>
                        <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                    </div>
                </div>

                <div id="attGrid" class="grid grid-cols-7 gap-3 max-w-md mx-auto mb-8">
                     ${initialData.html}
                </div>
                
                <div id="attStats" class="flex justify-center gap-6 text-sm font-bold text-gray-500">
                    <span class="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-lg"><span class="w-2 h-2 rounded-full bg-green-500"></span> Present (${initialData.p})</span>
                    <span class="flex items-center gap-2 bg-red-50 px-3 py-1 rounded-lg"><span class="w-2 h-2 rounded-full bg-red-500"></span> Absent (${initialData.a})</span>
                </div>
            </div>`;
        },

        parent_fees: function () { return this.my_fees(); },
        my_fees: function () {
            return `<div class="bg-white rounded-[40px] p-10 border border-gray-100 shadow-subtle text-center animate-fade-in relative overflow-hidden">
                <div class="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-sm">✅</div>
                <h3 class="text-3xl font-bold text-pucho-dark tracking-tight mb-2">No Due Payments</h3>
                <p class="text-gray-400 mb-8 max-w-sm mx-auto">Great! You have cleared all pending invoices for the current academic session.</p>
                
                <div class="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-3xl p-8 text-left max-w-2xl mx-auto shadow-sm">
                    <div class="flex justify-between items-center mb-6">
                        <h4 class="font-bold text-sm uppercase text-gray-400 tracking-widest">Transaction History</h4>
                        <button class="text-pucho-purple text-xs font-bold hover:underline">Download Statement</button>
                    </div>
                    <div class="space-y-4">
                        <div class="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-50 hover:shadow-md transition-shadow">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 text-lg">💰</div>
                                <div>
                                    <p class="font-bold text-pucho-dark">Term 1 Tuition Fee</p>
                                    <p class="text-xs text-gray-400 font-bold">Paid on 10 Apr 2024</p>
                                </div>
                            </div>
                            <span class="font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg text-sm">₹15,000</span>
                        </div>
                         <div class="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-50 hover:shadow-md transition-shadow">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 text-lg">🚌</div>
                                <div>
                                    <p class="font-bold text-pucho-dark">Transport (Q1)</p>
                                    <p class="text-xs text-gray-400 font-bold">Paid on 05 Apr 2024</p>
                                </div>
                            </div>
                            <span class="font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg text-sm">₹4,500</span>
                        </div>
                    </div>
                </div>
            </div>`;
        },

        parent_leave: function () {
            return `<div class="bg-white rounded-[40px] p-8 border border-gray-100 shadow-subtle animate-fade-in font-inter">
                <div class="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
                    <div>
                         <h3 class="font-bold text-2xl text-pucho-dark">Leave Application</h3>
                         <p class="text-gray-400 text-sm mt-1">Submit leave requests for your child</p>
                    </div>
                    <button class="bg-pucho-dark text-white px-6 py-3 rounded-xl font-bold hover:bg-pucho-purple transition-colors shadow-lg" onclick="document.getElementById('leaveForm').classList.toggle('hidden')">+ New Request</button>
                </div>

                <div id="leaveForm" class="hidden bg-gray-50 p-6 rounded-3xl mb-8 border border-gray-100 animate-slide-up">
                    <h4 class="font-bold text-lg mb-4">Compose Application</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-xs font-bold text-gray-400 uppercase mb-1">From Date</label>
                            <input type="date" class="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-pucho-purple">
                        </div>
                         <div>
                            <label class="block text-xs font-bold text-gray-400 uppercase mb-1">To Date</label>
                            <input type="date" class="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-pucho-purple">
                        </div>
                    </div>
                    <div class="mb-4">
                         <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Reason</label>
                         <textarea class="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-pucho-purple" rows="3" placeholder="e.g. Family Function, Medical..."></textarea>
                    </div>
                    <div class="flex justify-end gap-2">
                        <button class="px-4 py-2 text-gray-500 font-bold hover:bg-gray-200 rounded-lg" onclick="document.getElementById('leaveForm').classList.add('hidden')">Cancel</button>
                        <button class="px-6 py-2 bg-pucho-purple text-white font-bold rounded-xl hover:shadow-lg" onclick="showToast('Leave Applied Successfully!', 'success'); document.getElementById('leaveForm').classList.add('hidden')">Submit</button>
                    </div>
                </div>

                <h4 class="font-bold text-xs uppercase text-gray-400 tracking-widest mb-4">Past Records</h4>
                <div class="space-y-4">
                    <div class="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl">
                        <div class="flex gap-4 items-center">
                             <div class="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-bold text-xl">✓</div>
                             <div>
                                <h5 class="font-bold text-pucho-dark">Medical Leave</h5>
                                <p class="text-xs text-gray-400 font-bold">12 Dec - 14 Dec 2023 (3 Days)</p>
                             </div>
                        </div>
                        <span class="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold uppercase">Approved</span>
                    </div>
                     <div class="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl opacity-70">
                        <div class="flex gap-4 items-center">
                             <div class="w-12 h-12 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center font-bold text-xl">✓</div>
                             <div>
                                <h5 class="font-bold text-pucho-dark">Family Function</h5>
                                <p class="text-xs text-gray-400 font-bold">10 Nov 2023 (1 Day)</p>
                             </div>
                        </div>
                        <span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold uppercase">Approved</span>
                    </div>
                </div>
            </div>`;
        },

        parent_homework: function () {
            const homeworks = [
                { subject: 'Mathematics', title: 'Quadratic Equations Exercise 4.2', due: 'Tomorrow', status: 'Pending' },
                { subject: 'Science', title: 'Draw Human Heart Diagram', due: '12 Jan', status: 'Pending' },
                { subject: 'English', title: 'Essay on Artificial Intelligence', due: '15 Jan', status: 'Submitted' }
            ];

            return `<div class="bg-white rounded-[40px] p-8 border border-gray-100 shadow-subtle animate-fade-in font-inter">
                <div class="flex justify-between items-center mb-8">
                     <h3 class="font-bold text-2xl text-pucho-dark">Homework & Assignments</h3>
                     <span class="bg-pucho-purple/10 text-pucho-purple px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest">Class 10-A</span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${homeworks.map(h => `
                        <div class="p-6 rounded-[32px] border ${h.status === 'Pending' ? 'bg-orange-50 border-orange-100' : 'bg-green-50 border-green-100'} relative overflow-hidden group">
                           <div class="flex justify-between items-start mb-4">
                                <span class="text-[10px] font-bold uppercase tracking-widest ${h.status === 'Pending' ? 'text-orange-500' : 'text-green-600'}">${h.subject}</span>
                                ${h.status === 'Pending' ? '⏳' : '✅'}
                           </div>
                           <h4 class="font-bold text-lg mb-2 text-pucho-dark leading-tight">${h.title}</h4>
                           <p class="text-xs font-bold text-gray-500 mb-6">Due: ${h.due}</p>
                           
                           <button class="w-full py-3 bg-white/50 hover:bg-white rounded-xl text-xs font-bold transition-all border border-black/5 shadow-sm">View Details</button>
                        </div>
                    `).join('')}
                </div>
            </div>`;
        },

        // --- STAFF DASHBOARD TEMPLATES ---
        my_classes: function () {
            return `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                ${['10th - A (Maths)', '9th - B (Physics)', '12th - A (Maths)'].map(cls => `
                    <div class="bg-white p-8 rounded-[40px] border border-gray-100 shadow-subtle hover:shadow-glow transition-all cursor-pointer group">
                        <div class="flex justify-between items-start mb-6">
                            <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">📚</div>
                            <span class="bg-gray-100 px-3 py-1 rounded-lg text-[10px] font-bold uppercase text-gray-500">09:00 AM</span>
                        </div>
                        <h3 class="text-xl font-bold text-pucho-dark mb-1">${cls}</h3>
                        <p class="text-gray-400 text-sm mb-6">45 Students</p>
                        <div class="flex gap-2">
                            <button onclick="dashboard.loadPage('mark_attendance')" class="flex-1 bg-pucho-dark text-white py-3 rounded-xl text-xs font-bold hover:bg-pucho-purple transition-all">Attendance</button>
                            <button onclick="dashboard.loadPage('exam_marks')" class="flex-1 bg-gray-50 text-pucho-dark py-3 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all">Marks</button>
                        </div>
                    </div>
                `).join('')}
            </div>`;
        },

        mark_attendance: function () {
            const classes = ['Nursery', 'LKG', 'UKG', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
            const divisions = ['A', 'B', 'C', 'D'];

            const classOptions = classes.map(c => `<option value="${c}">${c}</option>`).join('');
            const divOptions = divisions.map(d => `<option value="${d}">${d}</option>`).join('');

            return `<div class="bg-white rounded-[40px] p-8 border border-gray-100 shadow-subtle animate-fade-in font-inter">
                <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h3 class="font-bold text-2xl text-pucho-dark">Mark Attendance</h3>
                        <p class="text-gray-400 text-sm mt-1">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    
                    <div class="flex gap-4">
                         <div class="relative">
                            <select id="attClass" class="appearance-none bg-gray-50 border border-gray-200 rounded-2xl px-6 py-3 font-bold text-sm outline-none text-pucho-dark pr-10 hover:border-pucho-purple transition-colors cursor-pointer" onchange="dashboard.loadAttendanceStudents()">
                                <option value="">Select Class</option>
                                ${classOptions}
                            </select>
                            <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                        </div>

                        <div class="relative">
                            <select id="attDiv" class="appearance-none bg-gray-50 border border-gray-200 rounded-2xl px-6 py-3 font-bold text-sm outline-none text-pucho-dark pr-10 hover:border-pucho-purple transition-colors cursor-pointer" onchange="dashboard.loadAttendanceStudents()">
                                <option value="">Div</option>
                                ${divOptions}
                            </select>
                             <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                        </div>
                    </div>
                </div>

                <div id="attendanceList" class="min-h-[200px]">
                    <div class="flex flex-col items-center justify-center h-48 text-gray-400 border-2 border-dashed border-gray-50 rounded-3xl">
                        <span class="text-4xl mb-4 opacity-50">👨‍🎓</span>
                        <p class="font-medium text-sm">Select Class & Division to load students</p>
                    </div>
                </div>
                
                 <div class="flex justify-end mt-8 border-t border-gray-50 pt-6">
                     <button class="bg-pucho-dark text-white px-8 py-4 rounded-2xl font-bold hover:shadow-glow hover:bg-pucho-purple transition-all transform active:scale-95" onclick="showToast('Attendance Submitted for Selected Class!', 'success')">SUBMIT ATTENDANCE</button>
                </div>
            </div>`;
        },

        exam_marks: function () {
            return `<div class="bg-white rounded-[40px] p-8 border border-gray-100 shadow-subtle animate-fade-in">
                <div class="flex justify-between items-center mb-8">
                    <h3 class="font-bold text-2xl">Enter Marks</h3>
                    <select class="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 font-bold text-sm outline-none">
                        <option>Unit Test 1</option>
                        <option>Mid Term</option>
                        <option>Finals</option>
                    </select>
                </div>
                 <div class="overflow-x-auto">
                    <table class="w-full text-left font-inter">
                        <thead class="bg-gray-50/50">
                            <tr>
                                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Roll No</th>
                                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Student Name</th>
                                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Obtained Marks</th>
                                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Total</th>
                                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Array.from({ length: 5 }, (_, i) => `
                            <tr class="border-b border-gray-50">
                                <td class="px-6 py-4 font-bold text-gray-500">${20 + i}</td>
                                <td class="px-6 py-4 font-bold text-pucho-dark">Student Name ${i + 1}</td>
                                <td class="px-6 py-4"><input type="number" class="w-20 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 font-bold text-center outline-none focus:border-pucho-purple" value="${Math.floor(Math.random() * 40) + 60}"></td>
                                <td class="px-6 py-4 font-bold text-gray-400">100</td>
                                <td class="px-6 py-4"><span class="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-xs font-bold">A</span></td>
                            </tr>
                            `).join('')}
                        </tbody>
                    </table>
                 </div>
                 <div class="flex justify-end mt-8">
                     <button class="bg-pucho-dark text-white px-8 py-4 rounded-2xl font-bold hover:shadow-glow hover:bg-pucho-purple transition-all" onclick="showToast('Marks Saved Successfully!', 'success')">SAVE RESULT</button>
                </div>
            </div>`;
        },

        manage_quizzes: function () {
            const classes = ['Nursery', 'LKG', 'UKG', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
            const divisions = ['A', 'B', 'C', 'D'];
            const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Computer Science', 'Physics', 'Chemistry', 'Biology'];
            const types = ['Class Test', 'Unit Test', 'Mid-Term', 'Final Exam', 'Surprise Quiz'];

            return `<div class="bg-white rounded-[40px] p-8 border border-gray-100 shadow-subtle animate-fade-in font-inter">
                <div class="flex justify-between items-center mb-8">
                    <div>
                        <h3 class="font-bold text-2xl text-pucho-dark">Quiz Builder</h3>
                        <p class="text-gray-400 text-sm mt-1">Create and assign assessments</p>
                    </div>
                    <button onclick="document.getElementById('createQuizForm').classList.toggle('hidden')" class="bg-pucho-dark text-white px-6 py-3 rounded-xl font-bold hover:bg-pucho-purple transition-all">+ NEW ASSIGNMENT</button>
                </div>

                <!-- Creation Form -->
                <div id="createQuizForm" class="hidden mb-10 bg-gray-50 p-6 rounded-3xl border border-gray-100 animate-slide-up">
                    <h4 class="font-bold text-lg mb-4 text-pucho-dark">Configure Assessment</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <select id="quizClass" class="input-field">
                            <option value="">Select Class</option>
                            ${classes.map(c => `<option value="${c}">${c}</option>`).join('')}
                        </select>
                         <select id="quizDiv" class="input-field">
                            <option value="">All Divisions</option>
                            ${divisions.map(d => `<option value="${d}">${d}</option>`).join('')}
                        </select>
                         <select id="quizSubject" class="input-field">
                            <option value="">Subject</option>
                            ${subjects.map(s => `<option value="${s}">${s}</option>`).join('')}
                        </select>
                        <select id="quizType" class="input-field">
                            <option value="">Assessment Type</option>
                            ${types.map(t => `<option value="${t}">${t}</option>`).join('')}
                        </select>
                    </div>
                    <input type="text" id="quizTitle" placeholder="Enter Quiz / Exam Title (e.g. Chapter 1 - Algebra)" class="w-full px-4 py-3 rounded-2xl border border-gray-200 mb-4 focus:border-pucho-purple outline-none">
                    <div class="flex justify-end">
                        <button onclick="dashboard.publishQuiz()" class="bg-pucho-purple text-white px-8 py-3 rounded-xl font-bold hover:shadow-glow transition-all">PUBLISH TO STUDENTS</button>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    ${schoolDB.quizzes.map(q => `
                        <div class="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-pucho-purple transition-all">
                            <div class="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:scale-110 transition-transform">📝</div>
                            <span class="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-widest mb-2 inline-block">${q.type}</span>
                            <h4 class="font-bold text-xl text-pucho-dark mb-1 relative z-10">${q.title}</h4>
                            <p class="text-sm font-bold text-gray-400 mb-4 relative z-10">${q.subject} • ${q.class} - ${q.division}</p>
                            <div class="flex items-center justify-between relative z-10">
                                <span class="text-xs font-bold text-gray-400">Published: ${q.date}</span>
                                <button class="text-pucho-purple font-bold text-xs uppercase hover:underline">View Stats</button>
                            </div>
                        </div>
                    `).join('')}
                    ${schoolDB.quizzes.length === 0 ? `<div class="col-span-2 text-center py-10 text-gray-400">No active quizzes found. Create one to get started!</div>` : ''}
                </div>
            </div>
            <style>.input-field { width: 100%; padding: 12px; border-radius: 12px; border: 1px solid #e5e7eb; background: white; outline: none; font-weight: 600; font-size: 0.875rem; color: #1f2937; }</style>`;
        },

        homework: function () {
            return `<div class="bg-white rounded-[40px] p-12 border border-gray-100 text-center animate-fade-in font-inter"><h3 class="text-2xl font-bold mb-6">Drop Materials Here</h3><div class="p-20 border-2 border-dashed rounded-[40px] text-gray-400">PDF, XLS, DOC Support</div></div>`;
        },

        // --- PARENT / SHARED ---
        // Note: student_profile, parent_attendance, parent_fees are aliased above.



        parent_results: function () {
            return `<div class="bg-white p-10 rounded-[40px] border border-gray-100 animate-fade-in font-inter"><h3 class="text-2xl font-bold mb-10">Mid-Term Result</h3><div class="grid grid-cols-2 md:grid-cols-4 gap-8 font-inter"><div><p class="text-xs font-bold text-gray-400 uppercase">Grade</p><p class="text-2xl font-bold text-blue-500">A+</p></div></div></div>`;
        },

        parent_notices: function () {
            // Filter notices for Parents
            let notices = schoolDB.notices.filter(n => n.target === 'Parents' || n.target === 'All').map(n => `<div class="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <h4 class="font-bold text-pucho-dark text-lg mb-2">${n.title}</h4>
                <p class="text-xs font-bold text-gray-400 mb-2 uppercase">${n.date}</p>
                <p class="text-sm text-gray-500">${n.content}</p>
            </div>`).join('');

            if (!notices) notices = `<div class="text-center text-gray-400 py-10">No new notices.</div>`;

            return `<div class="bg-white rounded-[40px] p-8 border border-gray-100 animate-fade-in font-inter"><h3 class="font-bold text-2xl mb-8">Parent Circulars</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-6 font-inter">${notices}</div></div>`;
        },

        staff_notices: function () {
            // Filter notices for Staff
            let notices = schoolDB.notices.filter(n => n.target === 'Staff' || n.target === 'All').map(n => `<div class="p-6 bg-blue-50 rounded-3xl border border-blue-100 relative overflow-hidden">
                <div class="absolute top-0 right-0 p-4 opacity-10 text-4xl">📢</div>
                <h4 class="font-bold text-pucho-dark text-lg mb-1 relative z-10">${n.title}</h4>
                <p class="text-xs font-bold text-blue-400 mb-4 uppercase relative z-10">${n.date}</p>
                <p class="text-sm text-gray-600 relative z-10">${n.content}</p>
            </div>`).join('');

            if (!notices) notices = `<div class="text-center text-gray-400 py-10">No new notices for staff.</div>`;

            return `<div class="bg-white rounded-[40px] p-8 border border-gray-100 animate-fade-in font-inter">
                <h3 class="font-bold text-2xl mb-8">Staff Notice Board</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 font-inter">${notices}</div>
            </div>`;
        },

        // --- ADVANCED FLOW SIMULATIONS ---
        runRecoveryFlow: function () {
            showToast('Initiating Smart Recovery Flow...', 'info');
            setTimeout(() => showToast('Analyzing 154 pending fee records...', 'info'), 1000);
            setTimeout(() => showToast('AI generated personalized reminders for 12 critical defaults.', 'success'), 2500);
            setTimeout(() => showToast('Multi-channel alerts dispatched (WhatsApp + SMS).', 'success'), 4000);
        },

        triggerSafetySimulation: function () {
            showToast('AI Safety Monitor: Real-time scan in progress...', 'info');
            setTimeout(() => {
                showToast('ALERT: Attendance Mismatch detected for Arjun Das (10A)', 'error');
                this.loadPage('safety_monitor');
            }, 2000);
        },

        initProtocol: function (studentName) {
            showToast(`Safety Protocol for ${studentName} initialized.`, 'success');
            setTimeout(() => showToast(`Guardian notified via prioritized WhatsApp call.`, 'info'), 1500);
            setTimeout(() => showToast(`Class Teacher (Ms. Priya) alerted for immediate verification.`, 'info'), 3000);
        }
    }
};

window.dashboard = dashboard;
