$raw = Get-Content 'readable_bundle.js' -Raw
$matches = [regex]::Matches($raw, 'export\s*\{[^}]+\}')
foreach ($m in $matches) {
    Write-Host $m.Value
}
