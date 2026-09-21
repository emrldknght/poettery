# Скрипт для поиска .md файлов без --- в начале
$path = "."  # текущая папка, или укажите свой путь, например "C:\Users\YourName\Documents"

# Рекурсивно ищем все .md файлы
$mdFiles = Get-ChildItem -Path $path -Recurse -Filter "*.md"

$count = 0
$filesWithoutFrontmatter = @()

foreach ($file in $mdFiles) {
    # Читаем первые 5 строк файла (обычно frontmatter в первых строках)
    $firstLines = Get-Content -Path $file.FullName -TotalCount 5 -ErrorAction SilentlyContinue

    # Проверяем, начинается ли файл с ---
    if ($firstLines -and $firstLines[0] -eq "---") {
        # Есть frontmatter - пропускаем
        continue
    } else {
        # Нет frontmatter - добавляем в список
        $filesWithoutFrontmatter += $file.FullName
        $count++
        Write-Host "❌ Нет frontmatter: $($file.FullName)" -ForegroundColor Yellow
    }
}

# Выводим итог
Write-Host "`n======================" -ForegroundColor Cyan
Write-Host "📊 ИТОГ:" -ForegroundColor Cyan
Write-Host "Всего .md файлов: $($mdFiles.Count)" -ForegroundColor White
Write-Host "Файлов БЕЗ '---': $count" -ForegroundColor Red

if ($count -gt 0) {
    Write-Host "`n📝 Список файлов без frontmatter:" -ForegroundColor Yellow
    $filesWithoutFrontmatter | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
}