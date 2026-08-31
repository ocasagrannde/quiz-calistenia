$raw = Get-Content 'index-bundle.js' -Raw

# Search for strings in quotes or JSX content, component names, step titles
# Let's inspect step components in index-bundle.js
# We can search for text snippets like "Ao escolher sua idade", "Idade", "Qual seu objetivo", etc.

$lines = Get-Content 'readable_bundle.js'
$matches = $lines | Select-String -Pattern '(title|subtitle|headline|opcoes|options|step|etapa|Pergunta|Qual|Como|Você|Seu|Sua)'
Write-Host "Matched lines count: $($matches.Count)"

# Let's write a script that dumps all string constants > 15 chars that look like Portuguese text
$stringMatches = [regex]::Matches($raw, '"([^"\\]|\\.)*"|''([^''\\]|\\.)*''|`([^`\\]|\\.)*`')
$ptStrings = @()
foreach ($m in $stringMatches) {
    $val = $m.Value.Trim('"''`')
    if ($val.Length -gt 12 -and $val -match '[áéíóúãõâêôçA-Za-z]') {
        if ($val -notmatch '^(http|assets/|/assets|var|function|return|import|export|class|const|let|default|react)') {
            $ptStrings += $val
        }
    }
}

$ptStrings | Select-Object -Unique | Set-Content -Path 'extracted_texts.txt'
Write-Host "Extracted $($ptStrings.Count) text strings to extracted_texts.txt"
