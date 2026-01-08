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
    staff: [],
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
    attendance: [],
    exams: [],
    results: [],
    admissions: [],
    notices: [],
    quizzes: [],
    subjects: [
        { id: 'SUB-101', name: 'Mathematics', class: '10th' },
        { id: 'SUB-102', name: 'Science', class: '10th' },
        { id: 'SUB-103', name: 'English', class: '10th' },
        { id: 'SUB-104', name: 'Hindi', class: '10th' }
    ],
    homework: [],
    leaveRequests: []
};

// Global accessor
window.schoolDB = schoolDB;
