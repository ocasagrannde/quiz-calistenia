$raw = Get-Content 'readable_chunk2.js' -Raw
$matches = [regex]::Matches($raw, '"[^"]+\.(?:webp|png|jpg)"')
foreach ($m in $matches) {
    Write-Host $m.Value
}
