$raw = Get-Content 'readable_chunk2.js' -Raw
$idx = $raw.IndexOf('Digite sua idade')
if ($idx -ge 0) {
    $code = $raw.Substring([Math]::Max(0, $idx - 500), 1200)
    Write-Host $code
}
