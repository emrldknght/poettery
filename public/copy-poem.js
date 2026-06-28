function copyPoem() {
  // Берём сырой текст из пропсов
  // const rawText = { JSON.stringify(rawContent || '') };
  const copyBtn = document.getElementById('copyBtn');

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        const contentRoot = document.getElementById('contentRoot');

        if (!contentRoot) {
          console.warn('no content root element');
          return;
        }

        const rawText = contentRoot.textContent;
        if (!rawText) {
          console.warn('no rawText content');
          return;
        }

        await navigator.clipboard.writeText(rawText);

        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Скопировано!';
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2000);
      } catch (err) {
        alert('Не удалось скопировать');
      }
    });
  } else {
    console.warn('no copyBtn');
  }
}
copyPoem();