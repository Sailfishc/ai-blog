---
author: 橙子
pubDatetime: 2026-04-26T10:10:00Z
title: "AI 编码的新价格表：代码变便宜以后，反馈变成主战场"
slug: anthropic-product-team-release-workbench
featured: true
draft: false
tags:
  - "AI 编码"
  - "软件工程"
  - "反馈系统"
description: "Matt Pocock 在这场 AI coding workshop 里演示了一个很典型的事故。"
---
Matt Pocock 在这场 AI coding workshop 里演示了一个很典型的事故。

他让 agent 给课程平台加一个 gamification 功能。前面一切看起来都很顺：先用 “Grill Me” 技能反复追问需求，再把对齐后的讨论压缩成 PRD，然后拆成 Kanban issue，让 agent 按 issue 去实现。agent 也很配合，写了 service，补了测试，跑了 type check，最后还汇报测试通过。

然后他打开页面手动 QA：点击完成课程，页面报错。原因是数据库里没有对应的 `PointEvents` 表。

这不是一个耸人听闻的失败。恰恰相反，它太普通了：AI 写了代码，AI 写了测试，自动反馈也通过了，但真实路径上仍然漏了一个集成条件。这个小错误解释了 AI 编码最重要的一件事：AI 不是让工程纪律过时，而是把工程纪律重新定价了。

过去，很多团队把“写代码”当作软件工程的主要成本。需求想清楚以后，剩下的是程序员一点点实现。于是流程、文档、测试、架构、code review 都像是围绕实现建立的辅助系统。

AI 进入以后，这个价格表变了。生成代码变便宜了，甚至便宜到可以让 agent 在 Docker 沙箱里跑夜班。但便宜的东西会被滥用，新的瓶颈会浮出来：上下文是否干净，任务是否小到模型仍然聪明，需求是否真的对齐，反馈是否覆盖真实路径，代码结构是否让 agent 找得到正确边界，以及最后有没有人用自己的品味压住“看起来能跑”的平庸输出。

所以，这场 workshop 的真正主题不是“怎么让 AI 帮你写更多代码”，而是“怎么为 AI 建一套反馈基础设施”。

## 旧假设：好的规格会自然变成好的代码

Matt 明确反对一种 specs-to-code 幻觉：只要不断修改规格，代码就会自己长对；如果结果不对，就回去改 spec，而不是看代码。

这个想法为什么会有吸引力？因为在旧价格表里，沟通和实现都很贵。一个清晰规格看起来像是能减少沟通成本，也能减少实现返工。对传统团队来说，先写计划、再按计划开发，是合理的。

但 AI 改变的不是“计划是否重要”，而是“计划在系统里的位置”。

在 Matt 的流程里，PRD 不是代码编译器。PRD 是目的地文档：它记录经过提问、争论和取舍之后，人和 agent 形成的共享设计概念。真正的关键不是 PRD 写得多漂亮，而是在 PRD 之前，agent 通过 Grill Me 一次次逼问：积分来源是什么？历史记录要不要回填？streak 是否计分？UI 放在哪里？哪些行为容易被刷分？

他甚至说，自己通常不仔细读生成出来的 PRD。因为如果前面的 grilling 已经让人和模型对齐，PRD 更像是一次总结能力测试。这里的判断很反直觉：不是文档越精修越好，而是对齐过程越可靠，文档才越能变成可用资产。

这会改变团队投入时间的位置。你不应该把大量精力花在润色一份“完美 PRD”上，而应该把精力放在让 agent 暴露假设、追问边界、逼出阻塞项上。

## 新价格表：实现便宜，反馈昂贵

这场 workshop 反复出现同一个机制：凡是过去靠人慢慢做的实现动作，现在都可以被 agent 加速；凡是过去被当作工程习惯的反馈动作，现在变成了性能上限。

| 过去的成本 | 现在的变化 | 新瓶颈 |
|---|---|---|
| 写一个 service 很慢 | agent 可以快速生成 service 和测试 | service 边界是否选对 |
| 多轮探索代码库占用人力 | sub-agent 可以烧掉 93.7k tokens 后只回传摘要 | 主上下文是否保持干净 |
| 长计划看起来必要 | PRD 可以从对齐会话中自动总结 | 对齐是否真的发生 |
| 按数据库、API、前端分层开发很自然 | AI 特别容易横向写完一层再写下一层 | 是否能早得到端到端反馈 |
| 测试是质量保障 | TDD 变成 agent 不作弊的约束 | 测试是否先于实现、是否打到真实边界 |
| 文档能帮助后来者 | 旧 PRD 可能误导未来 agent | 文档生命周期是否受控 |
| code review 是最后一道门 | agent 输出变多，review 压力上升 | 人把品味放在哪里 |

