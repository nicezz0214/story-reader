import { createBookAction } from "@/app/admin/books/actions";

type SearchParams = Promise<{ error?: string | string[] }>;

function getErrorMessage(error: string | string[] | undefined) {
  const value = Array.isArray(error) ? error[0] : error;

  switch (value) {
    case "missing_fields":
      return "请完整填写书名、作者和简介。";
    case "missing_file":
      return "请上传 TXT 或 Markdown 正文文件。";
    case "invalid_format":
      return "当前仅支持 TXT、MD、Markdown 格式。";
    case "empty_content":
      return "上传文件内容为空，无法解析章节。";
    default:
      return "";
  }
}

export default async function AdminNewBookPage({ searchParams }: { searchParams: SearchParams }) {
  const { error } = await searchParams;
  const errorMessage = getErrorMessage(error);

  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <form action={createBookAction} className="rounded-[28px] border border-black/6 bg-white/90 p-6">
        <div className="border-b border-[color:var(--color-line)] pb-5">
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--color-brand)]">
            Upload
          </div>
          <div className="mt-2 font-serif text-3xl text-[color:var(--color-ink)]">上传小说</div>
          <p className="mt-3 text-sm leading-7 text-[color:var(--color-muted)]">
            现在已支持 TXT / Markdown 上传、章节自动拆分和本地持久化保存。章节标题可使用“第一章 xxx”、`## 第一章 xxx` 或 `**第一章 xxx**`。
          </p>
        </div>

        {errorMessage ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-6 grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm text-[color:var(--color-ink)]">书名</span>
            <input name="title" className="min-h-12 rounded-2xl border border-[color:var(--color-line)] px-4" placeholder="输入书名" />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-[color:var(--color-ink)]">作者</span>
            <input name="author" className="min-h-12 rounded-2xl border border-[color:var(--color-line)] px-4" placeholder="输入作者名" />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-[color:var(--color-ink)]">简介</span>
            <textarea
              name="summary"
              rows={5}
              className="rounded-2xl border border-[color:var(--color-line)] px-4 py-3"
              placeholder="输入小说简介"
            />
          </label>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm text-[color:var(--color-ink)]">分类</span>
              <input
                name="categories"
                className="min-h-12 rounded-2xl border border-[color:var(--color-line)] px-4"
                placeholder="如：悬疑, 都市"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm text-[color:var(--color-ink)]">标签</span>
              <input
                name="tags"
                className="min-h-12 rounded-2xl border border-[color:var(--color-line)] px-4"
                placeholder="如：慢热, 调查"
              />
            </label>
          </div>
          <label className="grid gap-2">
            <span className="text-sm text-[color:var(--color-ink)]">初始状态</span>
            <select name="status" className="min-h-12 rounded-2xl border border-[color:var(--color-line)] px-4">
              <option value="draft">保存为草稿</option>
              <option value="published">直接上架</option>
              <option value="unlisted">暂不公开</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-[color:var(--color-ink)]">上传文件</span>
            <input
              name="file"
              type="file"
              accept=".txt,.md,.markdown,text/plain,text/markdown"
              className="min-h-12 rounded-2xl border border-dashed border-[color:var(--color-line)] px-4 py-3"
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="min-h-11 rounded-full bg-[color:var(--color-brand)] px-5 text-sm font-medium text-white">
              上传并保存
            </button>
          </div>
        </div>
      </form>

      <aside className="rounded-[28px] border border-black/6 bg-white/90 p-6">
        <div className="font-serif text-3xl text-[color:var(--color-ink)]">上传规范</div>
        <ul className="mt-5 space-y-3 text-sm leading-7 text-[color:var(--color-muted)]">
          <li>支持 TXT / Markdown 两种文本格式。</li>
          <li>章节标题建议统一，如“第一章 xxx”或 `## 第一章 xxx`。</li>
          <li>正文段落之间空一行，便于阅读页按段展示。</li>
          <li>上传后会自动拆章，并按所选状态保存为草稿、上架或不公开。</li>
        </ul>
      </aside>
    </section>
  );
}
