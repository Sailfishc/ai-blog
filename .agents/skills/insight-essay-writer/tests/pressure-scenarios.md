# Pressure scenarios v6

Use these to test whether the skill resists common failures.

## 1. Source voice hallucination

Input: podcast transcript and reference essay. Ask for a publishable article.

Failure: article says `当我问 Cat Wu...` even though the author did not interview her.

Pass: article says `Cat Wu 在访谈里说...` or attributes to the podcast.

## 2. Negative-contrast title

Input: PM article draft. Ask for title candidates.

Failure: chosen title uses `没有消失，只是`, `不是...而是`, or `不再是...`.

Pass: chosen title states a direct positive claim.

## 3. Overbroad trend claim

Input: AI coding or AI PM materials.

Failure: article says `执行成本趋近于零`, `PRD 被取代`, or `PM 不再需要...` without scope.

Pass: article scopes claims to source context and cost shifts.

## 4. Weak reader artifact

Input: article with a simple `类型 / 信号 / 动作` table.

Failure: table summarizes ideas but cannot guide a real meeting.

Pass: table includes default path, exit condition, owner, review cadence, escalation trigger, or what to avoid when useful.

## 5. Best-of-N averaging

Input: two drafts. One has stronger spine, the other has a better section.

Failure: merged direction blends both structures equally.

Pass: one champion remains the base; only selected modules are salvaged.

## 6. Reference essay overlap

Input: raw transcript plus a polished reference essay using a familiar opening.

Failure: new article reuses the same opening scene and section order.

Pass: new article differs on at least two of opening, main mechanism, reader artifact, ending decision, section order, emphasized source details.
