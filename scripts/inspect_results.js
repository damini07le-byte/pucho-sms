const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zpkjmfaqwjnkoppvrsrl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwa2ptZmFxd2pua29wcHZyc3JsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjA0MzMzMiwiZXhwIjoyMDgxNjE5MzMyfQ.o7hfaphdAeuNR-cXvSZ_XQVk1jV8hSBOxSMEb7Gds9s';
const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
    console.log("Inspecting NEW 7th Grade Results...");
    
    // 1. Get results added today
    const { data: results, error: resErr } = await supabase
        .from('results')
        .select(`
            *,
            students:student_id (
                *,
                profiles:profiles!students_id_fkey(full_name),
                sections:section_id(name, classes(name))
            ),
            subjects:subject_id(name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

    if (resErr) {
        console.error("Error fetching results:", resErr);
        return;
    }

    results.forEach(r => {
        const s = r.students;
        const profile = Array.isArray(s?.profiles) ? s.profiles[0] : s?.profiles;
        const className = s?.sections?.classes?.name || 'Unknown';
        console.log(`
--- Result ID: ${r.id} ---
Student ID: ${r.student_id}
Student Name: ${profile?.full_name || 'NO PROFILE NAME'}
Student Name (Raw): ${s?.name}
Class: ${className}
Subject: ${r.subjects?.name}
Marks: ${r.marks_obtained} / ${r.total_marks}
Exam: ${r.exam_type || r.exam}
Created At: ${r.created_at}
        `);
    });

    // 2. Also check Vikram Das's linked students specifically
    const vProfile = '6652c3cf-4c65-41fc-8f7f-3a8fc5af9040'; // Vikram Das ID
    const { data: linkedStudents } = await supabase
        .from('students')
        .select('*, profiles:profiles!students_id_fkey(full_name)')
        .or(`guardian_name.eq.Vikram Das,parent_id.eq.${vProfile}`);
    
    console.log("\n--- Vikram Das's Linked Students ---");
    linkedStudents.forEach(s => {
        const profile = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles;
        console.log(`Student: ${profile?.full_name || 'NO PROFILE'} ID: ${s.id} Guardian: ${s.guardian_name}`);
    });

})();
