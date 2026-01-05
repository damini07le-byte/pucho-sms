// MASTER DATA STORE (Mock Database -> Ready for API Integration)
const schoolDB = {
    schoolInfo: {
        name: "Pucho.ai SMS Center",
        academicYear: "2024-25",
        address: "Digital Square, Bengaluru",
        contact: "+91 80000 12345"
    },
    students: [],
    staff: [],
    fees: [],
    attendance: [],
    exams: [],
    results: [],
    admissions: [],
    notices: [],
    quizzes: [],
    homework: [],
    leaveRequests: []
};

// Global accessor
window.schoolDB = schoolDB;
