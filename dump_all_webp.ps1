$raw = Get-Content 'readable_bundle.js' -Raw
$matches = [regex]::Matches($raw, '[a-zA-Z0-9_-]+\.webp')
foreach ($m in $matches) {
    Write-Host $m.Value
}
