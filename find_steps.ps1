$content = Get-Content 'readable_bundle.js' -Raw

$matches = [regex]::Matches($content, '"([^"\\]|\\.)*"|''([^''\\]|\\.)*''')

$phrases = @()
foreach ($m in $matches) {
    $str = $m.Value.Trim('"''')
    if ($str.Length -gt 15) {
        if ($str -notmatch 'lucide|className|http|/assets|px-|py-|flex|text-|bg-|rounded|justify|items|w-|h-|font|border|hover|transition|shadow|animate') {
            $phrases += $str
        }
    }
}

$phrases | Select-Object -Unique | Set-Content -Path 'all_quiz_phrases.txt'
Write-Host "Found $($phrases.Count) phrases"
