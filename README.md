# tutorial-writing-skill

> **语言：** [English](README.en.md) · 中文

把数学与技术推导讲义的写法固化为可复用的 VS Code Copilot Agent Skill：从文档结构、公式排版，到表达方式、迭代与交付约定。

目标读者是**有基础但没学过主题的人**，例如刚进入课题组的研究生。理想结果是：读者只靠一篇讲义，就能独立复现每一步推导与实现。

## 核心原则

所有规则都服务于以下三点，内容与模板冲突时以内容为准：

1. **公式必须写对。** 先定义符号再使用；每步只做一处变换并说明依据；检查边界与退化情形；可数值验证的结论要实际验证。
2. **推导必须易懂。** 先讲直觉再形式化；一次只前进一步；每个公式后紧跟一句解释；删除不服务于主线的分支。
3. **名词必须串成一条线。** 每个新名词都说明它解决了什么问题、是什么，以及与已有名词的关系。

骨架、疑问式标题、`\boxed{}`、公式编号和检查清单都只是手段，不是硬性模板。

## 快速开始

### 安装

安装后，在 Chat 中输入 `/skills`；列表中出现 `tutorial-writing-skill` 即表示成功。

#### 方式一：VS Code 直接安装（实验特性）

1. 启用 `chat.customizations.marketplace.enabled`。
2. 打开 Agent Customizations 编辑器（命令面板运行 **Chat: Open Customizations**，或在 Chat 中输入 `/skills`）。
3. 切到 **Discover**，选择 **GitHub Feed**，搜索 `tutorial-writing-skill`（可用 `@type:skill` 过滤）。
4. 点击 **Install**，选择安装到个人技能目录或当前工作区。

#### 方式二：命令行克隆（推荐）

```bash
# 个人级：本机所有项目可用
git clone https://github.com/AcSg999/tutorial-writing-skill.git \
  ~/.copilot/skills/tutorial-writing-skill

# 项目级：随项目分发给团队
git clone https://github.com/AcSg999/tutorial-writing-skill.git \
  .github/skills/tutorial-writing-skill

# 项目级 submodule：便于后续更新
git submodule add https://github.com/AcSg999/tutorial-writing-skill.git \
  .github/skills/tutorial-writing-skill
```

Windows PowerShell：

```powershell
git clone https://github.com/AcSg999/tutorial-writing-skill.git `
  "$env:USERPROFILE\.copilot\skills\tutorial-writing-skill"
```

#### 方式三：下载 ZIP

在仓库页面选择 **Code → Download ZIP**，解压到技能目录，并将解压出的 `tutorial-writing-skill-main` 重命名为 `tutorial-writing-skill`。目录名必须与 `SKILL.md` 中的 `name` 完全一致，否则技能会静默加载失败。

### 支持的技能目录

| 范围 | 目录 | 用途 |
| --- | --- | --- |
| 工作区级 | `.github/skills/`、`.claude/skills/`、`.agents/skills/` | 随项目分发 |
| 个人级 | `~/.copilot/skills/`、`~/.claude/skills/`、`~/.agents/skills/` | 本机所有项目可用 |

Agent Skills 是开放标准，同一份技能目录可被 VS Code Copilot、GitHub Copilot CLI、Claude Code 等支持该标准的 agent 复用。调整目录后，建议重载窗口或新开对话。

## 使用

### 写一篇新讲义

```text
写一篇关于〈主题〉的详细推导讲义，按 tutorial-writing-skill 的规范来：
从〈数学起点〉讲到〈最终目标〉，包含动机、完整推导、最小可运行实现和总结。
```

### 重排已有草稿

```text
按讲义规范重排这篇文档：补上核心问题、每节的动机与结论、缺失的名词衔接，
并检查推导是否有跳步、公式是否有说不清来源的等号。
```

### 检查文档质量

```text
检查这篇文档是否符合同一套规范：公式正确性、推导是否简洁易懂、
名词是否串联、每个结论是否回答了“为了解决什么，得到了什么”。
```

## 公式校验

校验器会检查仓库中的 Markdown 是否能被 KaTeX 渲染，并捕获常见跨平台问题，例如公式内裸中文、`$$` 中的裸 `\\` 换行、`\(…\)` 定界符，以及 `\newcommand`、`\ce`、`\SI`、`\href` 等不稳定宏。

```bash
npm install
npm run verify                         # 校验仓库内所有 Markdown
node scripts/verify-math.mjs 讲义.md  # 只校验一个文件
```

发现错误时退出码为 `1`，可直接接入 CI 或提交前检查。需要 PDF 或 HTML 时，最后再从 Markdown 导出；Markdown 始终是唯一源文件。

## 默认写作骨架

默认顺序如下，可按内容裁剪：

1. YAML frontmatter
2. `> **核心问题：**`
3. 导语与阅读路线
4. 主要参考文献
5. 按“为什么需要这一步？”组织的分步章节
6. 总结：用“为了解决什么，得到了什么”串起完整逻辑

每个小节建议遵循：**场景或问题 → 直觉 → 定义与假设 → 推导 → 结论 → 最小实现或数值例子**。

详细规则见 [`SKILL.md`](SKILL.md)，可直接复制的模板见 [`examples/skeleton-template.md`](examples/skeleton-template.md)。

## 仓库结构

```text
SKILL.md
examples/
  skeleton-template.md
  screenshots/
reference/
  math-and-markdown.md
scripts/
  verify-math.mjs
package.json
LICENSE
```

- [`SKILL.md`](SKILL.md)：完整写作规范、流程、自查清单与反模式
- [`examples/`](examples/)：可复制的空骨架与渲染截图
- [`reference/math-and-markdown.md`](reference/math-and-markdown.md)：KaTeX / MathJax 兼容性与公式细则
- [`scripts/verify-math.mjs`](scripts/verify-math.mjs)：公式渲染校验器

## 渲染效果

![文档结构](examples/screenshots/01-document-structure.png)

![公式排版](examples/screenshots/02-math-layout.png)

截图由骨架模板渲染得到（KaTeX，1.5× 缩放），展示的就是实际排版效果。

## 常见问题

**技能安装后没有生效？** 先确认目录名必须是 `tutorial-writing-skill`，再确认目录位于上方支持的路径中；修改后重载窗口或新开对话。

**GitHub 与本地预览的公式不一致？** GitHub 使用 MathJax，VS Code 预览使用 KaTeX。请阅读 [公式与排版细则](reference/math-and-markdown.md)，并运行 `npm run verify`。

**必须严格使用默认骨架吗？** 不必。可以裁剪、合并或调序；真正需要坚持的是三条核心原则，以及 KaTeX ∩ MathJax 的安全公式子集。

**只想使用校验脚本？** 将 `scripts/verify-math.mjs` 与 `package.json` 复制到自己的文档仓库即可；唯一依赖是 `katex`。

## 反馈与贡献

欢迎通过 Issue 或 PR 报告规范问题、补充排版规则，最好附上最小可复现的 Markdown 片段。本仓库采用 MIT 许可证，可自由 fork 和定制。

## 许可证

[MIT](LICENSE)
