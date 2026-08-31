$raw = Get-Content 'readable_chunk2.js' -Raw
$matches = [regex]::Matches($raw, '.{0,60}(?:Perguntamos sua idade|Digite sua idade|percentual de gordura).{0,60}')
foreach ($m in $matches) {
    Write-Host $m.Value
}
