# tutorial-writing-skill

把「数学／技术推导讲义」的写法固化为可复用的 **VS Code Copilot 技能（Agent Skill）**：文档结构、公式排版、表达方式、迭代与交付约定。

目标读者是**有基础但没学过这个主题的人**（例如刚进课题组的研究生）。写作标准是：读者只靠这一篇文档，就能独立复现每一步推导与实现。

## 三条优先级（其余都是手段）

1. **公式必须写对** —— 符号先定义后使用且全程不换名；每步只做一处变换并写出依据；检查边界与退化情形；能数值验证的结论就真的验证一次。
2. **推导必须简洁易懂** —— 一次只前进一步；先给直觉再形式化；砍掉不服务于主线的分支；每个公式后紧跟一句人话。
3. **名词必须串联成一条线** —— 每个新名词都交代「解决上一节什么问题 + 它是什么 + 与已有名词的关系」；每个结论都能回答「为了解决什么，得到了什么」。

骨架、疑问式标题、`\boxed{}`、编号、检查清单都只是达成这三条的手段。内容与模板冲突时，听内容——不要为了填满模板而写文档。

## 其他约定

| 方面 | 规定 |
| --- | --- |
| 文档骨架 | frontmatter → `> **核心问题：**` → 导语 → 阅读路线 → 参考文献 → 分步章节 → 总结（默认起点，可裁剪） |
| 结论句式 | 每节收尾能塞进「为了解决〈上一节的不足〉，我们得到〈本节的结论〉」 |
| 公式规范 | 只用 KaTeX ∩ MathJax 安全子集；多行用 `aligned`／`cases`；编号用 `\tag{}` |
| 实现配套 | 给出与公式一一对应的最小可运行代码，变量名与符号名一致 |
| 交付方式 | **Markdown 是唯一源文件**；PDF／HTML 只是可选、可再生的最后一步 |

## 安装（社区用户）

三种方式任选。装完在 Chat 输入 `/skills`，列表里应出现 `tutorial-writing-skill`。

### 方式一：VS Code 内直接安装（实验特性）

1. 启用设置 `chat.customizations.marketplace.enabled`。
2. 打开 Agent Customizations 编辑器（命令面板运行 **Chat: Open Customizations**，或在 Chat 输入框输入 `/skills`），切到 **Discover**。
3. 来源选 **GitHub Feed**，搜索 `tutorial-writing-skill`（可加 `@type:skill` 过滤技能类条目）。
4. 点 **Install**，选择装到个人技能目录还是当前工作区。

### 方式二：命令行克隆（推荐，跨 agent 通用）

```bash
# 个人级：本机所有项目可用
git clone https://github.com/AcSg999/tutorial-writing-skill.git ~/.copilot/skills/tutorial-writing-skill

# 项目级：随项目分发给团队
git clone https://github.com/AcSg999/tutorial-writing-skill.git .github/skills/tutorial-writing-skill

# 项目级 + 便于后续更新：作为 submodule 引入
git submodule add https://github.com/AcSg999/tutorial-writing-skill.git .github/skills/tutorial-writing-skill
```

Windows PowerShell 对应写法：

```powershell
git clone https://github.com/AcSg999/tutorial-writing-skill.git "$env:USERPROFILE\.copilot\skills\tutorial-writing-skill"
```

### 方式三：下载 ZIP（不用 git）

仓库页面 **Code → Download ZIP**，解压到任意技能目录。**记得把解压出的 `tutorial-writing-skill-main` 改名为 `tutorial-writing-skill`**：目录名必须与 `SKILL.md` 里 `name` 字段完全一致，否则技能会静默加载失败——不报错，只是不出现。

### 支持的技能目录

| 范围 | 目录 | 说明 |
| --- | --- | --- |
| 工作区级 | `.github/skills/`、`.claude/skills/`、`.agents/skills/` | 随项目分发；monorepo 中可能需要开启 `chat.useCustomizationsInParentRepositories` 才能发现父仓库根目录的技能 |
| 个人级 | `~/.copilot/skills/`、`~/.claude/skills/`、`~/.agents/skills/` | 本机所有项目可用 |

Agent Skills 是开放标准，同一份目录可以给 VS Code Copilot、GitHub Copilot CLI、Claude Code 等支持该标准的 agent 复用；各 agent 支持的目录与可选特性略有差异（例如 Codex 会在首次提问前发现 `.github/skills/`，并原生支持 `.agents/skills/`）。调整技能目录后，建议重载窗口或新开一个对话。

### 安装校验

