[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12 -bor [System.Net.SecurityProtocolType]::Tls13
$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "HTTP Server listening on http://localhost:$port/"

$root = Get-Location
$script:cachedJson = $null
$script:lastFetch = [DateTime]::MinValue

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        try {
            $path = $request.Url.LocalPath
            if ($path -eq "/") { $path = "/index.html" }
            
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            $response.Headers.Add("Access-Control-Allow-Headers", "*")
            $response.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0")
            $response.Headers.Add("Pragma", "no-cache")
            $response.Headers.Add("Expires", "0")

            if ($request.HttpMethod -eq "OPTIONS") {
                $response.StatusCode = 200
                $response.Close()
                continue
            }

            if ($path -eq "/api/posthog") {
                $now = [DateTime]::UtcNow
                # Cache de 10 segundos para velocidade ultra rápida e zero travamento
                if ($script:cachedJson -ne $null -and ($now - $script:lastFetch).TotalSeconds -lt 10) {
                    $json = $script:cachedJson
                } else {
                    try {
                        $posthogKey = "phx_Cac6WXZncXX658HzhjGh9koqbT7RDcUjSsBSABoKHsf2Ax9x"
                        $projId = "587018"
                        $url = "https://us.i.posthog.com/api/projects/$projId/events/?limit=100"
                        
                        $req = [System.Net.HttpWebRequest]::Create($url)
                        $req.Headers.Add("Authorization", "Bearer $posthogKey")
                        $req.UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
                        $req.Timeout = 8000
                        $req.ReadWriteTimeout = 8000
                        
                        $resp = $req.GetResponse()
                        $stream = $resp.GetResponseStream()
                        $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
                        $json = $reader.ReadToEnd()
                        $reader.Close()
                        $resp.Close()

                        $script:cachedJson = $json
                        $script:lastFetch = $now
                    } catch {
                        if ($script:cachedJson -ne $null) {
                            $json = $script:cachedJson
                        } else {
                            $json = "{`"results`":[], `"error`": `"$($_.Exception.Message)`"}"
                        }
                    }
                }

                $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
                $response.ContentType = "application/json; charset=utf-8"
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                $response.Close()
                continue
            }

            $localPath = Join-Path $root $path
            
            if (Test-Path $localPath) {
                $bytes = [System.IO.File]::ReadAllBytes($localPath)
                
                if ($path.EndsWith(".html")) { $response.ContentType = "text/html; charset=utf-8" }
                elseif ($path.EndsWith(".css")) { $response.ContentType = "text/css" }
                elseif ($path.EndsWith(".js")) { $response.ContentType = "application/javascript" }
                elseif ($path.EndsWith(".jpg") -or $path.EndsWith(".jpeg")) { $response.ContentType = "image/jpeg" }
                elseif ($path.EndsWith(".png")) { $response.ContentType = "image/png" }
                elseif ($path.EndsWith(".svg")) { $response.ContentType = "image/svg+xml" }
                
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $response.StatusCode = 404
            }
        } finally {
            $response.Close()
        }
    } catch {
        # ignore context errors
    }
}
