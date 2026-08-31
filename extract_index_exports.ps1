$raw = Get-Content 'index-m7tqU0Td.js' -Raw
$matches = [regex]::Matches($raw, 'export\s*\{[^}]+\}')
foreach ($m in $matches) {
    Write-Host $m.Value
}
