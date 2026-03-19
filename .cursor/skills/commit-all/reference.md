# Commit all — reference

## Ordering commits

Prefer commits that **do not break the build** if checked out mid-series:

1. `[chore]` / `[build]` that other commits depend on
2. `[refactor]` / `[style]` that are mechanical
3. `[feat]` / `[fix]` / `[perf]`
4. `[test]` if it assumes new behavior (sometimes pair tests with feature in same commit—use judgment)
5. `[docs]` last if docs describe the new behavior

## If pre-commit hooks fail

Report the hook output. Offer: fix the issue, amend, or split the bucket so only compliant changes land first.

## Amend vs new commit

Default to **new commits** for bucketed workflow. Use `commit --amend` only if the user asks or if the last commit was clearly a mistake in the same bucket.

## Remote / branch edge cases

- **Detached HEAD**: stop and ask how to proceed.
- **Behind remote**: mention `git pull --rebase` (or merge) before push if relevant; do not force-push unless the user explicitly requests it and the policy allows it.
