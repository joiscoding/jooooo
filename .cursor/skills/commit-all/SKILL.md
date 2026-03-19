---
name: commit-all
description: Groups working-tree changes into logical git commits with short bracket-tagged messages ([feat], [docs], [fix], etc.), waits for explicit user confirmation, then commits each bucket and pushes. Use when the user asks to commit everything, batch-commit by area, "commit all", or wants staged work split into multiple small commits before push.
---

# Commit all (bucketed commits + push)

From `git status`, build **one commit per bucket** with **`[type] short imperative line`** (~≤50 chars; use `[feat]` not `feat:`). **Stage → commit each bucket** only after the user **explicitly OKs** the plan; **`git push`** only after they confirm push (upstream; if none, ask).

**Safety:** Never push unconfirmed. Skip `.env`/secrets/credentials; call them out. Prefer `git add -p` or `git add <paths>` per bucket.

**Inspect:** `git status`; add `git diff --stat` or small `git diff` when intent is unclear.

**Bucket + tags:** Group by concern (reviewer expectations). Tags: `[feat]` behavior/UI/API; `[fix]` bugs; `[docs]` README, `*.md`, `docs/`; `[chore]` tooling, deps, housekeeping; `[refactor]` same behavior; `[style]` format-only; `[test]` tests/fixtures; `[perf]` performance; `[build]` CI, bundler. Docs-only → `[docs]`; lockfiles/CI → pick `[chore]` or `[build]` and stay consistent; big mixed diffs → split by directory or feature.

**Plan (ask OK):** Numbered list: message + paths, e.g. `1. [docs] refresh README — README.md`. Ask: OK to execute, or regroup/edit messages.

**Execute:** Per bucket: stage → `git commit -m "[type] description"`. Then `git status`. Mixed hunks in one file: `git add -p` or ask one tag vs squash.

**Push:** After push is part of confirmed intent.

**Edge cases:** Ordering, hooks, detached HEAD, force-push — [reference.md](reference.md).
