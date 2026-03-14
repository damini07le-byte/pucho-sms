const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zpkjmfaqwjnkoppvrsrl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwa2ptZmFxd2pua29wcHZyc3JsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjA0MzMzMiwiZXhwIjoyMDgxNjE5MzMyfQ.o7hfaphdAeuNR-cXvSZ_XQVk1jV8hSBOxSMEb7Gds9s';
const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
    console.log("Checking Parent-Student-Results Link...");
    
    // 1. Get Vikram Das profile
    const { data: profile } = await supabase.from('profiles').select('*').eq('full_name', 'Vikram Das').single();
    console.log("Parent Profile:", profile);

    // 2. Get students linked to Vikram Das (by name or parent_id)
    const { data: students } = await supabase.from('students').select('*, sections(classes(name))').or(`guardian_name.eq.Vikram Das,parent_id.eq.${profile?.id || 'none'}`);
    console.log("Linked Students:", students.map(s => ({ id: s.id, name: s.name, class: s.sections?.classes?.name, guardian: s.guardian_name })));

    if (students && students.length > 0) {
        const studentIds = students.map(s => s.id);
        // 3. Get results for these students
        const { data: results } = await supabase.from('results').select('*').in('student_id', studentIds);
        console.log("Results Found:", results ? results.length : 0);
        if (results && results.length > 0) {
            console.log("Sample Result:", results[0]);
        } else {
            console.log("WARNING: No results found for these students.");
        }
    } else {
        console.log("WARNING: No students found for Vikram Das.");
    }
})();