这张表解释了为什么 Matt 一直强调 smart zone、Memento、vertical slices、TDD、deep modules 和 manual QA。它们看似是不同技巧，其实都在回答同一个问题：当代码生成变便宜以后，什么反馈能让便宜的代码不污染系统？

## 第一层反馈：上下文反馈

Matt 引用 Dex Horthy 的说法，把 LLM 的工作区分成 smart zone 和 dumb zone。他的经验线大约是 100k tokens：上下文越长，attention 关系越拥挤，模型越容易做出奇怪决定。即使有 1 million context window，他也认为这对检索更有用，对编码不等于更聪明。

这解释了他为什么讨厌无休止 compact。compact 会把旧会话压缩成历史沉积物，继续塞进下一轮。Matt 更愿意把 LLM 当成《Memento》里的主角：它会忘，那就接受它会忘；每次清空回到一个稳定、短小、可预测的系统提示。

这不是洁癖，而是成本控制。上下文不是越多越好，上下文是一种会污染判断的资源。好的 AI 编码流程，需要把探索、实现、测试分成可清空、可重启、可交接的阶段。

sub-agent 的价值也在这里。探索 agent 可以在独立上下文里花掉大量 tokens，看完整个代码库，然后只把有用摘要回传给 orchestrator。主 agent 不必背着所有探索过程继续实现。换句话说，sub-agent 不是为了显得高级，而是为了隔离上下文成本。

## 第二层反馈：任务反馈

AI 很喜欢横向开发。

它会先做数据库 schema，再做 API，再做前端。这个顺序在人类看来很自然，因为系统本来就有层次。但它的问题是：直到很晚，你才知道这些层能不能一起工作。

Matt 用 Pragmatic Programmer 里的 tracer bullets 解释更好的拆法：不要横着切，要竖着切。第一张 issue 不应该是“创建 gamification service”，而应该是“用户完成课程后获得积分，并能在 dashboard 上看到”。这意味着同一小片工作会穿过 schema、service、route 和 UI，哪怕每一层只做最小实现。

竖切的价值不是更优雅，而是反馈更早。agent 写完一小片，你马上能跑真实路径，马上能发现缺表、缺迁移、UI 没接上、服务边界不对。横向任务看起来整齐，但它把坏消息延迟到最后；竖向任务看起来粗糙，却把坏消息提前暴露。

这也是 Kanban 比线性 multi-phase plan 更适合 agent 的原因。线性计划只有一个 agent 能顺着跑；带依赖关系的 issue board 可以让多个 agent 同时拿不互相阻塞的任务。真正的并行化不是“多开几个模型”，而是先把任务拆成彼此边界清楚、反馈路径完整、依赖关系明确的工作包。

## 第三层反馈：代码反馈

TDD 在这套流程里不是信仰，而是防作弊机制。

Matt 观察到，如果让 agent 先写完整实现，再补测试，agent 很容易写出表面测试。它知道自己刚写了什么，于是测试会贴着实现走，而不是贴着行为走。红绿重构反过来逼它先描述失败，再写代码通过。测试先出现，agent 就不容易用实现细节糊弄测试。

但测试还只是反馈基础设施的一部分。Matt 更强调模块形状。

他借 John Ousterhout 的 deep module / shallow module 概念说明：一堆浅模块会让 agent 在依赖图里迷路，也让测试边界变得尴尬。你到底要测每个小函数，还是 mock 掉一串依赖？AI 在这种结构里容易补出一堆碎测试，看起来覆盖很多，实际抓不住关键行为。

深模块相反：接口窄，内部深，行为边界清楚。人负责设计模块接口，agent 可以实现模块内部。这样工程师仍然保留代码库的心理地图：我知道这些灰盒做什么、接口是什么、行为如何被测试，但我不必逐行记住内部实现。

这可能是 AI 编码时代最实际的架构建议：不要把架构权交给 agent。你可以把实现权交出去，但模块边界、接口形状、测试边界必须由人看住。

## 第四层反馈：人的品味反馈

Matt 最后仍然把 manual QA 放在核心位置。

这不是因为他不相信自动化。恰恰相反，他的流程里有 type check、test、agent review、Docker sandbox、worktree、merge agent、reviewer agent。但他仍然说，QA 是把人的意见重新施加到代码库上的地方。

