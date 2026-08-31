$raw = Get-Content 'index-chunk2.js' -Raw

# Search for step routes, Step components, questions, titles, etc.
# Find React components like Step1, Step2, ..., LoadingStep, ResultStep, VslStep, etc.
$stepComponents = [regex]::Matches($raw, '(Step\d+|step\d+|Question\d+|Step[A-Z][a-zA-Z0-9]+|StepResult|StepVSL|StepLoading|Calculation|ResultPage)') | ForEach-Object { $_.Value } | Select-Object -Unique

Write-Host "--- DETECTED STEP COMPONENTS ---"
$stepComponents | ForEach-Object { Write-Host $_ }

# Let's inspect step configurations or route paths: /step-1, /step-2...
$routes = [regex]::Matches($raw, '"/step-[^"]+"') | ForEach-Object { $_.Value } | Select-Object -Unique
Write-Host "`n--- ROUTES FOUND ---"
$routes | ForEach-Object { Write-Host $_ }

# Let's search for step definitions or title strings
# Let's find lines with "title", "subtitle", "question", "options", "image"
$lines = Get-Content 'readable_chunk2.js'
$titleLines = $lines | Select-String -Pattern '(title:|headline:|sub:|question:|opcoes|options|step:)'
Write-Host "`n--- TITLE & QUESTION LINES (Sample 40) ---"
$titleLines | Select-Object -First 40 | ForEach-Object { Write-Host $_.Line }
