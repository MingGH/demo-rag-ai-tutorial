import { WorkflowEntrypoint } from "cloudflare:workers";
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

// -------------------- RAG 工作流 --------------------

export class RAGWorkflow extends WorkflowEntrypoint {
	async run(event, step) {
		const env = this.env;
		const { text } = event.payload;

		// 1️⃣ 将文本分割为块，以便处理大文档
		const texts = await step.do("分割文本", async () => {
			const splitter = new RecursiveCharacterTextSplitter();
			const output = await splitter.createDocuments([text]);
			return output.map((doc) => doc.pageContent);
		});

		console.log(`已分割为 ${texts.length} 个块`);

		// 2️⃣ 对于每个块：插入 → 嵌入 → 更新向量库
		for (const index in texts) {
			const chunk = texts[index];

			const record = await step.do(
				`创建数据库记录 ${index}/${texts.length}`,
				async () => {
					const query = "INSERT INTO notes (text) VALUES (?) RETURNING *";
					const { results } = await env.DB.prepare(query).bind(chunk).run();
					const record = results[0];
					if (!record) throw new Error("未能创建笔记");
					return record;
				}
			);

			const embedding = await step.do(
				`生成嵌入向量 ${index}/${texts.length}`,
				async () => {
					const embeddings = await env.AI.run("@cf/baai/bge-base-en-v1.5", {
						text: chunk,
					});
					const values = embeddings.data[0];
					if (!values) throw new Error("未能生成嵌入向量");
					return values;
				}
			);

			await step.do(`插入向量 ${index}/${texts.length}`, async () => {
				return env.VECTORIZE.upsert([
					{ id: record.id.toString(), values: embedding },
				]);
			});
		}
	}
}
