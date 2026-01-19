// MASTER DATA STORE (Mock Database -> Ready for API Integration)
const schoolDB = {
    schoolInfo: {
        name: "Pucho.ai SMS Center",
        academicYear: "2024-25",
        address: "Digital Square, Bengaluru",
        contact: "+91 80000 12345"
    },
    students: [
        { id: "STD-001", name: "Aarav Sharma", class: "10th", division: "A", roll_no: 1, guardian_name: "Rajesh Sharma", phone: "9876543210", email: "rajesh.sharma@example.com", status: "Active" },
        { id: "STD-002", name: "Ishani Verma", class: "9th", division: "B", roll_no: 5, guardian_name: "Sanjay Verma", phone: "9123456789", email: "sanjay.verma@example.com", status: "Active" },
        { id: "STD-003", name: "Vihaan Gupta", class: "10th", division: "A", roll_no: 12, guardian_name: "Anita Gupta", phone: "9988776655", email: "anita.gupta@example.com", status: "Active" },
        { id: "STD-004", name: "Zoya Khan", class: "8th", division: "C", roll_no: 3, guardian_name: "Arif Khan", phone: "9822334455", email: "arif.khan@example.com", status: "Active" },
        { id: "STD-005", name: "Kabir Singh", class: "12th", division: "A", roll_no: 22, guardian_name: "JS Singh", phone: "9711223344", email: "js.singh@example.com", status: "Active" },
        { id: "STD-006", name: "Anaya Iyer", class: "7th", division: "B", roll_no: 7, guardian_name: "M. Iyer", phone: "9600778899", email: "m.iyer@example.com", status: "Active" }
    ],
    staff: [
        { id: "STF-001", name: "Dr. Ramesh Babu", role: "Sr. Teacher", subject: "Mathematics", status: "Active", designation: "HOD Math" },
        { id: "STF-002", name: "Ms. Sunita Rao", role: "Teacher", subject: "Science", status: "Active", designation: "Class Teacher" },
        { id: "STF-003", name: "Mr. Amit Kumar", role: "Teacher", subject: "English", status: "Absent", designation: "Faculty" },
        { id: "STF-004", name: "Mrs. Priya Singh", role: "Clerk", subject: "N/A", status: "Active", designation: "Admin Staff" }
    ],
    fees: [
        { id: "FEE-101", student_id: "STD-001", type: "Monthly Tuition", amount: 5000, status: "Pending" },
        { id: "FEE-102", student_id: "STD-002", type: "Transport Fee", amount: 1500, status: "Pending" },
        { id: "FEE-103", student_id: "STD-003", type: "Monthly Tuition", amount: 5000, status: "Paid" },
        { id: "FEE-104", student_id: "STD-001", type: "Library Fee", amount: 500, status: "Pending" },
        { id: "FEE-105", student_id: "STD-004", type: "Tuition Fee", amount: 4500, status: "Pending" },
        { id: "FEE-106", student_id: "STD-005", type: "Annual Fee", amount: 12000, status: "Pending" },
        { id: "FEE-107", student_id: "STD-006", type: "Lab Fee", amount: 2000, status: "Pending" },
        { id: "FEE-108", student_id: "STD-002", type: "Tuition Fee", amount: 4500, status: "Pending" }
    ],
    attendance: [
        // Staff Attendance for today
        { id: "SATT-001", staff_id: "STF-001", date: new Date().toISOString().split('T')[0], status: "Present" },
        { id: "SATT-002", staff_id: "STF-002", date: new Date().toISOString().split('T')[0], status: "Present" },
        { id: "SATT-003", staff_id: "STF-003", date: new Date().toISOString().split('T')[0], status: "Absent" },
        { id: "SATT-004", staff_id: "STF-004", date: new Date().toISOString().split('T')[0], status: "Present" },
        // Student Attendance for today
        { id: "ATT-001", student_id: "STD-001", date: new Date().toISOString().split('T')[0], status: "Present" },
        { id: "ATT-002", student_id: "STD-002", date: new Date().toISOString().split('T')[0], status: "Absent" },
        { id: "ATT-003", student_id: "STD-003", date: new Date().toISOString().split('T')[0], status: "Present" },
        { id: "ATT-004", student_id: "STD-004", date: new Date().toISOString().split('T')[0], status: "Present" },
        { id: "ATT-005", student_id: "STD-005", date: new Date().toISOString().split('T')[0], status: "Present" },
        { id: "ATT-006", student_id: "STD-006", date: new Date().toISOString().split('T')[0], status: "Absent" },

        // Historical Records (Yesterday)
        { id: "ATT-007", student_id: "STD-001", date: "2026-01-15", status: "Present" },
        { id: "ATT-008", student_id: "STD-002", date: "2026-01-15", status: "Present" },
        { id: "ATT-009", student_id: "STD-003", date: "2026-01-15", status: "Absent" },
        { id: "SATT-005", staff_id: "STF-001", date: "2026-01-15", status: "Present" }
    ],
    exams: [],
    results: [],
    admissions: [],
    notices: [],
    quizzes: [],
    subjects: [],
    homework: [],
    leaveRequests: []
};

// Global accessor
window.schoolDB = schoolDB;
