$raw = Get-Content 'readable_chunk2.js' -Raw
$matches = [regex]::Matches($raw, 'import\s+([a-zA-Z0-9_$]+)\s+from\s*"([^"]+)"')
foreach ($m in $matches) {
    if ($m.Groups[2].Value -like '*assets*') {
        Write-Host "$($m.Groups[1].Value) = $($m.Groups[2].Value)"
    }
}
