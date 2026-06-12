#!/bin/bash

CONTENT_DIR="./content"
OUTPUT_FILE="./summary.md"

# Создаём заголовок таблицы
cat > "$OUTPUT_FILE" << 'EOF'
---
title: Оглавление сборника
---

# Оглавление сборника

| № | Файл | Заголовок | Первая строка |
|---|------|-----------|---------------|
EOF

counter=1

# Находим все .md файлы рекурсивно, сортируем
find "$CONTENT_DIR" -name "*.md" | sort | while read -r file; do
    # Относительный путь
    rel_path="${file#$CONTENT_DIR/}"

    # Вытаскиваем title из front matter
    title=$(sed -n '/^---$/,/^---$/p' "$file" | grep -E '^title:' | sed 's/^title:\s*//' | head -1)

    if [ -z "$title" ]; then
        title="❌ нет заголовка"
    fi

    # Убираем front matter и берём первую непустую строку (исключая ```text)
    first_line=$(sed -n '/^---$/,/^---$/d; /^```text$/d; /^```$/d; /^$/d; p' "$file" | head -1)

    # Обрезаем длинные строки
    if [ ${#first_line} -gt 60 ]; then
        first_line="${first_line:0:57}..."
    fi

    # Экранируем спецсимволы для Markdown
    first_line=$(echo "$first_line" | sed 's/|/\\|/g')
    title=$(echo "$title" | sed 's/|/\\|/g')

    # Добавляем строку в таблицу
    echo "| $counter | $rel_path | $title | $first_line |" >> "$OUTPUT_FILE"

    ((counter++))
done

echo "✅ Готово! Оглавление сохранено в $OUTPUT_FILE"