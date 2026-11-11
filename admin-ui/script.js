const DRAFT_KEY = 'poettery-draft';
const form = document.getElementById('adminForm');
const msg = document.getElementById('message');
const btn = document.getElementById('saveBtn');
const draftStatus = document.getElementById('draftStatus');

const fields = ['slug', 'folder', 'title', 'date', 'layout', 'review', 'content'];
const el = (name) => form.elements[name];

function todayParts() {
    const now = new Date();
    return {
        date: now.toISOString().split('T')[0],
        folder: `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`,
    };
}

function getFormData() {
    return Object.fromEntries(fields.map(f => [f, el(f).value]));
}

function fillForm(data) {
    fields.forEach(f => { if (data[f] !== undefined) el(f).value = data[f]; });
}

let saveTimer;
function scheduleDraftSave() {
    clearTimeout(saveTimer);
    draftStatus.textContent = '✏️ есть несохранённые правки…';
    saveTimer = setTimeout(() => {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(getFormData()));
        const t = new Date().toLocaleTimeString('ru-RU');
        draftStatus.textContent = `🗂 черновик сохранён локально в ${t}`;
    }, 400);
}

form.addEventListener('input', scheduleDraftSave);

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(location.search);
    const fileToLoad = params.get('file');

    if (fileToLoad) {
        const r = await fetch(`/admin-load?file=${encodeURIComponent(fileToLoad)}`);
        if (r.ok) {
            fillForm(await r.json());
            localStorage.setItem(DRAFT_KEY, JSON.stringify(getFormData()));
            draftStatus.textContent = `📂 загружен ${fileToLoad}`;
            return;
        }
    }

    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
        try {
            fillForm(JSON.parse(saved));
            draftStatus.textContent = '♻️ черновик восстановлен';
            return;
        } catch {}
    }
    const { date, folder } = todayParts();
    el('date').value = date;
    el('folder').value = folder;
});

async function saveFile() {
    btn.disabled = true;
    btn.textContent = 'Сохранение...';
    try {
        const response = await fetch('/admin-save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(getFormData()),
        });
        const result = await response.json();

        msg.style.display = 'block';
        if (response.ok) {
            msg.style.background = '#d4edda';
            msg.style.color = '#155724';
            msg.textContent = `✅ Сохранено: ${result.path}`;
            localStorage.setItem(DRAFT_KEY, JSON.stringify(getFormData()));
            draftStatus.textContent = '💾 записано на диск';
        } else {
            msg.style.background = '#f8d7da';
            msg.style.color = '#721c24';
            msg.textContent = `❌ ${result.error}`;
        }
    } catch {
        msg.style.display = 'block';
        msg.style.background = '#f8d7da';
        msg.style.color = '#721c24';
        msg.textContent = '❌ Ошибка сети (админка запущена?)';
    } finally {
        btn.disabled = false;
        btn.textContent = '💾 Сохранить';
    }
}

form.addEventListener('submit', (e) => { e.preventDefault(); saveFile(); });

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveFile();
    }
});

document.getElementById('newBtn').addEventListener('click', () => {
    if (!confirm('Очистить форму и черновик?')) return;
    localStorage.removeItem(DRAFT_KEY);
    form.reset();
    const { date, folder } = todayParts();
    el('date').value = date;
    el('folder').value = folder;
    msg.style.display = 'none';
    draftStatus.textContent = '🆕 новый файл';
    history.replaceState(null, '', '/');
    el('slug').focus();
});