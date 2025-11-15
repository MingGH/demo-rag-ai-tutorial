export function clientJS() {
  return `const noteTextEl = document.getElementById('noteText');
const noteStatusEl = document.getElementById('noteStatus');
const notesListEl = document.getElementById('notesList');
const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');

function escapeHtml(str) { return str.replace(/[&<>\"]/g, function(s){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'})[s]; }).replace(/'/g,'&#39;'); }

async function loadNotes() {
  try {
    const res = await fetch('/notes');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    notesListEl.innerHTML = '';
    data.forEach(function(n){
      const li = document.createElement('li');
      li.innerHTML = '<div class="note-text">' + escapeHtml(n.text) + '</div>' +
                      '<div class="note-actions">' +
                        '<span class="note-id">#' + n.id + '</span>' +
                        '<button class="danger" data-id="' + n.id + '">删除</button>' +
                      '</div>';
      li.querySelector('button').onclick = function(){ deleteNote(n.id); };
      notesListEl.appendChild(li);
    });
  } catch (e) {
    notesListEl.innerHTML = '<li>加载失败</li>';
  }
}

async function addNote() {
  const text = noteTextEl.value.trim();
  if (!text) { noteStatusEl.textContent = '请输入文本'; return; }
  try {
    noteStatusEl.textContent = '请求中...';
    const res = await fetch('/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: text }) });
    const msg = await res.text();
    noteStatusEl.textContent = msg;
    noteTextEl.value = '';
    await loadNotes();
  } catch (e) {
    noteStatusEl.textContent = '请求失败';
  }
}

async function deleteNote(id) {
  try {
    await fetch('/notes/' + id, { method: 'DELETE' });
    await loadNotes();
  } catch (e) {}
}

async function ask() {
  const q = questionEl.value.trim();
  try {
    answerEl.textContent = '请求中...';
    const res = await fetch('/?text=' + encodeURIComponent(q || ''));
    const txt = await res.text();
    const model = res.headers.get('x-model-used') || '';
    answerEl.textContent = txt + (model ? '\n\n模型: ' + model : '');
  } catch (e) {
    answerEl.textContent = '请求失败';
  }
}

document.getElementById('addBtn').onclick = addNote;
document.getElementById('askBtn').onclick = ask;
loadNotes();`;
}