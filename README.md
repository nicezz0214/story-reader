# Story Reader
自己写小说 方便阅读的，不用关注
一个面向小说与书籍在线翻阅的 Web 平台骨架，包含前台阅读站与后台管理台。

## 当前范围

- 前台：首页、搜索、书架、书籍详情、章节阅读
- 后台：仪表盘、小说管理、上传入口、章节管理、分析页
- 数据：当前已支持本地书库持久化与 TXT / Markdown 上传，同时保留 `Prisma + PostgreSQL` schema 作为后续迁移基线
- 权限：后台使用 `ADMIN_ACCESS_TOKEN` 简单口令保护

## 技术栈

- `Next.js`
- `TypeScript`
- `Tailwind CSS`
- `Prisma`
- `PostgreSQL`

## 本地启动

1. 安装依赖
2. 复制 `.env.example` 为 `.env`
3. 执行开发命令

```bash
pnpm install
pnpm dev
```

## 环境变量

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/story_reader"
ADMIN_ACCESS_TOKEN="story-reader-admin"
```

## 当前目录说明

- `app/(site)`：前台站点页面
- `app/admin`：后台管理页面与上传 Server Action
- `components`：共享 UI 组件
- `lib/mock-data.ts`：本地书库数据层、TXT/Markdown 解析与持久化逻辑
- `data/library.json`：上传后的本地书库文件，会在首次保存时自动创建
- `prisma/schema.prisma`：后续接入真实数据库的模型定义

## 上传使用

1. 打开 `/admin/books/new`
2. 填写书名、作者、简介
3. 选择 `TXT` 或 `Markdown` 文件
4. 章节标题建议使用“第一章 xxx”、`## 第一章 xxx` 或 `**第一章 xxx**`
5. 提交后系统会自动拆章并保存到 `data/library.json`

## 下一步

- 将本地书库切换到 Prisma + PostgreSQL
- 为章节管理增加逐章编辑能力
- 用真实阅读事件替换当前分析估算数据
- 增加封面上传与对象存储支持
