$raw = Get-Content 'readable_chunk2.js' -Raw

# Search for Step component definitions in readable_chunk2.js
# E.g., function Step1, const Step1, etc.
# Let's extract blocks of code for Step1 to Step35 and named steps

$stepNames = @(
    "Step1", "Step2", "Step3", "Step4", "Step5", "Step6", "Step7", "Step8", "Step9", "Step10",
    "Step11", "Step12", "Step13", "Step14", "Step15", "Step16", "Step17", "Step18", "Step19", "Step20",
    "Step21", "Step22", "Step23", "Step24", "Step25", "Step26", "Step27", "Step28", "Step29", "Step30",
    "Step31", "Step32", "Step33", "Step34", "Step35",
    "StepWater", "StepSleep", "StepEatingHabits", "StepMealPreferences", "StepMotivationReal",
    "StepTransformation", "StepPlanSummary", "StepCommitmentDate", "Calculation", "VSL", "Pitch"
)

$outputFile = 'all_steps_extracted.txt'
"==================== ALL STEPS EXTRACTED ====================" | Set-Content -Path $outputFile

foreach ($s in $stepNames) {
    # Match component declaration or usage
    $pos = $raw.IndexOf($s)
    if ($pos -ge 0) {
        $start = [Math]::Max(0, $pos - 100)
        $len = [Math]::Min(3000, $raw.Length - $start)
        $snippet = $raw.Substring($start, $len)
        
        "--------------------------------------------------" | Add-Content -Path $outputFile
        "COMPONENT: $s" | Add-Content -Path $outputFile
        "--------------------------------------------------" | Add-Content -Path $outputFile
        $snippet | Add-Content -Path $outputFile
        "" | Add-Content -Path $outputFile
    }
}

Write-Host "Extracted step snippets to $outputFile"
