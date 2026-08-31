$raw = Get-Content 'readable_chunk2.js' -Raw
$matches = [regex]::Matches($raw, '(?:ut|xt|ht|Ne|pt|ft|gt)=[^,;\n]+')
foreach ($m in $matches) {
    Write-Host $m.Value
}