这句话很重要。AI 能让很多团队更快地产生“可运行的软件”，但“可运行”不是“值得使用”。尤其在前端，Matt 认为 AI 还很难真正判断一个成熟代码库里的界面是否好用。可以让它做 throwaway prototype，生成几个可点击方案供人选择；但最终的视觉判断、交互取舍和产品味道，仍然要靠人。

所以 AI 编码不会减少 review，它很可能增加 review。因为实现吞吐上去了，审查、QA、设计判断就成了拥堵点。那些想把 idea、research、prototype、implementation、QA 全部自动化的团队，最后很容易得到一种东西：能跑，但没有味道。

## 这套机制在哪里会失效

第一，反馈基础设施太弱时会失效。没有测试、没有 type check、没有可重复启动环境、没有端到端路径，agent 就是在盲写。你给它再好的 prompt，也只是让它更有礼貌地猜。

第二，任务边界太大时会失效。超过 smart zone 后，模型会忘掉局部约束，开始做看似合理但彼此冲突的决定。大上下文能帮检索，不自动等于好工程判断。

第三，团队把文档当永久真相时会失效。旧 PRD 如果长期留在 repo 里，未来 agent 可能把它当当前事实。Matt 把这叫 doc rot。对 agent 来说，过期文档不是中性背景，而是有害输入。

第四，人放弃代码库心理地图时会失效。速度越快，越容易觉得自己不再需要理解代码。但如果模块形状也被 agent 决定，你得到的不是杠杆，而是一个你无法改进的系统。

## 工程师的新工作不是少了，而是换了位置

如果把这场 workshop 压成一个决策框架，我会这样用：

| 场景 | 应该交给 AI | 人必须保留 |
|---|---|---|
| 需求早期模糊 | 让 AI relentlessly grill you | 回答取舍，确认边界 |
| 目标已对齐 | 让 AI 总结 PRD | 判断是否真的达成共享设计概念 |
| 实现任务拆分 | 让 AI 起草 issue board | 把横向任务改成竖向 slice |
| 代码实现 | 让 agent 在 sandbox/worktree 里做 AFK 任务 | 设计模块接口和测试边界 |
| 自动验证 | 让 AI 跑 test、type check、review | 判断反馈是否覆盖真实风险 |
| UI 和产品体验 | 让 AI 做 throwaway prototype | 用人的眼睛做 QA 和品味判断 |

AI 编码让工程师不用手写那么多代码，但它没有让工程师不用做工程。相反，它把工程师推到了更靠前、更抽象、也更难逃避的位置：定义问题，设计反馈，切分任务，保护边界，审查结果。

过去，一个强工程师的价值常常体现在“我能把复杂实现写出来”。现在，这种价值正在迁移到另一句话上：我能不能让一个便宜、快速、健忘、会自信犯错的实现者，在正确的反馈系统里持续产出好代码？

这就是 AI coding 的新价格表。

代码变便宜以后，真正昂贵的不是实现，而是让实现持续接近真实。

---

## Source Notes

Source: `[FULL WORKSHOP] AI Coding For Real Engineers - Matt Pocock, AI Hero (@mattpocockuk ).md`, published 2026-04-24, saved 2026-04-26.

Compact source map: smart zone / dumb zone around 100k tokens; Memento-style context clearing vs compact sediment; tiny system prompt; Grill Me skill for shared design concept; Sarah Chen gamification example; 40-100 question grilling sessions; sub-agent spent 93.7k tokens while parent context stayed smaller; PRD as destination document; Matt says he often does not read the PRD after alignment; vertical slices / tracer bullets over horizontal database-API-frontend phases; Kanban issues with blockers and AFK classification; Ralph loop over local issue files; TDD red-green-refactor to reduce test cheating; automated tests and type check as AI performance ceiling; manual QA caught missing `PointEvents` table; “human touch” prevents slop; deep modules vs shallow modules; doc rot from stale PRDs; push vs pull coding standards; Sandcastle with Docker sandbox, worktree, implementer, reviewer, merger.

Thesis tournament winner: “AI 编码的新价格表” scored highest because it explains context limits, Grill Me, PRD, Kanban, TDD, deep modules, manual QA, doc rot, and reviewer pressure under one mechanism: implementation got cheaper, feedback became scarce.

Quality score: 92/100. Strongest dimensions: cost-structure clarity, source-material density, action framework. Lowest dimensions: external validation beyond the single workshop source, which is intentionally limited because the request was attachment-based.
