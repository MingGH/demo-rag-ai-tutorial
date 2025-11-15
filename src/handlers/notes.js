// 📝 添加新笔记
export async function createNote(c) {
	const { text } = await c.req.json();
	if (!text) return c.text("缺少文本内容", 400);

	await c.env.DEMO_RAG_WORKFLOW.create({ params: { text } });
	return c.text("已创建笔记", 201);
}

// 🗑️ 删除笔记及对应向量
export async function deleteNote(c) {
	const { id } = c.req.param();
	await c.env.DB.prepare("DELETE FROM notes WHERE id = ?").bind(id).run();
	await c.env.VECTORIZE.deleteByIds([id]);
	return c.status(204);
}
