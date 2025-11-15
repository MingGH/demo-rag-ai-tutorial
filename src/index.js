import { Hono } from "hono";
import { RAGWorkflow } from "./workflow.js";
import { handleQuery } from "./handlers/query.js";
import { createNote, deleteNote, listNotes } from "./handlers/notes.js";
import { renderUI } from "./ui.js";
import { clientJS } from "./ui.client.js";

// -------------------- 应用路由 --------------------

export { RAGWorkflow };

const app = new Hono();

// 路由定义
app.get("/", handleQuery);
app.post("/notes", createNote);
app.delete("/notes/:id", deleteNote);
app.get("/notes", listNotes);
app.get("/ui", (c) => c.html(renderUI()));
app.get("/assets/ui.js", (c) => c.text(clientJS(), 200, { "Content-Type": "application/javascript" }));

// ⚠️ 错误处理器
app.onError((err, c) => {
	console.error(err);
	return c.text("内部服务器错误", 500);
});

export default app;
