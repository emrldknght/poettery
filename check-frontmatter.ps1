param([string]$Path = ".")

Write-Host "Searching in: $Path" -ForegroundColor Cyan
Write-Host "Excluding: README.md, node_modules folder" -ForegroundColor Gray

# Ищем .md файлы, исключая node_modules и README.md
$mdFiles = Get-ChildItem -Path $Path -Recurse -Filter "*.md" -ErrorAction SilentlyContinue | Where-Object {
    $_.Name -notmatch "^readme\.md$" -and
    # $_.Directory.FullName -notmatch "node_modules"
    $_.Directory.FullName -notmatch "node_modules|\.git|dist|build|_site"
}

if ($mdFiles.Count -eq 0) {
    Write-Host "No .md files found!" -ForegroundColor Red
    Read-Host "Press Enter"
    exit
}

$filesWithoutFrontmatter = @()

foreach ($file in $mdFiles) {
    $firstLines = Get-Content -Path $file.FullName -TotalCount 5 -ErrorAction SilentlyContinue
    $hasFrontmatter = $false

    if ($firstLines) {
        foreach ($line in $firstLines) {
            if ($line -match "^---\s*$") {
                $hasFrontmatter = $true
                break
            }
        }
    }

    if (-not $hasFrontmatter) {
        $filesWithoutFrontmatter += $file.FullName
        Write-Host "Missing: $($file.Name)" -ForegroundColor Yellow
    }
}

Write-Host "`n======================" -ForegroundColor Cyan
Write-Host "Total .md files (excluding README & node_modules): $($mdFiles.Count)" -ForegroundColor White
Write-Host "Without '---': $($filesWithoutFrontmatter.Count)" -ForegroundColor Red

if ($filesWithoutFrontmatter.Count -gt 0) {
    Write-Host "`nPaths:" -ForegroundColor Yellow
    $filesWithoutFrontmatter | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
}

# Read-Host "`nPress Enter"