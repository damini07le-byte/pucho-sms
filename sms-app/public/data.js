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
        { id: "STD-003", name: "Vihaan Das", class: "10th", division: "A", roll_no: 12, guardian_name: "Vikram Das", phone: "9988776655", email: "vikram.das@example.com", status: "Active" },
        { id: "STD-004", name: "Zoya Khan", class: "8th", division: "C", roll_no: 3, guardian_name: "Arif Khan", phone: "9822334455", email: "arif.khan@example.com", status: "Active" },
        { id: "STD-005", name: "Kabir Singh", class: "12th", division: "A", roll_no: 22, guardian_name: "JS Singh", phone: "9711223344", email: "js.singh@example.com", status: "Active" },
        { id: "STD-006", name: "Anaya Das", class: "7th", division: "B", roll_no: 7, guardian_name: "Vikram Das", phone: "9600778899", email: "vikram.das@example.com", status: "Active" }
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
        { id: "ATT-001", student_id: "STD-003", date: new Date().toISOString().split('T')[0], status: "Present" }
    ],
    exams: [
        { id: "EXM-001", class: "10th", subject: "Mathematics", date: "2024-05-15", time: "10:00 AM", venue: "Hall A" }
    ],
    results: [
        { id: "RES-001", student_id: "STD-003", subject: "Mathematics", marks: 85, grade: "A" },
        { id: "RES-002", student_id: "STD-003", subject: "Science", marks: 78, grade: "B" }
    ],
    admissions: [],
    notices: [
        { id: "NTC-001", title: "Annual Day", content: "Celebration on 20th June", date: "2024-05-01", target: "Global" }
    ],
    quizzes: [],
    subjects: [
        { id: "SUB-001", name: "Mathematics", class: "10th" },
        { id: "SUB-002", name: "Science", class: "10th" }
    ],
    homework: [
        { id: "HW-001", title: "Algebra Worksheet", subject: "Mathematics", class_grade: "10th", date: "2024-05-10", file: "algebra.pdf" }
    ],
    leaveRequests: []
};

// Global accessor
window.schoolDB = schoolDB;
