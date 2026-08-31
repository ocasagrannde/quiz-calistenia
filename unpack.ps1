$content = Get-Content 'index-bundle.js' -Raw

# Save a readable version of index-bundle.js by formatting JS object literals and JSX
# Write script to extract steps array or component definitions
[regex]::Matches($content, '\{[^{}]*etapa[^{}]*\}') | ForEach-Object { Write-Host $_.Value }

# Let's search for objects/arrays containing questions, options, headings, steps
# Write full bundle formatted with line breaks after semicolons to readable_bundle.js
$readable = $content -replace '([;{}])', "`$1`n"
Set-Content -Path 'readable_bundle.js' -Value $readable

Write-Host "Wrote readable_bundle.js"
