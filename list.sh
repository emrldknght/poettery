#!/bin/bash

CONTENT_DIR="./content"
OUTPUT_FILE="./list.md"

# Создаём файл
cat > "$OUTPUT_FILE" << 'EOF'
# Список всех стихов

EOF

# Находим все .md файлы рекурсивно, сортируем
find "$CONTENT_DIR" -name "*.md" | sort | while read -r file; do
    # Относительный путь
    rel_path="${file#$CONTENT_DIR/}"

    # Получаем название (из title или из имени файла)
    title=$(sed -n '/^---$/,/^---$/p' "$file" | grep -E '^title:' | sed 's/^title:\s*//' | head -1)

    if [ -z "$title" ]; then
        # Если нет title, берём имя файла без расширения
        title=$(basename "$file" .md)
    fi

    # Добавляем в список
    echo "- [$title]($rel_path)" >> "$OUTPUT_FILE"
done

echo "✅ Готово! Список сохранён в $OUTPUT_FILE"