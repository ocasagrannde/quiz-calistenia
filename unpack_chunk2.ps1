$content = Get-Content 'index-chunk2.js' -Raw
Write-Host "Chunk2 size: $($content.Length) characters"

$readable = $content -replace '([;{}])', "`$1`n"
Set-Content -Path 'readable_chunk2.js' -Value $readable
Write-Host "Wrote readable_chunk2.js"

# Extract all string literals > 5 characters
$matches = [regex]::Matches($content, '"([^"\\]|\\.)*"|''([^''\\]|\\.)*''|`([^`\\]|\\.)*`')

$phrases = @()
foreach ($m in $matches) {
    $val = $m.Value.Trim('"''`')
    if ($val.Length -gt 4 -and $val -notmatch '^(http|assets/|/assets|lucide|className|px-|py-|flex|text-|bg-|rounded|justify|items|w-|h-|font|border|hover|transition|shadow|animate)') {
        $phrases += $val
    }
}

$phrases | Select-Object -Unique | Set-Content -Path 'chunk2_phrases.txt'
Write-Host "Extracted $($phrases.Count) unique phrases"
