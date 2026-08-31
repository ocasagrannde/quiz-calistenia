$baseUrl = "https://calisteniaasiaticavslbr.lovable.app"
$assetsDir = "assets"

if (!(Test-Path $assetsDir)) {
    New-Item -ItemType Directory -Path $assetsDir | Out-Null
}

$images = @(
    "/images/asian-woman-fitness.webp",
    "/assets/women-group-new-Dm6Dh7Zz.webp",
    "/assets/woman-calisthenics-CxC8mlGX.webp",
    "/assets/breasts-ExE0pzVF.webp",
    "/assets/belly-BpYW2VsZ.webp",
    "/assets/saddlebags-xkYTH-2j.webp",
    "/assets/barriga-DAcogUxf.webp",
    "/assets/pernas-DV7nbtv6.webp",
    "/assets/bracos-BmNkLcku.webp",
    "/assets/slim-BgG68MtM.webp",
    "/assets/mid-sized-C-245tK-.webp",
    "/assets/heavier-side-7tzmsUcd.webp",
    "/assets/overweight-oo35LK1h.webp",
    "/assets/curvy-Dbj8VQuI.webp",
    "/assets/thin-BWWpALK0.webp",
    "/assets/bikini-body-BG5HLQ1-.webp",
    "/assets/satisfied-DyDvcRJX.webp",
    "/assets/back-D2DUI9o8.webp",
    "/assets/knees-ankles-WZoJdNID.webp",
    "/assets/hip-E-F3cLZa.webp",
    "/assets/sedentary-cjyr6e_x.webp",
    "/assets/moderate-Bt8G1F_-.webp",
    "/assets/active-Bdp4d3Tt.webp",
    "/assets/woman-drinking-water-BLgcZVl1.webp",
    "/assets/woman-sleeping-DwdH-tAw.webp",
    "/assets/woman-sleeping-mobile-CwFeGCXZ.webp",
    "/assets/woman-confident-D8fE6pZZ.jpg",
    "/assets/woman-couch-exercise-DxhhEtty.webp",
    "/assets/woman-ok-asian-By6X2nVW.png",
    "/assets/woman-fitness-abs-loFQOyPd.webp",
    "/assets/woman-thumbsup-asian-BszG4iHy.webp",
    "/assets/woman-motivation-DOIROZwS.webp",
    "/assets/transformation-1-a90ZzNIx.webp",
    "/assets/transformation-2-Cx2QT2zW.webp",
    "/assets/transformation-3-D2ajMZTy.webp",
    "/assets/acima-do-peso-CtIe9m6Q.webp",
    "/assets/magra-C30qJhuO.webp",
    "/assets/em-forma-OQmnrtKV.webp",
    "/assets/sobrepeso-bhmL4RKX.webp",
    "/assets/obesa-DogS7G7T.webp",
    "/assets/carla-13kg-BHnYedbO.webp",
    "/assets/fernanda-14dias-BugOCibs.webp",
    "/assets/juliana-postura-D49AKHtf.webp",
    "/assets/beatriz-tonificado-Otd2-Vi6.webp",
    "/assets/garantia-30-dias-CrDEWC_J.webp",
    "/assets/gluten-free-BrMIw2nS.webp",
    "/assets/lactose-free-wsMFy0Rx.webp",
    "/assets/no-restrictions-BYq0nylU.webp",
    "/assets/vegan-DkoJywfO.webp",
    "/assets/vegetarian-BZpnuIQK.webp"
)

Write-Host "Starting download..."

$count = 0
foreach ($imgRel in $images) {
    $fileName = Split-Path $imgRel -Leaf
    $destPath = Join-Path $assetsDir $fileName
    $fullUrl = "$baseUrl$imgRel"
    
    try {
        Invoke-WebRequest -Uri $fullUrl -OutFile $destPath -UserAgent "Mozilla/5.0"
        Write-Host "DOWNLOADED: $fileName"
        $count++
    } catch {
        Write-Host "ERROR downloading $fullUrl : $($_.Exception.Message)"
    }
}

Write-Host "Finished: $count / $($images.Count) downloaded successfully."
