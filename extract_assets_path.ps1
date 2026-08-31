$raw = Get-Content 'readable_chunk2.js' -Raw
$matches = [regex]::Matches($raw, 'assets/[a-zA-Z0-9_-]+\.(?:webp|png|jpg)')
foreach ($m in $matches) {
    Write-Host $m.Value
}
