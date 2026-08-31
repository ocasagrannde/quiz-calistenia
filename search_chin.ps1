$raw = Get-Content 'readable_chunk2.js' -Raw
$matches = [regex]::Matches($raw, '.{0,50}(?:queixo|chin|duplo).{0,50}')
foreach ($m in $matches) {
    Write-Host $m.Value
}
