// ❓ 查询向量数据库
export async function handleQuery(c) {
	const question = c.req.query("text") ;

	// 1️⃣ 创建查询嵌入向量
	const embeddings = await c.env.AI.run("@cf/baai/bge-base-en-v1.5", {
		text: question,
	});
	const queryVector = embeddings.data[0];

	// 2️⃣ 查询向量数据库
	const vectorQuery = await c.env.VECTORIZE.query(queryVector, { topK: 1 });
	const match = vectorQuery.matches?.[0];
	const vecId = match?.id;

	// 3️⃣ 从D1数据库检索匹配的笔记
	let notes = [];
	if (vecId) {
		const query = "SELECT * FROM notes WHERE id = ?";
		const { results } = await c.env.DB.prepare(query).bind(vecId).run();
		if (results) notes = results.map((r) => r.text);
	}

	// 4️⃣ 使用上下文构建提示词
	const contextMessage = notes.length
		? `上下文:\n${notes.map((n) => `- ${n}`).join("\n")}`
		: "";
	const systemPrompt = "在回答问题时，如果相关，请使用提供的上下文。";

	// 5️⃣ 使用Workers AI生成响应
	const model = "@cf/meta/llama-3.1-8b-instruct";
	const response = await c.env.AI.run(model, {
		messages: [
			...(notes.length ? [{ role: "system", content: contextMessage }] : []),
			{ role: "system", content: systemPrompt },
			{ role: "user", content: question },
		],
	});

	c.header("x-model-used", model);
	return c.text(response?.response || "无响应", response ? 200 : 500);
}
