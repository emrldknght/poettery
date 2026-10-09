$folder = 'content'
$excludeFolders = @('node_modules', '.git', 'temp', 'bin', 'obj', 'horned')  # папки, которые не нужно обходить

# $folder = (Read-Host 'input dir').Trim('"')

if (-not (Test-Path -LiteralPath $folder -PathType Container)) {
    Write-Host "dir not found: $folder"
} else {
    $total = 0
    $pub = 0
    $noPub = 0

    Get-ChildItem -LiteralPath $folder -Recurse -File -Filter '*.md' |
        Where-Object {
            # проверяем, что ни один из сегментов пути не входит в список исключений
            $relative = $_.FullName.Substring((Resolve-Path -LiteralPath $folder).Path.Length).TrimStart('\', '/')
            $segments = $relative -split '[\\/]'
            -not ($segments | Where-Object { $excludeFolders -contains $_ })
        } |
        ForEach-Object {
            $total++
            if (Select-String -LiteralPath $_.FullName -SimpleMatch -Pattern 'pub-in' -Quiet) {
                $pub++
            } else {
                $noPub++
                $_.FullName
            }
        }

    Write-Host ""
    Write-Host "total:  $total"
    Write-Host "pub:    $pub"
    Write-Host "no pub: $noPub"
}

Read-Host 'press Enter'