Chat 输入框键入 `/skills` 打开 **Configure Skills** 菜单，看到 `tutorial-writing-skill` 即安装成功；随后提出一个写作需求，技能会在相关时自动加载，不必手动点名。

## 使用

**① 写新的讲义**

```
写一篇关于〈主题〉的详细推导讲义，按 tutorial-writing-skill 的规范来：
从〈数学起点〉讲到〈最终目标〉，包含动机、完整推导、最小可运行实现和总结。
```

**② 改已有稿子**

```
按讲义规范重排这篇文档：补上核心问题、每节的动机与结论、缺失的名词衔接，
并检查推导是否有跳步、公式是否有说不清来源的等号。
```

**③ 给文档做体检**

```
检查这篇文档是否符合同一套规范：公式正确性、推导是否简洁易懂、
名词是否串联、每个结论是否回答了"为了解决什么，得到了什么"。
```

**④ 校验公式能否正确渲染**（可选，只依赖一个 devDependency）

```bash
npm install
npm run verify                        # 校验仓库内所有 Markdown
node scripts/verify-math.mjs 讲义.md   # 只校验某个文件
```

需要 PDF 时，**最后一步**再从 Markdown 导出（Pandoc、Quarto、`md-to-pdf`、VS Code 的 Markdown PDF 扩展等）。永远不要编辑 PDF 后在它上面继续迭代——那会让 Markdown 失去唯一源文件的地位。

## 仓库结构

```
SKILL.md                          技能主文件：三条优先级、结论句式、名词串联、默认骨架、写作流程、自查
package.json                      npm run verify（只依赖 katex）
examples/
  skeleton-template.md            可直接复制的空骨架（占位符用 〈…〉 标注，可裁剪）
  screenshots/
    01-document-structure.png     骨架渲染效果：元信息、核心问题、阅读路线、章节开头
    02-math-layout.png            骨架渲染效果：多行推导、框选结论、编号公式
reference/
  math-and-markdown.md            公式与排版细则、KaTeX 实测矩阵、跨平台差异、渲染自检方法
scripts/
  verify-math.mjs                 公式渲染校验器（提交前／CI 均可运行）
LICENSE                           MIT
```

## 公式校验脚本

`scripts/verify-math.mjs` 会检查每个公式能否被 KaTeX（VS Code 预览的渲染器）渲染，并抓出常见跨平台问题：公式内裸中文、`$$` 内用裸 `\\` 换行、LaTeX 定界符 `\(…\)`、以及 `\newcommand`／`\ce`／`\SI`／`\href` 这类不稳定或不可用的宏。

```bash
npm install          # 只装一个 devDependency：katex
npm run verify       # 等价于 node scripts/verify-math.mjs .
node scripts/verify-math.mjs 某篇讲义.md   # 也可以只查单个文件
```

有错误时退出码为 1，可直接接进 CI 或提交前钩子。

## 渲染效果

![文档结构](examples/screenshots/01-document-structure.png)

![公式排版](examples/screenshots/02-math-layout.png)

截图由骨架模板本身渲染得到（KaTeX，1.5x 缩放），因此展示的就是实际排版效果。

## 常见问题

**技能装好了却没生效？** 九成是目录名与 `SKILL.md` 里的 `name` 不一致（必须是 `tutorial-writing-skill`：全小写、连字符）；其次是把目录放错了位置（见上方支持目录表）。改完目录后重载窗口或新开一个对话。

**公式在 GitHub 上和本地预览不一样？** 两个平台渲染器不同（GitHub 用 MathJax，VS Code 预览用 KaTeX）。[公式细则](reference/math-and-markdown.md)里列出了实测差异，最典型的三个：`$$` 内的裸 `\\` 换行在 KaTeX 下不生效、`\(…\)` 定界符不被 Markdown 识别、`\ce{}`／`\SI{}` 这类扩展宏不可用。跑 `npm run verify` 可以一次性查出这些写法。

**一定要按这套骨架写吗？** 不必。骨架是默认起点，可以裁剪、合并、调序；真正要守住的是三条优先级，以及 KaTeX ∩ MathJax 的公式写法。

**只想用校验脚本、不想装技能？** 直接把 `scripts/verify-math.mjs`（和 `package.json`）拷进你的文档仓库即可，它的唯一依赖是 `katex`。

## 反馈与贡献

规范本身有问题（例如某条公式建议在某个平台不成立）、或者想补充新的排版规则，欢迎开 Issue 或 PR——附上最小可复现的 Markdown 片段最有帮助。本仓库 MIT 许可，可自由 fork、改名、改成自己领域的风格。

## 许可

[MIT](LICENSE)
