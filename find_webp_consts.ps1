$raw = Get-Content 'readable_bundle.js' -Raw
$matches = [regex]::Matches($raw, 'const\s+[a-zA-Z0-9_$]+\s*=\s*"[^"]+\.webp"')
foreach ($m in $matches) {
    Write-Host $m.Value
}
