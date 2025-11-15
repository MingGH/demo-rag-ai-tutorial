# RAG 个人知识库系统

基于 Cloudflare Workers AI 构建的个人知识库系统，使用 RAG（检索增强生成）技术实现智能问答。

## 项目背景

AI 可以基于你输入的知识提供更加个性化和准确的回答。

参考文章：https://developers.cloudflare.com/workers-ai/guides/tutorials/build-a-retrieval-augmented-generation-ai/

## 快速开始

### 1. 安装依赖

```bash
yarn install
```

### 2. 创建 D1 数据库

```bash
# 创建数据库
npx wrangler d1 create demo-rag-db

# 创建表结构
npx wrangler d1 execute demo-rag-db --remote --command "CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT NOT NULL)"
```

### 3. 创建 Vectorize 索引

```bash
npx wrangler vectorize create demo-rag-index --dimensions=768 --metric=cosine
```

### 4. 更新配置

将创建的数据库 ID 更新到 `wrangler.toml` 中的 `database_id` 字段。

## 本地开发

```bash
yarn dev
```

服务将在本地启动，默认地址：http://localhost:8787

## API 使用

### 添加笔记

```bash
curl -X POST http://localhost:8787/notes \
  -H "Content-Type: application/json" \
  -d '{"text": "Python 是一种高级编程语言，以其简洁的语法和强大的功能而闻名。"}'
```

### 查询知识库

```bash
# 使用 URL 参数
curl "http://localhost:8787/?text=什么是Python"

# 或直接访问（使用默认问题）
curl http://localhost:8787/
```

### 获取笔记列表

```bash
curl http://localhost:8787/notes
```

### 删除笔记

```bash
curl -X DELETE http://localhost:8787/notes/1
```

## 工作原理

### 添加笔记流程

1. 接收文本内容
2. 使用 LangChain 将长文本分割成多个块
3. 对每个文本块：
   - 存储到 D1 数据库
   - 生成嵌入向量
   - 将向量存储到 Vectorize

### 查询流程

1. 接收用户问题
2. 将问题转换为嵌入向量
3. 在 Vectorize 中搜索最相似的向量
4. 从 D1 数据库检索对应的文本内容
5. 将检索到的内容作为上下文，结合用户问题
6. 使用 LLM 生成回答

## 部署

```bash
npx wrangler deploy

```

部署后，你的RAG 个人知识库应用将运行在 Cloudflare 的全球边缘网络上。

## 开发

```bash
yarn dev

```

## 前端界面

- 访问 `http://localhost:8787/ui`
- 功能：
  - 提交笔记到后端接口 `POST /notes`
  - 查看并删除当前已保存的笔记 `GET /notes`、`DELETE /notes/:id`
  - 向 AI 提问，底层调用 `GET /?text=...`
  
### 使用方法

1. 启动本地服务后打开浏览器访问 `http://localhost:8787/ui`
2. 在“添加笔记”中输入内容并点击“提交”
3. 在“已保存笔记”中查看列表并可删除无用笔记
4. 在“向 AI 提问”输入问题并查看模型回答
