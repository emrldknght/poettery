#!/bin/bash
# Пути
CONTENT_DIR="./content"
OUTPUT_FILE="./all_poems.md"

# Папки для исключения (добавляй/убирай по необходимости)
EXCLUDE_DIRS=("horned") #  "drafts" "trash"

# Формируем аргументы для find
PRUNE_ARGS=()
for dir in "${EXCLUDE_DIRS[@]}"; do
    PRUNE_ARGS+=( -name "$dir" -o )
done
# Убираем последний лишний "-o"
unset 'PRUNE_ARGS[${#PRUNE_ARGS[@]}-1]'

# Очищаем выходной файл
echo "# Все стихи сборника" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Находим все .md файлы, исключая папки из EXCLUDE_DIRS
find "$CONTENT_DIR" -type d \( "${PRUNE_ARGS[@]}" \) -prune -o -name "*.md" -print | sort | while read -r file; do
    # Получаем относительный путь без ./content/ и без расширения
    REL_PATH="${file#$CONTENT_DIR/}"
    POEM_TITLE="${REL_PATH%.md}"

    # Убираем front matter
    sed -n '/^---$/,/^---$/d; /^---$/d; p' "$file" > /tmp/poem_content.tmp

    # Добавляем заголовок
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