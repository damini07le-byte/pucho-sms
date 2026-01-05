// Data Store (Mock Database -> Ready for API)
const schoolDB = {
    schoolInfo: {
        name: "SMS Cloud International",
        academicYear: "2024-25"
    },
    students: [
        { id: "S001", name: "Arjun Das", class: "Grade 10", division: 'A', roll: 21, guardian: "Vikram Das", email: "student" },
        { id: "S002", name: "Riya Sharma", class: "Grade 9", division: 'B', roll: 12, guardian: "Sunil Sharma", email: "riya@sms.com" },
        { id: "S003", name: "Aarav Gupta", class: "Grade 10", division: 'A', roll: 5, guardian: "Mohit Gupta", email: "aarav@sms.com" }
    ],
    staff: [
        { id: "T001", name: "Teacher Rahul", subject: "Mathematics", email: "staff" },
        { id: "T002", name: "Anita Desai", subject: "Science", email: "anita@sms.com" }
    ],
    fees: [],
    exams: [],
    admissions: [
        { id: "ADM-9981", student: "Kabir Singh", class: "Nursery", guardian: "Vikram Singh", status: "Pending", parentEmail: "newparent" }
    ],
    notices: [
        { id: 1, title: "Winter Vacation", content: "School will remain closed from 25th Dec to 2nd Jan.", target: "All", date: "20 Dec 2023" },
        { id: 2, title: "Parent-Teacher Meeting", content: "PTM for Grade 10 is scheduled for this Saturday.", target: "Parents", date: "15 Jan 2024" },
        { id: 3, title: "Staff Meeting", content: "Urgent meeting in Conference Room at 2 PM.", target: "Staff", date: "Today" }
    ],
    curriculum: [],
    quizzes: [
        { id: "Q001", title: "Algebra Basics", subject: "Mathematics", class: "Grade 10", division: "A", type: "Class Test", date: "2024-01-05" },
        { id: "Q002", title: "Newton's Laws", subject: "Physics", class: "Grade 9", division: "B", type: "Unit Test", date: "2024-01-10" }
    ]
};

// Export for easier debugging
window.schoolDB = schoolDB;
