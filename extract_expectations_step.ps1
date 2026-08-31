$raw = Get-Content 'readable_chunk2.js' -Raw
$idx = $raw.IndexOf('O que mais voc')
if ($idx -ge 0) {
    $start = [Math]::Max(0, $idx - 500)
    $len = [Math]::Min(2000, $raw.Length - $start)
    $code = $raw.Substring($start, $len)
    Write-Host $code
}
