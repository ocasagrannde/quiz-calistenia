$raw = Get-Content 'readable_chunk2.js' -Raw

$idx = $raw.IndexOf("Ko=({")
if ($idx -ge 0) {
    $code = $raw.Substring($idx, [Math]::Min(25000, $raw.Length - $idx))
    $code | Set-Content -Path 'vsl_offer_full.txt'
    Write-Host "Extracted full VSL offer code to vsl_offer_full.txt"
}
