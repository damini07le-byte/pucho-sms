
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
    console.log('--- Students (Full Class Names) ---');
    const { data: students, error: sErr } = await supabase
        .from('students')
        .select(`
            admission_no,
            profiles(full_name),
            sections(
                name,
                classes(name)
            )
        `)
        .limit(10);
    
    if (sErr) console.error(sErr);
    else console.log(JSON.stringify(students, null, 2));

    console.log('--- Subjects (Class Field) ---');
    const { data: subjects, error: subErr } = await supabase
        .from('subjects')
        .select('name, class')
        .limit(20);
    if (subErr) console.error(subErr);
    else console.log(JSON.stringify(subjects, null, 2));
}

checkData();
