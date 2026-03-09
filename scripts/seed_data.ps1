$PROJECT_URL = "https://zpkjmfaqwjnkoppvrsrl.supabase.co"
$SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwa2ptZmFxd2pua29wcHZyc3JsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjA0MzMzMiwiZXhwIjoyMDgxNjE5MzMyfQ.o7hfaphdAeuNR-cXvSZ_XQVk1jV8hSBOxSMEb7Gds9s"

$headers = @{
    "apikey"        = $SERVICE_ROLE_KEY
    "Authorization" = "Bearer $SERVICE_ROLE_KEY"
    "Content-Type"  = "application/json"
    "Prefer"        = "return=representation"
}

function Invoke-Supabase ($table, $method, $body) {
    $uri = "$PROJECT_URL/rest/v1/$table"
    $jsonBody = $body | ConvertTo-Json -Depth 10
    try {
        $response = Invoke-RestMethod -Uri $uri -Method $method -Headers $headers -Body $jsonBody
        return $response
    }
    catch {
        Write-Host "Error in $($table): $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

Write-Host "🚀 Starting database seeding..." -ForegroundColor Cyan

# 1. Seed Classes
$classNames = @("10th", "9th", "8th", "7th", "6th")
$seededClasses = @()
foreach ($name in $classNames) {
    $res = Invoke-Supabase "classes" "POST" @{ name = $name }
    if ($res) { $seededClasses += $res }
}
Write-Host "✅ Seeded $($seededClasses.Count) classes."

# 2. Seed Sections
$sectionNames = @("A", "B")
$seededSections = @()
foreach ($cls in $seededClasses) {
    foreach ($name in $sectionNames) {
        $res = Invoke-Supabase "sections" "POST" @{ class_id = $cls.id; name = $name }
        if ($res) { $seededSections += $res }
    }
}
Write-Host "✅ Seeded $($seededSections.Count) sections."

# 3. Seed Subjects
$subNames = @("Mathematics", "Science", "English", "History", "Geography")
foreach ($clsName in $classNames) {
    foreach ($name in $subNames) {
        Invoke-Supabase "subjects" "POST" @{ name = $name; class = $clsName } | Out-Null
    }
}
Write-Host "✅ Seeded subjects."

# 4. Seed Profiles and Students
$firstNames = @("Aarav", "Vihaan", "Aryan", "Ishani", "Anaya", "Zoya", "Kabir", "Rohan", "Sana", "Diya")
$lastNames = @("Sharma", "Das", "Verma", "Khan", "Singh", "Patel", "Modi", "Reddy", "Gupta", "Malhotra")

Write-Host "⏳ Seeding 10 students per grade (this will take a moment)..."
foreach ($section in $seededSections) {
    for ($j = 1; $j -le 5; j++) {
        $fName = $firstNames | Get-Random
        $lName = $lastNames | Get-Random
        $fullName = "$fName $lName"
        
        # Create Profile
        $profileBody = @{
            full_name = $fullName
            role      = "student"
            phone     = "9$((Get-Random -Minimum 100000000 -Maximum 999999999))"
        }
        $newProfile = Invoke-Supabase "profiles" "POST" $profileBody

        if ($newProfile) {
            # Create Student
            $studentBody = @{
                id           = $newProfile.id
                admission_no = "ADM-$($section.id.Substring(0,4))-$j"
                roll_no      = $j
                section_id   = $section.id
                status       = "Active"
                gender       = if ($j % 2 -eq 0) { "Female" } else { "Male" }
                dob          = "2010-01-01"
            }
            Invoke-Supabase "students" "POST" $studentBody | Out-Null
        }
    }
}
Write-Host "✅ Seeded students linked to profiles."

# 5. Seed Staff
$staffNames = @("Ms. Sunita Rao", "Mr. Amit Kumar", "Dr. Ramesh Babu", "Mrs. Priya Singh", "Mr. Rajesh Iyer")
foreach ($name in $staffNames) {
    $newProfile = Invoke-Supabase "profiles" "POST" @{
        full_name = $name
        role      = "staff"
        phone     = "9$((Get-Random -Minimum 100000000 -Maximum 999999999))"
    }
    if ($newProfile) {
        Invoke-Supabase "staff" "POST" @{
            employee_id = "STF-$((Get-Random -Minimum 100 -Maximum 999))"
            name        = $name
            email       = "$($name.Replace(' ', '.').ToLower())@example.com"
            role        = "Teacher"
            password    = "123"
        } | Out-Null
    }
}
Write-Host "✅ Seeded staff members."

Write-Host "✨ Seeding complete!" -ForegroundColor Green
