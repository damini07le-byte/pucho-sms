
const supabaseUrl = 'https://zpkjmfaqwjnkoppvrsrl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwa2ptZmFxd2pua29wcHZyc3JsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjA0MzMzMiwiZXhwIjoyMDgxNjE5MzMyfQ.o7hfaphdAeuNR-cXvSZ_XQVk1jV8hSBOxSMEb7Gds9s';

const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
};

const adminHeaders = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json'
};

async function db(table, method, body, query = '') {
    const response = await fetch(`${supabaseUrl}/rest/v1/${table}${query}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
    });
    if (!response.ok) {
        const err = await response.text();
        console.error(`Error in ${table} (${method}):`, err);
        return null;
    }
    return await response.json();
}

async function createUser(email, password, role) {
    const response = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
        method: 'POST',
        headers: adminHeaders,
        body: JSON.stringify({
            email,
            password,
            email_confirm: true,
            user_metadata: { role }
        })
    });
    if (!response.ok) {
        const err = await response.text();
        if (err.includes('already exists')) {
            // Try to find the user if exists
            const listRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, { headers: adminHeaders });
            const list = await listRes.json();
            return list.users.find(u => u.email === email);
        }
        console.error(`Error creating user ${email}:`, err);
        return null;
    }
    return await response.json();
}

async function seed() {
    console.log("🚀 Starting Master Seeding...");

    // 1. Seed Classes
    const classNames = ["10th", "9th", "8th", "7th", "6th"];
    const classes = [];
    for (const name of classNames) {
        const res = await db('classes', 'POST', { name });
        if (res) classes.push(res[0]);
    }
    console.log(`✅ Seeded ${classes.length} classes.`);

    // 2. Seed Sections
    const sectionNames = ["A", "B"];
    const sections = [];
    for (const cls of classes) {
        for (const name of sectionNames) {
            const res = await db('sections', 'POST', { class_id: cls.id, name });
            if (res) sections.push(res[0]);
        }
    }
    console.log(`✅ Seeded ${sections.length} sections.`);

    // 3. Seed Subjects
    const subNames = ["Mathematics", "Science", "English", "History", "Geography"];
    for (const clsName of classNames) {
        for (const name of subNames) {
            await db('subjects', 'POST', { name, class: clsName, code: `${name.substring(0, 3).toUpperCase()}-${clsName}` });
        }
    }
    console.log("✅ Seeded subjects.");

    // 4. Seed Students & Profiles
    const firstNames = ["Aarav", "Vihaan", "Aryan", "Ishani", "Anaya", "Zoya", "Kabir", "Rohan", "Sana", "Diya"];
    const lastNames = ["Sharma", "Das", "Verma", "Khan", "Singh", "Patel", "Modi", "Reddy", "Gupta", "Malhotra"];

    console.log("⏳ Seeding students (creating auth users first)...");
    for (const section of sections) {
        for (let i = 1; i <= 3; i++) { // 3 per section for speed
            const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const fullName = `${fName} ${lName}`;
            const email = `${fName.toLowerCase()}.${lName.toLowerCase()}${Math.floor(Math.random() * 1000)}@pucho.edu`;

            const user = await createUser(email, 'pucho123', 'student');
            if (user) {
                // Create Profile
                const profile = await db('profiles', 'POST', {
                    id: user.id,
                    full_name: fullName,
                    role: 'student',
                    phone: `9${Math.floor(Math.random() * 900000000 + 100000000)}`
                });

                if (profile) {
                    // Create Student record
                    await db('students', 'POST', {
                        id: user.id,
                        admission_no: `ADM-${section.id.substring(0, 4)}-${i}`,
                        roll_no: i,
                        section_id: section.id,
                        status: 'Active',
                        gender: i % 2 === 0 ? 'Female' : 'Male',
                        dob: '2012-05-15'
                    });
                }
            }
        }
    }
    console.log("✅ Seeded students linked to profiles and auth users.");

    // 5. Seed Staff
    const staffNames = ["Ms. Sunita Rao", "Mr. Amit Kumar", "Dr. Ramesh Babu"];
    for (const name of staffNames) {
        const email = `${name.replace(/\s+/g, '.').toLowerCase()}@pucho.edu`;
        const user = await createUser(email, 'pucho123', 'staff');
        if (user) {
            const profile = await db('profiles', 'POST', {
                id: user.id,
                full_name: name,
                role: 'staff',
                phone: `9${Math.floor(Math.random() * 900000000 + 100000000)}`
            });
            if (profile) {
                await db('staff', 'POST', {
                    id: user.id,
                    employee_id: `STF-${Math.floor(Math.random() * 900 + 100)}`,
                    name: name,
                    role: 'Teacher',
                    subject: 'All',
                    email: email,
                    password: '123'
                });
            }
        }
    }
    console.log("✅ Seeded staff members.");

    console.log("✨ MASTER SEEDING COMPLETE!");
}

seed();
