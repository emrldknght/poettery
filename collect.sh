#!/bin/bash

# Пути
CONTENT_DIR="./content"
OUTPUT_FILE="./all_poems.md"

# Очищаем выходной файл
echo "# Все стихи сборника" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Находим все .md файлы рекурсивно, исключая папку arh (если нужно)
# Вариант 1: собираем ВСЕ файлы, включая arh
find "$CONTENT_DIR" -name "*.md" | sort | while read -r file; do
    # Получаем относительный путь без ./content/ и без расширения
    REL_PATH="${file#$CONTENT_DIR/}"
    POEM_TITLE="${REL_PATH%.md}"

    # Убираем front matter
    sed -n '/^---$/,/^---$/d; /^---$/d; p' "$file" > /tmp/poem_content.tmp

    # Добавляем заголовок (с вложенностью, например arh/esenin)
    echo "## $POEM_TITLE" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"

    # Добавляем содержимое стиха
    cat /tmp/poem_content.tmp >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "---" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
done

rm -f /tmp/poem_content.tmp

echo "✅ Готово! Стихи собраны в $OUTPUT_FILE"