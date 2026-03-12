const supabaseUrl = 'https://zpkjmfaqwjnkoppvrsrl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwa2ptZmFxd2pua29wcHZyc3JsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjA0MzMzMiwiZXhwIjoyMDgxNjE5MzMyfQ.o7hfaphdAeuNR-cXvSZ_XQVk1jV8hSBOxSMEb7Gds9s';

const CLASSES = ['Nursery', 'LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];
const SECTIONS = ['A', 'B'];
const STUDENTS_PER_SECTION = 5;

async function api(path, method = 'GET', body = null) {
    const url = `${supabaseUrl}/rest/v1/${path}`;
    const headers = {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    };
    const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`API Error ${res.status} on ${path}: ${text}`);
    }
    return await res.json();
}

async function seed() {
    console.log("🚀 Starting database seeding...");

    // 1. Get or Create Classes
    console.log("Checking classes...");
    const existingClasses = await api('classes?select=id,name');
    const classMap = {};
    existingClasses.forEach(c => classMap[c.name] = c.id);

    for (const className of CLASSES) {
        if (!classMap[className]) {
            console.log(`Creating class: ${className}`);
            const created = await api('classes', 'POST', { name: className });
            classMap[className] = created[0].id;
        }
    }

    // 2. Get or Create Sections
    console.log("Checking sections...");
    const existingSections = await api('sections?select=id,name,class_id');
    const sectionMap = {}; // "className-sectionName" -> id
    existingSections.forEach(s => {
        const clsName = Object.keys(classMap).find(name => classMap[name] === s.class_id);
        if (clsName) sectionMap[`${clsName}-${s.name}`] = s.id;
    });

    for (const className of CLASSES) {
        for (const sectionName of SECTIONS) {
            const key = `${className}-${sectionName}`;
            if (!sectionMap[key]) {
                console.log(`Creating section: ${key}`);
                const created = await api('sections', 'POST', { name: sectionName, class_id: classMap[className] });
                sectionMap[key] = created[0].id;
            }
        }
    }

    // 3. Create Students and Fees
    console.log("Generating students and fees...");
    const names = ['Aryan Sharma', 'Zia Khan', 'Ishaan Verma', 'Ananya Gupta', 'Rohan Das', 'Sana Parveen', 'Kabir Singh', 'Meera Iyer', 'Arjun Reddy', 'Kyra Malhotra', 'Vihaan Shah', 'Sara Ali', 'Reyansh Pant', 'Ivaan Jain', 'Aarav Kumar'];
    
    for (const className of CLASSES) {
        console.log(`Processing class: ${className}`);
        for (const sectionName of SECTIONS) {
            const sectionId = sectionMap[`${className}-${sectionName}`];
            
            // Check current student count in this section
            const countRes = await fetch(`${supabaseUrl}/rest/v1/students?section_id=eq.${sectionId}&select=count`, {
                headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Prefer': 'count=exact' }
            });
            const count = parseInt(countRes.headers.get('content-range').split('/')[1]);

            if (count < STUDENTS_PER_SECTION) {
                const toAdd = STUDENTS_PER_SECTION - count;
                console.log(`Adding ${toAdd} students to ${className}-${sectionName}`);
                
                for (let i = 0; i < toAdd; i++) {
                    const studentName = names[Math.floor(Math.random() * names.length)];
                    const rollNo = count + i + 1;
                    const admissionNo = `ADM-${className.substring(0,2).toUpperCase()}-${sectionName}-${rollNo}-${Math.floor(Math.random()*1000)}`;
                    const studentUuid = crypto.randomUUID();

                    // 1. Create Profile First (Constraint requires profile to exist)
                    console.log(`Creating profile for: ${studentName}`);
                    await api('profiles', 'POST', {
                        id: studentUuid,
                        full_name: studentName,
                        phone: '9876543210',
                        role: 'student' // If there's a role column
                    }).catch(e => {
                        console.warn("Profile creation might have skipped if it already exists or schema differs:", e.message);
                    });

                    // 2. Create Student
                    console.log(`Creating student: ${admissionNo}`);
                    await api('students', 'POST', {
                        id: studentUuid,
                        section_id: sectionId,
                        admission_no: admissionNo,
                        roll_no: rollNo,
                        status: 'Active',
                        gender: i % 2 === 0 ? 'Male' : 'Female',
                        dob: '2015-01-01',
                        guardian_name: 'Parent Name',
                        parent_phone: '9876543210'
                    });
                    const studentId = studentUuid; 

                    // 3. Create Fee Payment
                    // Create Fee Payment for first 3 students of first section A (total 5 per class across A/B)
                    // Let's simplify: If rollNo <= 3 in Section A, or rollNo <= 2 in Section B, mark as Paid.
                    const isPaid = (sectionName === 'A' && rollNo <= 3) || (sectionName === 'B' && rollNo <= 2);
                    if (isPaid) {
                        await api('fees_payments', 'POST', {
                            student_id: studentId,
                            amount_paid: 5000,
                            payment_date: new Date().toISOString(),
                            payment_method: 'Cash'
                        });
                        console.log(`Paid fee for ${studentName}`);
                    }
                }
            } else {
                console.log(`Section ${className}-${sectionName} already has ${count} students.`);
            }
        }
    }

    console.log("✅ Seeding complete!");
}

seed().catch(err => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
});
