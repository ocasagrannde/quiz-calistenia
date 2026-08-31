$raw = Get-Content 'readable_chunk2.js' -Raw
$matches = [regex]::Matches($raw, '.{0,30}\but\s*=\s*[^;,]+')
foreach ($m in $matches) {
    Write-Host $m.Value
}
