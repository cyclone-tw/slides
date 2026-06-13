import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(new URL("..", import.meta.url).pathname);
const owner = "cyclone-tw";
const repo = "slides";
const baseUrl = `https://${owner}.github.io/${repo}/`;

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const clean = (value = "") => String(value).replace(/\s+/g, " ").trim();

function readText(file) {
  return fs.readFileSync(file, "utf8");
}

function firstMatch(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return clean(match[1]);
  }
  return "";
}

function titleFromHtml(html, folder) {
  const title = firstMatch(html, [
    /<title[^>]*>([\s\S]*?)<\/title>/i,
    /<h1[^>]*>([\s\S]*?)<\/h1>/i,
  ]);
  return title || folder.replaceAll("-", " ");
}

function descriptionFromHtml(html) {
  const description = firstMatch(html, [
    /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i,
    /<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i,
    /<p[^>]*class=["'][^"']*(?:lead|subtitle|description)[^"']*["'][^>]*>([\s\S]*?)<\/p>/i,
  ]);
  return description.replace(/<[^>]+>/g, "") || "";
}

function dateFromFolder(folder) {
  const full = folder.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (full) return `${full[1]}-${full[2]}-${full[3]}`;

  const compact = folder.match(/^(\d{2})-q(\d)/i);
  if (compact) return `20${compact[1]} Q${compact[2]}`;

  const yearMonth = folder.match(/(20\d{2})-(\d{2})/);
  if (yearMonth) return `${yearMonth[1]}-${yearMonth[2]}`;

  return "";
}

function categoryFor(folder, title) {
  const haystack = `${folder} ${title}`.toLowerCase();
  if (haystack.includes("open-design")) return "Template";
  if (haystack.includes("cycloneos") || haystack.includes("hermes")) return "System";
  if (haystack.includes("workflow") || haystack.includes("ai-coding")) return "AI Workflow";
  if (haystack.includes("coffee") || haystack.includes("desert") || haystack.includes("colearning")) return "Workshop";
  if (haystack.includes("thesis") || haystack.includes("foundation")) return "Research";
  return "Slides";
}

function accentFor(category, folder) {
  const palette = {
    Template: ["#70e4b3", "#f0bd65", "#0b0f0d"],
    System: ["#66c7ff", "#f06d6d", "#07131d"],
    "AI Workflow": ["#c7f36a", "#6aa8ff", "#0f1408"],
    Workshop: ["#ffb86b", "#91d18b", "#1a1008"],
    Research: ["#d8c2ff", "#70e4b3", "#121018"],
    Slides: ["#f5f5f0", "#8fb5ff", "#111111"],
  };
  const [a, b, bg] = palette[category] || palette.Slides;
  const offset = [...folder].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 360;
  return { a, b, bg, hue: offset };
}

function collectSlides() {
  return fs
    .readdirSync(repoRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => !entry.name.startsWith("."))
    .filter((entry) => !["scripts", "node_modules"].includes(entry.name))
    .filter((entry) => fs.existsSync(path.join(repoRoot, entry.name, "index.html")))
    .map((entry) => {
      const folder = entry.name;
      const html = readText(path.join(repoRoot, folder, "index.html"));
      const title = titleFromHtml(html, folder);
      const description = descriptionFromHtml(html);
      const category = categoryFor(folder, title);
      return {
        folder,
        title,
        description,
        category,
        date: dateFromFolder(folder),
        url: `${baseUrl}${folder}/`,
        accent: accentFor(category, folder),
      };
    })
    .sort((a, b) => {
      const dateCompare = String(b.date).localeCompare(String(a.date));
      if (dateCompare) return dateCompare;
      return a.title.localeCompare(b.title, "zh-Hant");
    });
}

function renderIndex(slides) {
  const fallbackJson = JSON.stringify(slides);
  const cards = slides
    .map(
      (slide) => `<a class="card" href="./${escapeHtml(slide.folder)}/" data-category="${escapeHtml(slide.category)}" data-search="${escapeHtml(`${slide.title} ${slide.folder} ${slide.description} ${slide.category}`.toLowerCase())}" style="--a:${slide.accent.a};--b:${slide.accent.b};--card-bg:${slide.accent.bg};--h:${slide.accent.hue}">
  <div class="visual">
    <div class="screen"><span></span><span></span><span></span></div>
    <div class="orbit"></div>
  </div>
  <div class="content">
    <div class="meta"><span>${escapeHtml(slide.category)}</span><span>${escapeHtml(slide.date || "Live")}</span></div>
    <h2>${escapeHtml(slide.title)}</h2>
    <p>${escapeHtml(slide.description || slide.folder)}</p>
    <code>${escapeHtml(slide.folder)}</code>
  </div>
</a>`,
    )
    .join("\n");

  return `<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Cyclone slides public index.">
  <title>Cyclone Slides</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #050608;
      --panel: #10151b;
      --panel-2: #151d24;
      --line: #26323d;
      --ink: #f4f7f5;
      --muted: #93a19b;
      --accent: #70e4b3;
      --warning: #f0bd65;
      --max: 1240px;
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      min-height: 100vh;
      background:
        linear-gradient(180deg, rgba(5,6,8,.12), rgba(5,6,8,.96) 520px),
        radial-gradient(circle at 14% 10%, rgba(112,228,179,.20), transparent 28%),
        radial-gradient(circle at 88% 12%, rgba(240,189,101,.13), transparent 26%),
        #050608;
      color: var(--ink);
      font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans TC", sans-serif;
      line-height: 1.55;
      letter-spacing: 0;
    }
    a { color: inherit; text-decoration: none; }
    .wrap { width: min(var(--max), calc(100% - 32px)); margin: 0 auto; }
    header {
      padding: 60px 0 28px;
      border-bottom: 1px solid var(--line);
    }
    .topline {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 58px;
      color: var(--muted);
      font-size: 13px;
    }
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      color: var(--ink);
      font-weight: 760;
    }
    .mark {
      width: 26px;
      height: 26px;
      border: 1px solid rgba(112,228,179,.55);
      border-radius: 6px;
      background: linear-gradient(135deg, rgba(112,228,179,.24), rgba(240,189,101,.16));
      box-shadow: 0 0 40px rgba(112,228,179,.18);
    }
    h1 {
      margin: 0;
      font-size: clamp(54px, 9vw, 128px);
      line-height: .86;
      letter-spacing: 0;
      max-width: 920px;
    }
    .lead {
      margin: 22px 0 0;
      max-width: 760px;
      color: #d8e2dd;
      font-size: clamp(17px, 2vw, 22px);
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      margin-top: 34px;
      max-width: 680px;
    }
    .stat {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(16,21,27,.72);
      padding: 12px 14px;
    }
    .stat b { display: block; font-size: 28px; line-height: 1; }
    .stat span { color: var(--muted); font-size: 12px; }
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 10;
      border-bottom: 1px solid var(--line);
      background: rgba(5,6,8,.86);
      backdrop-filter: blur(16px);
    }
    .tools {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 8px;
      padding: 12px 0;
    }
    input, select, button {
      min-height: 42px;
      border: 1px solid var(--line);
      border-radius: 7px;
      background: var(--panel);
      color: var(--ink);
      font: inherit;
    }
    input { padding: 0 13px; }
    select, button { padding: 0 12px; }
    button { cursor: pointer; }
    main { padding: 26px 0 76px; }
    .grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
    }
    .card {
      position: relative;
      overflow: hidden;
      min-height: 390px;
      display: grid;
      grid-template-rows: 190px 1fr;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--panel);
      transition: transform .18s ease, border-color .18s ease, background .18s ease;
    }
    .card:hover {
      transform: translateY(-3px);
      border-color: color-mix(in srgb, var(--a) 72%, var(--line));
      background: var(--panel-2);
    }
    .visual {
      position: relative;
      overflow: hidden;
      background:
        radial-gradient(circle at 76% 18%, color-mix(in srgb, var(--a) 52%, transparent), transparent 28%),
        linear-gradient(135deg, color-mix(in srgb, var(--card-bg) 88%, #10151b), #07090c 72%);
    }
    .screen {
      position: absolute;
      left: 18px;
      right: 72px;
      bottom: 24px;
      height: 98px;
      border: 1px solid rgba(255,255,255,.22);
      border-radius: 8px;
      background: rgba(255,255,255,.08);
      padding: 14px;
    }
    .screen span {
      display: block;
      height: 9px;
      margin-bottom: 10px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--a) 58%, white);
    }
    .screen span:nth-child(2) { width: 68%; background: color-mix(in srgb, var(--b) 62%, white); }
    .screen span:nth-child(3) { width: 42%; background: rgba(255,255,255,.62); }
    .orbit {
      position: absolute;
      right: 18px;
      top: 28px;
      width: 74px;
      height: 74px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--a), var(--b));
      box-shadow: 0 18px 70px color-mix(in srgb, var(--a) 30%, transparent);
    }
    .content { padding: 16px; }
    .meta {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      color: var(--accent);
      font-size: 12px;
      font-weight: 760;
    }
    .card h2 {
      margin: 12px 0 10px;
      font-size: 23px;
      line-height: 1.08;
    }
    .card p {
      margin: 0;
      color: #c4d0ca;
      font-size: 14px;
    }
    .card code {
      display: inline-block;
      margin-top: 15px;
      max-width: 100%;
      color: var(--muted);
      font-size: 12px;
      overflow-wrap: anywhere;
    }
    .empty {
      display: none;
      border: 1px dashed var(--line);
      border-radius: 8px;
      padding: 28px;
      color: var(--muted);
    }
    footer {
      border-top: 1px solid var(--line);
      color: var(--muted);
      padding: 18px 0 32px;
      font-size: 12px;
    }
    @media (max-width: 920px) {
      .grid, .stats { grid-template-columns: 1fr; }
      .tools { grid-template-columns: 1fr; }
      .topline { align-items: flex-start; flex-direction: column; margin-bottom: 36px; }
      .card { min-height: 340px; }
    }
  </style>
</head>
<body>
  <header>
    <div class="wrap">
      <div class="topline">
        <div class="brand"><span class="mark"></span><span>Cyclone Slides</span></div>
        <div id="sync-state">Static fallback ready</div>
      </div>
      <h1>Slides Index</h1>
      <p class="lead">公開簡報入口。新增子資料夾並推到 GitHub 後，這個頁面會嘗試即時從 repo 根目錄抓取最新清單。</p>
      <div class="stats">
        <div class="stat"><b id="count">${slides.length}</b><span>published folders</span></div>
        <div class="stat"><b id="category-count">${new Set(slides.map((slide) => slide.category)).size}</b><span>collections</span></div>
        <div class="stat"><b>GH</b><span>auto discovery</span></div>
      </div>
    </div>
  </header>

  <div class="toolbar">
    <div class="wrap tools">
      <input id="q" placeholder="搜尋標題、資料夾、類型…">
      <select id="category">
        <option value="">全部類型</option>
      </select>
      <button id="refresh">重新讀取</button>
    </div>
  </div>

  <main class="wrap">
    <div id="grid" class="grid">
${cards}
    </div>
    <div id="empty" class="empty">找不到符合條件的簡報。</div>
  </main>

  <footer>
    <div class="wrap">Generated from repository folders. Runtime discovery reads GitHub public contents when available.</div>
  </footer>

  <script>
    const FALLBACK_SLIDES = ${fallbackJson};
    const OWNER = "${owner}";
    const REPO = "${repo}";
    const BRANCH = "main";
    let slides = FALLBACK_SLIDES;

    const grid = document.querySelector("#grid");
    const empty = document.querySelector("#empty");
    const q = document.querySelector("#q");
    const category = document.querySelector("#category");
    const syncState = document.querySelector("#sync-state");
    const count = document.querySelector("#count");
    const categoryCount = document.querySelector("#category-count");

    function escapeHtml(value = "") {
      return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
    }

    function titleFromHtml(html, folder) {
      const title = html.match(/<title[^>]*>([\\s\\S]*?)<\\/title>/i)?.[1]
        || html.match(/<h1[^>]*>([\\s\\S]*?)<\\/h1>/i)?.[1]
        || folder.replaceAll("-", " ");
      return title.replace(/<[^>]+>/g, "").replace(/\\s+/g, " ").trim();
    }

    function dateFromFolder(folder) {
      const full = folder.match(/^(\\d{4})-(\\d{2})-(\\d{2})/);
      if (full) return \`\${full[1]}-\${full[2]}-\${full[3]}\`;
      const compact = folder.match(/^(\\d{2})-q(\\d)/i);
      if (compact) return \`20\${compact[1]} Q\${compact[2]}\`;
      const yearMonth = folder.match(/(20\\d{2})-(\\d{2})/);
      if (yearMonth) return \`\${yearMonth[1]}-\${yearMonth[2]}\`;
      return "";
    }

    function categoryFor(folder, title) {
      const haystack = \`\${folder} \${title}\`.toLowerCase();
      if (haystack.includes("open-design")) return "Template";
      if (haystack.includes("cycloneos") || haystack.includes("hermes")) return "System";
      if (haystack.includes("workflow") || haystack.includes("ai-coding")) return "AI Workflow";
      if (haystack.includes("coffee") || haystack.includes("desert") || haystack.includes("colearning")) return "Workshop";
      if (haystack.includes("thesis") || haystack.includes("foundation")) return "Research";
      return "Slides";
    }

    function accentFor(category, folder) {
      const palette = {
        Template: ["#70e4b3", "#f0bd65", "#0b0f0d"],
        System: ["#66c7ff", "#f06d6d", "#07131d"],
        "AI Workflow": ["#c7f36a", "#6aa8ff", "#0f1408"],
        Workshop: ["#ffb86b", "#91d18b", "#1a1008"],
        Research: ["#d8c2ff", "#70e4b3", "#121018"],
        Slides: ["#f5f5f0", "#8fb5ff", "#111111"],
      };
      const [a, b, bg] = palette[category] || palette.Slides;
      const hue = [...folder].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 360;
      return { a, b, bg, hue };
    }

    function render() {
      const search = q.value.trim().toLowerCase();
      const selected = category.value;
      const filtered = slides.filter((slide) => {
        const haystack = \`\${slide.title} \${slide.folder} \${slide.description || ""} \${slide.category}\`.toLowerCase();
        return (!search || haystack.includes(search)) && (!selected || slide.category === selected);
      });
      grid.innerHTML = filtered.map(cardHtml).join("");
      empty.style.display = filtered.length ? "none" : "block";
      count.textContent = String(slides.length);
      categoryCount.textContent = String(new Set(slides.map((slide) => slide.category)).size);
      syncCategories();
    }

    function cardHtml(slide) {
      const accent = slide.accent || accentFor(slide.category, slide.folder);
      return \`<a class="card" href="./\${escapeHtml(slide.folder)}/" data-category="\${escapeHtml(slide.category)}" style="--a:\${accent.a};--b:\${accent.b};--card-bg:\${accent.bg};--h:\${accent.hue}">
        <div class="visual"><div class="screen"><span></span><span></span><span></span></div><div class="orbit"></div></div>
        <div class="content">
          <div class="meta"><span>\${escapeHtml(slide.category)}</span><span>\${escapeHtml(slide.date || "Live")}</span></div>
          <h2>\${escapeHtml(slide.title)}</h2>
          <p>\${escapeHtml(slide.description || slide.folder)}</p>
          <code>\${escapeHtml(slide.folder)}</code>
        </div>
      </a>\`;
    }

    function syncCategories() {
      const current = category.value;
      const options = [...new Set(slides.map((slide) => slide.category))].sort();
      category.innerHTML = '<option value="">全部類型</option>' + options.map((item) => \`<option value="\${escapeHtml(item)}">\${escapeHtml(item)}</option>\`).join("");
      category.value = options.includes(current) ? current : "";
    }

    async function discoverSlides() {
      syncState.textContent = "Reading GitHub repo…";
      const listUrl = \`https://api.github.com/repos/\${OWNER}/\${REPO}/contents?ref=\${BRANCH}\`;
      const entries = await fetch(listUrl, { headers: { Accept: "application/vnd.github+json" } }).then((res) => {
        if (!res.ok) throw new Error(\`GitHub API \${res.status}\`);
        return res.json();
      });
      const dirs = entries
        .filter((entry) => entry.type === "dir")
        .filter((entry) => !entry.name.startsWith("."))
        .filter((entry) => !["scripts", "node_modules"].includes(entry.name));

      const discovered = await Promise.all(dirs.map(async (entry) => {
        const rawUrl = \`https://raw.githubusercontent.com/\${OWNER}/\${REPO}/\${BRANCH}/\${encodeURIComponent(entry.name)}/index.html\`;
        const res = await fetch(rawUrl);
        if (!res.ok) return null;
        const html = await res.text();
        const title = titleFromHtml(html, entry.name);
        const description = html.match(/<meta\\s+name=["']description["']\\s+content=["']([^"']+)["']/i)?.[1] || "";
        const itemCategory = categoryFor(entry.name, title);
        return {
          folder: entry.name,
          title,
          description,
          category: itemCategory,
          date: dateFromFolder(entry.name),
          url: \`\${location.origin}\${location.pathname.replace(/\\/[^/]*$/, "/")}\${entry.name}/\`,
          accent: accentFor(itemCategory, entry.name),
        };
      }));

      slides = discovered
        .filter(Boolean)
        .sort((a, b) => String(b.date).localeCompare(String(a.date)) || a.title.localeCompare(b.title, "zh-Hant"));
      syncState.textContent = \`Live from GitHub: \${slides.length} folders\`;
      render();
    }

    q.addEventListener("input", render);
    category.addEventListener("change", render);
    document.querySelector("#refresh").addEventListener("click", () => discoverSlides().catch((error) => {
      syncState.textContent = \`Using fallback: \${error.message}\`;
      slides = FALLBACK_SLIDES;
      render();
    }));

    syncCategories();
    render();
    discoverSlides().catch((error) => {
      syncState.textContent = \`Using fallback: \${error.message}\`;
      slides = FALLBACK_SLIDES;
      render();
    });
  </script>
</body>
</html>
`;
}

const slides = collectSlides();
fs.writeFileSync(path.join(repoRoot, "slides.json"), `${JSON.stringify(slides, null, 2)}\n`);
fs.writeFileSync(path.join(repoRoot, "index.html"), renderIndex(slides).replace(/[ \t]+$/gm, ""));
console.log(`Generated ${slides.length} slides into index.html and slides.json`);
