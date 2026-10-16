---
title: "〈主题〉：从〈数学起点〉到〈最终目标〉"
subtitle: "〈一句话副标题：本文覆盖的内容范围〉"
author: "〈作者／课题组〉"
date: "〈YYYY年M月〉"
lang: zh-CN
---
<!--
用法：复制本文件 → 把 〈…〉 全部替换为真实内容 → 删除所有 HTML 注释 → 补足推导。
这是默认起点，不是硬性模板：按内容需要可以调换、合并或省略某些结构。
注意：本注释必须放在 frontmatter 之后。YAML frontmatter 只有在文件第一行开始时才被解析，
放在注释之后会失效，并可能被渲染成一个标题。
文件本身保持纯 Markdown：唯一源文件，PDF/HTML 只在最后按需导出。
-->

> **核心问题：** 〈一句话；必须是一个真正的疑问句，并且能被全文完整回答。〉

〈导语第一段：这个主题在领域中的位置，被哪些具体方法或系统使用（点名）。〉

〈导语第二段：本文要建立的核心直觉，以及读者读完之后能够做什么。〉

**阅读路线：** 〈起点概念〉 → 〈关键工具〉 → 〈核心推导〉 → 〈实现〉 → 〈应用〉 → 〈总结〉。

**主要参考：**

- [〈作者〉, *〈标题〉* (〈年份〉)](〈链接〉)
- [〈代码仓库名〉(〈年份〉)](〈链接〉)

---

# 一、第一步：为什么需要〈工具 A〉？

## 1.1 〈它究竟要解决什么问题？〉

〈一句场景铺垫。〉假设目标数据来自未知分布：

$$
y\sim p_{\mathrm{data}}(y).
$$

〈用两到四句说明直观含义，并给出一个具体例子：图像、视频、时序、机器人动作……〉

如果直接用最朴素的做法，使用平方损失：

$$
\mathcal L(\theta)=\mathbb E\left[\|f_\theta(x)-y\|^2\right],
$$

其理论最优解是条件均值：

$$
f_\theta^*(x)=\mathbb E[y\mid x].
$$

〈这个解为什么不够用：例如它无法表达多模态，或者丢失了分布信息。〉

**动机：** 〈一句话：因此我们需要引入〈工具 A〉，它换来了什么能力。〉

## 1.2 〈把问题拆成更容易的子问题〉

〈直觉描述，可用比喻或物理图像，一两句。〉将其形式化：

$$
F_\theta:\mathbb R^d\rightarrow\mathbb R^d,
\qquad
\theta=\arg\min_\theta\mathbb E\left[\|F_\theta(y)-y\|^2\right],
$$

其中 $\theta$ 表示〈参数含义〉，$\mathcal L$ 表示〈损失含义〉。

〈推进一步：定义符号 → 说明假设 → 代入 → 化简，每步只前进一次。〉

$$
\begin{aligned}
\mathcal L(\theta)
&=\mathbb E\left[\|f_\theta(x)-y\|^2\right] \\
&=\underbrace{\mathbb E\left[\|f_\theta(x)-\bar y\|^2\right]}_{\text{偏差项}}
 +\underbrace{\mathbb E\left[\|y-\bar y\|^2\right]}_{\text{不可约项}},
\end{aligned}
$$

其中 $\bar y=\mathbb E[y\mid x]$。于是得到关键结论：

$$
\boxed{
\theta^*=\arg\min_\theta\mathbb E\left[\|f_\theta(x)-\bar y\|^2\right].
}
\tag{1}
$$

**关键：** 式 (1) 表明〈结论的含义〉，它把〈困难问题〉转化为〈可计算的问题〉；$\text{不可约项}$ 与 $\theta$ 无关，因此不影响最优解。

# 二、第二步：为什么〈工具 A〉还不够，需要〈工具 B〉？

## 2.1 〈新问题出现的原因〉

〈一段铺垫：上一节的结论在什么情况下失效。〉我们把分布变换写成：

$$
\underbrace{\mathcal N(0,I)}_{\text{简单先验}}
\xrightarrow{F_\theta}
\underbrace{p_{\mathrm{data}}}_{\text{复杂目标分布}}.
$$

〈解释箭头两侧的含义，以及 $F_\theta$ 需要满足的条件。〉

## 2.2 〈核心推导〉

定义〈新符号〉，并约定时间区间 $t\in[0,1]$，两端分别对应：

$$
t=0:\ y_0\sim p_0,
\qquad
t=1:\ y_1\sim p_{\mathrm{data}}.
$$

〈推导。每个公式前用冒号结尾的引导句引出，公式后紧跟一句解释。〉

$$
\boxed{
\begin{cases}
y_0\sim p_0, \\
\dot y_t=v_\theta(y_t,t), \\
y_1\sim p_\theta\approx p_{\mathrm{data}}.
\end{cases}
}
\tag{2}
$$

**动机：** 式 (2) 说明〈含义〉，它使〈整体目标〉变成〈局部可学的目标〉。

## 2.3 实现细节

〈一个自然段说明工程约定：时间方向、数值精度、步数等。〉下表对比可选方案：

| 〈方案〉 | 〈精度〉 | 〈单步网络评估次数〉 | 〈适用场景〉 |
| --- | --- | --- | --- |
| 〈方案一〉 | 〈高／低〉 | 〈1〉 | 〈场景〉 |
| 〈方案二〉 | 〈高／低〉 | 〈2〉 | 〈场景〉 |

与公式一一对应的最小实现（变量名与公式符号保持一致）：

```python
import torch


def naive_loss(model, y, x=None):
    """Corresponds to Eq. (1): E||f_theta(x) - y||^2."""
    y_hat = model(x)          # f_theta(x)
    return ((y_hat - y) ** 2).mean()
```

# 三、常见误解澄清

### 〈误解一：两个容易混淆的量〉

〈为什么容易混淆；正确理解是什么；必要时给出对比公式。〉

### 〈误解二：约定方向〉

〈明确写出本文约定，并提示实现代码中可能存在的相反约定，避免读者对着代码误判。〉

# 四、总结：〈主题〉的完整逻辑

## 4.1 关键环节

**1. 〈第一步的结论。〉** 从〈起点〉出发：

$$
p_0\longrightarrow p_1=p_{\mathrm{data}}.
$$

**2. 〈第二步的结论。〉** 目标可以写成回归问题：

$$
\boxed{
\mathcal L=\mathbb E\left[\|v_\theta(y,t)-v_t^*(y)\|^2\right],
}
$$

其中 $v_t^*$ 表示〈含义〉，它通常〈为什么不可直接计算〉。

**3. 〈最终可训练目标。〉**

$$
\boxed{
\min_\theta\mathbb E\left[\|v_\theta(y_t,t)-(y_1-y_0)\|^2\right],
\qquad
y_t=(1-t)y_0+ty_1.
}
$$

## 4.2 最重要的理解

**第一，〈一句话观点。〉**

$$
\boxed{
\dot y_t=v_t(y_t)
\quad\Longleftrightarrow\quad
\partial_t p_t=-\nabla\cdot(p_tv_t).
}
$$

**第二，〈一句话观点。〉** 〈用两三句展开，指出它对实践的直接含义。〉

〈最后一段：指出本主题不回答的开放问题，以及值得继续研究的方向。〉

---
