#!/usr/bin/env node
/**
 * verify-math.mjs — 校验 Markdown 中的公式能否被 KaTeX（VS Code 预览所用的渲染器）正确渲染。
 *
 * 用法：
 *   npm i katex
 *   node scripts/verify-math.mjs <文件或目录> [...]
 *
 * 检查内容：
 *   1. 每个 $…$ / $$…$$ 公式能否渲染（KaTeX + throwOnError）；
 *   2. KaTeX 严格模式告警（公式内裸中文、$$ 内的裸 \\ 换行等）；
 *   3. Markdown 不认的 LaTeX 定界符 \(…\) / \[…\]；
 *   4. 跨渲染器不稳定或不可用的宏（\newcommand、\def、\ce、\SI、\href、\includegraphics）。
 *
 * 存在错误时退出码为 1，可直接用于 CI 或提交前检查。
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let katex;
try {
  katex = require("katex");
} catch {
  console.error("缺少依赖：请先运行  npm i katex");
  process.exit(2);
}

const MD_EXT = new Set([".md", ".markdown"]);

const collect = (target) => {
  const stat = fs.statSync(target);
  if (stat.isFile()) return MD_EXT.has(path.extname(target).toLowerCase()) ? [target] : [];
  return fs
    .readdirSync(target, { withFileTypes: true })
    .flatMap((e) => (e.name === "node_modules" ? [] : collect(path.join(target, e.name))));
};

const render = (tex, displayMode, problems) => {
  const warnings = [];
  const original = console.warn;
  console.warn = (...a) => warnings.push(String(a[0]));
  try {
    const html = katex.renderToString(tex, { displayMode, throwOnError: true });
    if (html.includes("katex-error")) problems.push(["render", tex, "渲染结果为错误元素"]);
    for (const w of warnings) problems.push(["warn", tex, w.replace(/^LaTeX-incompatible input[^:]*: /, "")]);
  } catch (e) {
    problems.push(["render", tex, e.message.split("\n")[0]]);
  } finally {
    console.warn = original;
  }
};

/** 逐行扫描：跳过围栏代码块（`markdown`/`md`/`math` 围栏内的公式仍需校验）与行内代码跨度。 */
const analyze = (text) => {
  const problems = [];
  let display = 0;
  let inline = 0;
  let inFence = false;
  let fenceMark = "";
  let inDisplay = false;
  let buffer = [];

  // 只检查正文（排除行内代码与公式）：在代码跨度里讨论 \newcommand 是合法的。
  const checkInline = (line, where) => {
    let plain = "";
    let i = 0;
    let codeRun = 0;
    while (i < line.length) {
      if (line[i] === "`") {
        let n = 0;
        while (line[i + n] === "`") n++;
        codeRun = codeRun === 0 ? n : codeRun === n ? 0 : codeRun;
        i += n;
        continue;
      }
      if (codeRun === 0 && line[i] === "$" && line[i - 1] !== "\\") {
        const close = line.indexOf("$", i + 1);
        if (close > i + 1) {
          render(line.slice(i + 1, close), false, problems);
          inline++;
          i = close + 1;
          continue;
        }
      }
      if (codeRun === 0) plain += line[i];
      i++;
    }
    for (const m of plain.matchAll(/\\(?:\(|\)|\[|\]|newcommand|renewcommand|def|ce|SI|href|includegraphics)/g)) {
      problems.push(["delimiter", m[0], `${where} 中使用了 ${m[0]}：在 Markdown 里不可用或不稳定`]);
    }
  };

  for (const line of text.split(/\r?\n/)) {
    const fence = line.match(/^\s{0,3}(`{3,}|~{3,})([^\s`]*)/);
    if (fence) {
      if (!inFence) {
        inFence = true;
        fenceMark = fence[1][0];
        checkInline(line, "fence-info");
      } else if (fence[1][0] === fenceMark) {
        inFence = false;
      }
      continue;
    }
    if (inFence) continue;
    if (inDisplay) {
      if (line.trim() === "$$") {
        inDisplay = false;
        render(buffer.join("\n"), true, problems);
        display++;
      } else {
        buffer.push(line);
      }
      continue;
    }
    if (line.trim() === "$$") {
      inDisplay = true;
      buffer = [];
      continue;
    }
    checkInline(line, "正文");
  }
  if (inDisplay) problems.push(["render", buffer.join("\n"), "未闭合的 $$ 块"]);

  // 围栏示例里的公式（它们是给读者复制走的，同样必须可渲染）
  const fenceRe = /^ {0,3}(`{3,}|~{3,})(markdown|md|math)[^\n]*\n([\s\S]*?)^ {0,3}\1[ \t]*$/gm;
  let fenced = 0;
  for (const m of text.matchAll(fenceRe)) {
    for (const mm of m[3].matchAll(/\$\$([\s\S]*?)\$\$/g)) {
      render(mm[1], true, problems);
      fenced++;
    }
    for (const mm of m[3].matchAll(/(?<!\\)\$([^$\n]+)\$/g)) {
      render(mm[1], false, problems);
      fenced++;
    }
  }

  return { display, inline, fenced, problems };
};

const targets = process.argv.slice(2);
if (!targets.length) {
  console.error("用法：node scripts/verify-math.mjs <文件或目录> [...]");
  process.exit(2);
}

const files = targets.flatMap((t) => collect(t));
if (!files.length) {
  console.error("未找到 Markdown 文件");
  process.exit(2);
}

let failed = 0;
console.log(`校验 ${files.length} 个文件（KaTeX ${require("katex/package.json").version}）\n`);
for (const file of files) {
  const { display, inline, fenced, problems } = analyze(fs.readFileSync(file, "utf8"));
  const label = path.relative(process.cwd(), file).replace(/\\/g, "/");
  const counts = `${display} display / ${inline} inline${fenced ? ` / ${fenced} fenced` : ""}`;
  const rel = problems.filter(([k]) => k !== "warn");
  const warns = problems.filter(([k]) => k === "warn");
  const status = rel.length ? "✗" : warns.length ? "!" : "✓";
  console.log(`${status} ${label.padEnd(38)} ${counts.padEnd(34)} ${rel.length} 错误 / ${warns.length} 告警`);
  for (const [kind, tex, msg] of problems) {
    const tag = kind === "warn" ? "告警" : kind === "delimiter" ? "定界符" : "错误";
    console.log(`    [${tag}] ${msg}`);
    if (kind !== "delimiter") console.log(`           tex: ${tex.replace(/\n/g, " ⏎ ").slice(0, 90)}`);
  }
  failed += rel.length;
}

console.log(
  failed
    ? `\n✗ 共 ${failed} 处需要修复：公式必须在 KaTeX 与 MathJax 的交集内。`
    : "\n✓ 全部公式均可渲染（KaTeX ∩ MathJax 安全写法）。"
);
process.exit(failed ? 1 : 0);
