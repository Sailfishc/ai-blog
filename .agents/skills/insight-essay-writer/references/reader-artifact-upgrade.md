# Reader Artifact Upgrade Gate

A reader artifact should change a real decision, not decorate the article.

## When to upgrade

If a table only has `type / signal / action`, test whether a reader could use it in a meeting tomorrow. If the answer is weak, add one or two operational columns.

## Upgrade columns

| Column | Use when |
|---|---|
| Default path | Reader needs a first move |
| Exit condition | Reader needs to know when to stop or switch |
| Owner | Multiple roles are involved |
| Review cadence | The decision changes over time |
| Escalation trigger | Some cases require heavier process |
| What to avoid | The common mistake is predictable |

## Strong artifact examples

| Scenario | Default path | Exit condition |
|---|---|---|
| Model behavior unstable | Write 5-10 evals | Eval passes consistently, or confirms a model capability gap |
| Model crutch feature | Ship with review point | Next model upgrade weakens, removes, or turns it into explanation UI |
| Automation at 90-95% | Narrow the scope and keep tuning | One week of real use without manual cleanup |

## Final checks

- Title matches the rows.
- Rows are mutually distinct.
- Each row changes a real choice.
- The prose before the artifact explains why it exists.
- The prose after the artifact tells the reader how to use it.
