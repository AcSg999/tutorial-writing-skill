# 公式与排版细则

本文件展开 [SKILL.md](../SKILL.md) 第八节。表中结论在 **KaTeX 0.19.0（VS Code 内置 Markdown 预览所用的渲染器）** 上实测得到，GitHub 侧按官方文档核对（GitHub 使用 **MathJax** 渲染 LaTeX）。

## 1. 三个渲染环境

| 环境 | 渲染器 | 在流程中的角色 |
| --- | --- | --- |
| VS Code 内置 Markdown 预览（`Ctrl+Shift+V`） | KaTeX | 写作与逐段调试公式（主力） |
| GitHub（README、Issue、PR、Wiki、`.md` 文件） | MathJax | 发布后的最终展示 |
| PDF／HTML（Pandoc、Quarto、md-to-pdf 等） | 各自的内核 | 可选、可再生的最后一步 |

**唯一合法写法 = 能被 KaTeX 与 MathJax 同时正确渲染的写法。** 导出器不参与决定源文件写法，只负责消费它。

## 2. 分隔符写法（依据 GitHub 官方文档）

- 行内公式：`$…$`；若公式内部含与 Markdown 冲突的字符，可用反引号形式 `` $`…`$ ``。
- 独立公式：单独起行并使用 `$$ … $$`；GitHub 另支持 `math` 围栏代码块（此时不需要 `$$`）。**推荐统一用 `$$`**，因为本地预览与导出器都支持它。
- `$$` 前后各留一个空行，避免公式被并入段落。
- 在 `.md` 文件中，段落内的换行需要显式书写（行尾反斜杠或空行），否则相邻行会被合并——这一条与公式排版无关，但排版踩坑常源于此。

## 3. KaTeX 实测矩阵

判定 `✅` 可用、`⚠️` 可用但有跨平台风险、`❌` 不可用。

| 构造 | 实测结果 | 结论 |
| --- | --- | --- |
| `\tag{n}`（在 `$$` 内） | ✅ display 可用；inline 报错 `\tag works only in display equations` | 编号只写在独立公式里 |
| `\boxed{}` | ✅ 可与 `cases`、`aligned` 嵌套 | 用于所有关键结论 |
| `aligned` | ✅ | 多行推导首选 |
| `cases`（inline、display 均可） | ✅ | 分段定义 |
| `align` / `equation` / `gather` | ⚠️ 仅 display 模式（inline 报错 `{align} can be used only in display mode`） | 弃用：编号与间距行为与 MathJax 不一致 |
| `$$` 内的裸 `\\` | ⚠️ 渲染但不换行，并告警 `In LaTeX, \\ or \newline does nothing in display math`；而 MathJax 会换行 | **弃用**：这是最容易踩的跨平台差异 |
| `\underbrace{…}_{\text{…}}` | ✅ | 标注公式各部件的含义 |
| `\xrightarrow{…}` | ✅ | 表示变换、映射、极限过程 |
| `\substack{…}` | ✅ | 多行下标（如期望的采样分布） |
| `\mathbb E` / `\mathcal N` / `\mathrm{data}` | ✅ | 期望、分布、算符正体 |
| `\text{中文}` | ✅ 无告警 | 公式内中文的**唯一**推荐位置 |
| 裸中文、`\mathrm{中文}` | ⚠️ 能渲染但告警 `Unicode text character … used in math mode` | 禁止 |
| `\newcommand` / `\def` / `\renewcommand` | ✅ 可用 | 仍禁止：跨渲染器与导出器不稳定（另有名称冲突风险） |
| `\bm` / `\boldsymbol` | ✅ | 向量加粗用 `\boldsymbol`（语义明确） |
| `\mid` vs `\|` | ✅；`|` 也能渲染但间距错误 | 条件概率用 `\mid`，范数用 `\|` 或 `\lVert…\rVert` |
| `\mathbb{1}` | ✅ | 指示函数 |
| `\ce{}`（mhchem）、`\SI{}`（siunitx） | ❌ `Undefined control sequence` | 需额外扩展，禁止 |
| 一个公式内多个 `\tag` | ❌ `Multiple \tag` | 一行一个编号 |
| `\href{}` / `\includegraphics{}` | ⚠️ 依赖 trust 配置，跨平台与导出器常被禁用 | 禁止；链接写在正文里 |

