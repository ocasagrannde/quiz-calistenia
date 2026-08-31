$content = Get-Content 'index-bundle.js' -Raw
Write-Host "Bundle size: $($content.Length) characters"

# Extract all string literals or regex matches for quiz questions, steps, options, etc.
# Find matches like step, question, title, button, image paths
$imgMatches = [regex]::Matches($content, '["''][^"'']+\.(png|jpg|jpeg|webp|gif|svg)["'']')
Write-Host "`n--- IMAGES FOUND ---"
$images = $imgMatches | ForEach-Object { $_.Value } | Select-Object -Unique
$images | ForEach-Object { Write-Host $_ }

# Search for components or text chunks
# Let's save a formatted version or search key terms
$regexSteps = [regex]::Matches($content, '(?i)(etapa|pergunta|opç|idade|peso|meta|gordura|barriga|calistenia|vsl|checkout|oferta|garantia|depoimento|resultado)')
Write-Host "`nTotal keyword matches: $($regexSteps.Count)"
