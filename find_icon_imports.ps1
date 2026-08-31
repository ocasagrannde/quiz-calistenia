$raw = Get-Content 'readable_chunk2.js' -Raw

# Search for imports at the top of chunk2 or bundle to see which Lucide icons are imported
$imports = [regex]::Matches($raw, 'import\{([^}]+)\}from') | ForEach-Object { $_.Groups[1].Value }
Write-Host "Imports in chunk2:"
$imports | ForEach-Object { Write-Host $_ }

# Also search index-bundle.js imports
$bundleRaw = Get-Content 'index-bundle.js' -Raw
$bundleImports = [regex]::Matches($bundleRaw, 'import\{([^}]+)\}from') | ForEach-Object { $_.Groups[1].Value }
Write-Host "`nImports in bundle:"
$bundleImports | ForEach-Object { Write-Host $_ }
