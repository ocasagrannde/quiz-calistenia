$raw = Get-Content 'readable_chunk2.js' -Raw

$funcs = @{
    "Step1_Age" = "function an(";
    "Step2_SocialProof" = "function uo(";
    "Step3_MainGoal" = "function fo(";
    "Step3_Experience" = "function xo(";
    "Step4_AdditionalGoals" = "function go(";
    "Step5_BodyZones" = "function vo(";
    "Step5b_TargetZones" = "function yo(";
    "Step6_Education" = "function jo(";
    "Step7_BodyType" = "function wo(";
    "Step8_DreamBody" = "function No(";
    "Step9_FitnessHistory" = "function ko(";
    "Step12_Limitations" = "function So(";
    "Step13_Comfort" = "function Mo(";
    "Step14_Encouragement" = "function Co(";
    "Step15_Height" = "function Po(";
    "Step16_CurrentWeight" = "function Ao(";
    "Step17_TargetWeight" = "function Eo(";
    "Step18_AgeInput" = "function zo(";
    "Step20_Lifestyle" = "function Oo(";
    "Step21_Symptoms" = "function Do(";
    "Step23_ProfileReady" = "function Io(";
    "Step24_Activities" = "function Ro(";
    "Step25_PreparingPlan" = "function Lo(";
    "Step26_Hydration" = "function `$o(";
    "Step27_Diet" = "function Fo(";
    "Step28_Habits" = "function Xo(";
    "Step29_LifeEvents" = "function Ho(";
    "Step30_Motivation" = "function Vo(";
    "Step31_Projection" = "function Go(";
    "Step32_Loading" = "function Uo(";
    "Step33_Email" = "function Zo(";
    "Step34_Offer" = "function Ko("
}

$outFile = 'quiz_functions_extracted.txt'
"==================== QUIZ FUNCTIONS EXTRACTED ====================" | Set-Content -Path $outFile

foreach ($key in $funcs.Keys) {
    $pattern = $funcs[$key]
    # Replace $ with regex escape if needed
    $idx = $raw.IndexOf($pattern.Replace("function `$o(", "function `$o("))
    if ($idx -ge 0) {
        $len = [Math]::Min(3500, $raw.Length - $idx)
        $code = $raw.Substring($idx, $len)
        "--------------------------------------------------" | Add-Content -Path $outFile
        "STEP: $key ($pattern)" | Add-Content -Path $outFile
        "--------------------------------------------------" | Add-Content -Path $outFile
        $code | Add-Content -Path $outFile
        "" | Add-Content -Path $outFile
    } else {
        "NOT FOUND: $key ($pattern)" | Add-Content -Path $outFile
    }
}

Write-Host "Wrote function extracts to $outFile"
