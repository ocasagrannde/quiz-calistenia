$raw = Get-Content 'readable_chunk2.js' -Raw
$idx = $raw.IndexOf('O que mais voc')
if ($idx -ge 0) {
    $start = [Math]::Max(0, $idx - 2000)
    $code = $raw.Substring($start, 2500)
    Write-Host $code
}