## 4. 推荐范式

### 单行结论 + 编号

```markdown
$$
\boxed{\theta^*=\mathbb E[y\mid x].}
\tag{1}
$$

**关键：** 式 (1) 说明最优解是条件均值，与 $\theta$ 无关的项不影响最优解。
```

### 多行推导（`aligned`，对齐符置于等号前）

```markdown
$$
\begin{aligned}
\mathcal L(\theta)
&=\mathbb E\left[\|f_\theta(x)-y\|^2\right] \\
&=\underbrace{\mathbb E\left[\|f_\theta(x)-\bar y\|^2\right]}_{\text{偏差项}}
 +\underbrace{\mathrm{Var}(y\mid x)}_{\text{不可约项}},
\end{aligned}
$$
```

### 分段定义（`cases` 嵌在 `\boxed` 内）

```markdown
$$
\boxed{
\begin{cases}
x_0\sim p_0, \\
\dot x_t=v_\theta(x_t,t), \\
x_1\sim p_\theta\approx p_{\mathrm{data}}.
\end{cases}
}
\tag{2}
$$
```

### 期望的多个采样来源（`substack`）

```markdown
$$
\mathbb E_{\substack{t\sim\mathcal U[0,1]\\ x_1\sim p_{\mathrm{data}}}}
\left[\|v_\theta(x_t,t)-(x_1-x_0)\|^2\right].
$$
```

### 结构标注（`underbrace` + `xrightarrow`）

```markdown
$$
\underbrace{\mathcal N(0,I)}_{\text{简单先验}}
\xrightarrow{F_\theta}
\underbrace{p_{\mathrm{data}}}_{\text{复杂目标分布}}.
$$
```

## 5. 正文排版细则

- 标点用全角；公式与中文之间保留一个空格：`采样高斯噪声：$x_0\sim\mathcal N(0,I)$。`
- 独立公式若以句点结尾，句点写在**公式内部**：`$$ x\sim p_{\mathrm{data}}(x). $$`（与教材排版一致，也避免句点被渲染到下一行）。
- 引导句以冒号结尾，独立公式之后紧跟一句解释；解释句负责说明符号含义、量纲或用途。
- 同一行并排两个式子用 `\qquad`（次要位置用 `\quad`）。
- 表格只用于对比、映射、清单（符号表、求解器对比、概念对照），不承载长段解释。
- 代码块的变量名与公式符号一一对应，注释标注它在正文中的步骤编号。
- **只用 `$…$` 与 `$$…$$`**：LaTeX 的 `\(…\)`、`\[…\]` 定界符在 Markdown 渲染器中不被识别，会原样显示成 `(text 不可约项)` 这类字面文本。
- 禁止行内 HTML 与自定义宏：GitHub 可能接受，但严格渲染器与多数导出器会失败。

## 6. 渲染自检

1. **编辑器内**：`Ctrl+Shift+V` 打开预览，逐段检查公式、表格宽度、代码块。
2. **渲染器级（可编程检测）**：用 `markdown-it` 解析 Markdown，对每个公式调用 KaTeX 并启用 `throwOnError`，可一次性找出全部无法渲染的公式；渲染失败时 KaTeX 会产出 `.katex-error` 元素，便于批量断言：

```js
const katex = require("katex");
katex.renderToString(tex, { displayMode: true, throwOnError: true }); // 抛错即为问题公式
```

3. **发布平台**：推送后在 GitHub 上确认渲染与本地一致，重点看编号、多行对齐、公式内中文。
4. **导出（可选）**：确认产物由 `.md` 生成、放在 `build/` 之类的构建目录，且不会反向修改源文件。

## 7. 一句话总结

**KaTeX 与 MathJax 的交集，就是唯一的合法写法；Markdown 是唯一源文件，渲染只是它的一个视图。**
