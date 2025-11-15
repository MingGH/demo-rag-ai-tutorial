export function renderUI() {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>RAG 个人知识库</title>
  <style>
    :root { --bg:#0f172a; --card:#111827; --text:#e5e7eb; --muted:#9ca3af; --accent:#22c55e; --danger:#ef4444; }
    * { box-sizing: border-box; }
    body { margin:0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; background: var(--bg); color: var(--text); }
    header { padding: 24px; text-align: center; font-weight: 700; font-size: 20px; background: linear-gradient(90deg,#22c55e33,#22c55e11); }
    .container { max-width: 960px; margin: 0 auto; padding: 24px; display: grid; gap: 24px; }
    .card { background: var(--card); border: 1px solid #1f2937; border-radius: 12px; padding: 16px; }
    .card h2 { margin: 0 0 12px; font-size: 18px; }
    textarea, input[type="text"] { width: 100%; background: #0b1220; color: var(--text); border: 1px solid #1f2937; border-radius: 8px; padding: 10px; outline: none; }
    textarea { min-height: 100px; }
    .row { display: flex; gap: 12px; align-items: center; }
    button { background: var(--accent); color: #0a0f1c; border: none; padding: 10px 14px; border-radius: 8px; font-weight: 600; cursor: pointer; }
    button.danger { background: var(--danger); color: #fff; }
    .status { color: var(--muted); font-size: 14px; margin-top: 8px; white-space: pre-wrap; }
    ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
    li { display: grid; grid-template-columns: 1fr auto; gap: 8px; align-items: start; background: #0b1220; border: 1px solid #1f2937; border-radius: 10px; padding: 12px; }
    .note-text { white-space: pre-wrap; word-break: break-word; }
    .note-actions { display: flex; gap: 8px; align-items: center; }
    .note-id { color: var(--muted); font-size: 12px; }
    .answer { white-space: pre-wrap; background: #0b1220; border: 1px solid #1f2937; border-radius: 10px; padding: 12px; min-height: 80px; }
  </style>
</head>
<body>
  <header>RAG 个人知识库</header>
  <div class="container">
    <div class="card">
      <h2>添加笔记</h2>
      <textarea id="noteText" placeholder="输入要保存的内容"></textarea>
      <div class="row">
        <button id="addBtn">提交</button>
        <div id="noteStatus" class="status"></div>
      </div>
    </div>
    <div class="card">
      <h2>已保存笔记</h2>
      <ul id="notesList"></ul>
    </div>
    <div class="card">
      <h2>向 AI 提问</h2>
      <input id="question" type="text" placeholder="输入问题，如：Python 是什么" />
      <div class="row">
        <button id="askBtn">提问</button>
      </div>
      <div id="answer" class="answer"></div>
    </div>
  </div>
  <script src="/assets/ui.js" defer></script>
</body>
</html>`;
}