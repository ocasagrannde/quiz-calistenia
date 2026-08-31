$raw = Get-Content 'readable_chunk2.js' -Raw

# Search for Step34Offer or function Ko in readable_chunk2.js
$idx = $raw.IndexOf("Ko=({")
if ($idx -lt 0) {
    $idx = $raw.IndexOf("Ko=")
}

if ($idx -ge 0) {
    $code = $raw.Substring($idx, [Math]::Min(12000, $raw.Length - $idx))
    $code | Set-Content -Path 'vsl_offer_extracted.txt'
    Write-Host "Extracted VSL offer code to vsl_offer_extracted.txt"
} else {
    Write-Host "Could not find Ko= pattern directly, searching for Ko keywords..."
    $lines = Get-Content 'readable_chunk2.js' | Select-String -Pattern 'Assista ao vídeo|O que você vai receber|Aplicativo Calistenia|Desconto válido|Garantia Incondicional'
    $lines | ForEach-Object { Write-Host $_.Line }
}
