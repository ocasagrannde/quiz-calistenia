$raw = Get-Content 'index-chunk2.js' -Raw

# Write a script that searches for JSX patterns like h1, p, button text, step number, images, options arrays
# Let's save a structured breakdown of each step

$output = @()

# We can search for all occurrences of step:X or totalSteps
$matches = [regex]::Matches($raw, 'step:\s*\d+[^}]*')

Write-Host "Found $($matches.Count) step JSX blocks"

# Let's search for all step components and their texts
$phrasesFile = Get-Content 'chunk2_phrases.txt'

# Let's filter phrases that are Portuguese titles, questions, or option labels
$quizTexts = $phrasesFile | Where-Object { 
    $_ -match '^(Qual|Quant|Como|Você|Seu|Sua|De acordo|TESTE|Programa|Alerta|Melhorar|Próximo|Continuar|Barriga|Braços|Pernas|Costas| Nádegas|Queixo|Seios|Joelhos|Traseiro|Coxa|Magra|Acima|Sobrepeso|Obesa|Sedentária|Moderada|Ativa|Sem|Vegano|Vegetariano|Sim|Não|Garantia|Bônus|Desconto|R\$|Oferta|Depoimento|Carla|Fernanda|Juliana|Beatriz)' -or
    $_ -match '\?' -or
    ($_ -match '[áéíóúãõâêôç]' -and $_.Length -gt 15)
}

$quizTexts | Select-Object -Unique | Set-Content -Path 'final_extracted_copy.txt'
Write-Host "Extracted $($quizTexts.Count) key quiz copy lines to final_extracted_copy.txt"
