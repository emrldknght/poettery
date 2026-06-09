#!/bin/bash

# Пути (если скрипт лежит в корне поэтари, то так)
CONTENT_DIR="./content"
OUTPUT_FILE="./all_poems.md"

# Очищаем выходной файл
echo "# Все стихи сборника" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Проходим по всем .md файлам в папке content, сортируем по имени
for file in $(ls "$CONTENT_DIR"/*.md | sort); do
    # Получаем имя файла без расширения и пути
    POEM_TITLE=$(basename "$file" .md)

    # Убираем front matter (всё что между --- --- в начале файла)
    # и сохраняем остаток
    sed -n '/^---$/,/^---$/d; /^---$/d; p' "$file" > /tmp/poem_content.tmp

    # Добавляем заголовок
    echo "## $POEM_TITLE" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"

    # Добавляем содержимое стиха
    cat /tmp/poem_content.tmp >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"

    # Добавляем разделитель
    echo "---" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
done

# Убираем временный файл
rm -f /tmp/poem_content.tmp

echo "✅ Готово! Стихи собраны в $OUTPUT_FILE"