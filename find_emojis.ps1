$content = Get-Content 'readable_chunk2.js' -Raw

# Match Unicode emoji ranges or characters
$emojiRegex = [regex]'[\u2600-\u27BF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]|\uD83D[\uDE80-\uDEF6]|\uD83E[\uDD00-\uDDFF]'

$matches = $emojiRegex.Matches($content)
Write-Host "Total Emoji matches found: $($matches.Count)"

$uniqueEmojis = $matches | ForEach-Object { $_.Value } | Select-Object -Unique
Write-Host "Unique Emojis:"
$uniqueEmojis | ForEach-Object { Write-Host $_ }

# Let's search for string literals in readable_chunk2.js that contain emojis
$lines = Get-Content 'readable_chunk2.js'
$emojiLines = $lines | Where-Object { $_ -match '[\u2600-\u27BF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]|\uD83D[\uDE80-\uDEF6]|\uD83E[\uDD00-\uDDFF]' }

Write-Host "`nLines with Emojis: $($emojiLines.Count)"
$emojiLines | Select-Object -First 60 | ForEach-Object { Write-Host $_ }
