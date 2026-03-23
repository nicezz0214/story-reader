import Link from "next/link";

const links = [
  { href: "/", label: "发现" },
  { href: "/search", label: "搜索" },
  { href: "/shelf", label: "书架" },
  { href: "/admin", label: "管理后台" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-[color:var(--color-paper)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--color-brand)] text-sm font-semibold text-white">
            SR
          </span>
          <div>
            <div className="font-serif text-xl font-semibold text-[color:var(--color-ink)]">
              Story Reader
            </div>
            <div className="text-xs text-[color:var(--color-muted)]">小说与书籍在线翻阅平台</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-[color:var(--color-muted)] md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-[color:var(--color-ink)]">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
