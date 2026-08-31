$raw = Get-Content 'readable_chunk2.js' -Raw

$exports = "So as Step12Limitations,Mo as Step13Comfort,Co as Step14Encouragement,Po as Step15Height,Ao as Step16CurrentWeight,Eo as Step17TargetWeight,zo as Step18Age,an as Step1Age,Oo as Step20Lifestyle,Do as Step21Symptoms,Io as Step23ProfileReady,Ro as Step24Activities,Lo as Step25PreparingPlan,$o as Step26Hydration,Fo as Step27Diet,Xo as Step28Habits,Ho as Step29LifeEvents,uo as Step2SocialProof,Vo as Step30Motivation,Go as Step31Projection,Uo as Step32Loading,Zo as Step33Email,Ko as Step34Offer,xo as Step3CalistheniaExperience,fo as Step3MainGoal,go as Step4AdditionalGoals,po as Step4Nao,ho as Step4Sim,vo as Step5BodyZones,yo as Step5bTargetZones,jo as Step6Education,wo as Step7BodyType,No as Step8DreamBody,ko as Step9FitnessHistory,Qo as StepCommitmentDate,Bo as StepEatingHabits,Wo as StepMealPreferences,Yo as StepMotivationReal,Jo as StepPlanSummary,To as StepSleep,_o as StepTransformation,qo as StepWater"

$pairs = $exports -split ','
$outFile = 'quiz_component_declarations.txt'
"==================== COMPONENT DECLARATIONS ====================" | Set-Content -Path $outFile

foreach ($p in $pairs) {
    $parts = $p -split ' as '
    $varName = $parts[0].Trim()
    $stepName = $parts[1].Trim()
    
    # Search for variable declaration like "function varName", "var varName=", "const varName="
    $regex = [regex]"(function\s+$varName|const\s+$varName\s*=|let\s+$varName\s*=|var\s+$varName\s*=)"
    $match = $regex.Match($raw)
    
    if ($match.Success) {
        $idx = $match.Index
        $len = [Math]::Min(2500, $raw.Length - $idx)
        $code = $raw.Substring($idx, $len)
        "--------------------------------------------------" | Add-Content -Path $outFile
        "VAR: $varName -> STEP: $stepName" | Add-Content -Path $outFile
        "--------------------------------------------------" | Add-Content -Path $outFile
        $code | Add-Content -Path $outFile
        "" | Add-Content -Path $outFile
    } else {
        "NOT FOUND BY REGEX: $varName ($stepName)" | Add-Content -Path $outFile
    }
}

Write-Host "Wrote declarations to $outFile"
