Add-Type -AssemblyName System.Drawing

$srcPath = "C:\ServiceApp\src\assets\images\gobi360_appicon.jpg"
$src = [System.Drawing.Image]::FromFile($srcPath)

$icons = @(
    [PSCustomObject]@{ dir = "mipmap-mdpi";    size = 48 },
    [PSCustomObject]@{ dir = "mipmap-hdpi";    size = 72 },
    [PSCustomObject]@{ dir = "mipmap-xhdpi";   size = 96 },
    [PSCustomObject]@{ dir = "mipmap-xxhdpi";  size = 144 },
    [PSCustomObject]@{ dir = "mipmap-xxxhdpi"; size = 192 }
)

foreach ($icon in $icons) {
    $sz  = $icon.size
    $dir = "C:\ServiceApp\android\app\src\main\res\$($icon.dir)"
    $bmp = New-Object System.Drawing.Bitmap($sz, $sz)
    $g   = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($src, 0, 0, $sz, $sz)
    $g.Dispose()
    $bmp.Save("$dir\ic_launcher.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Save("$dir\ic_launcher_round.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Done: $($icon.dir)"
}

$src.Dispose()
Write-Host "All icons replaced successfully!"
