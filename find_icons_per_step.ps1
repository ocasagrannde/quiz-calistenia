$raw = Get-Content 'readable_chunk2.js' -Raw

# Search for Lucide icon usages like e.jsx(IconName, ...) or Lucide component names
# Common Lucide icons in React apps: Flame, Target, Sparkles, Check, Clock, ShieldCheck, Zap, Droplets, Moon, Dumbbell, AlertTriangle, Heart, User, Calendar
$icons = [regex]::Matches($raw, '(lucide-[a-z0-9-]+|[A-Z][a-zA-Z0-9]+Icon|Icon[A-Z][a-zA-Z0-9]+)') | ForEach-Object { $_.Value } | Select-Object -Unique

Write-Host "Found Lucide/Icon identifiers:"
$icons | ForEach-Object { Write-Host $_ }

# Also search for emoji unicode escapes like \uD83C or \u26A0 or HTML entities
$escapes = [regex]::Matches($raw, '\\u[0-9a-fA-F]{4}') | ForEach-Object { $_.Value } | Select-Object -Unique
Write-Host "`nFound Unicode escapes ($($escapes.Count)):"
$escapes | Select-Object -First 30 | ForEach-Object { Write-Host $_ }
