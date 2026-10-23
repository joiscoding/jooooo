#!/usr/bin/env python3
from __future__ import annotations

import ast
import re
import subprocess
import sys
from pathlib import Path


CAMEL_CASE_RE = re.compile(r"[a-z0-9][A-Z]")
TYPE_SCRIPT_EXTENSIONS = {".cts", ".mts", ".tsx"}


def tracked_paths() -> list[Path]:
    result = subprocess.run(
        ["git", "ls-files", "--cached", "--others", "--exclude-standard"],
        check=True,
        capture_output=True,
        text=True,
    )
    return [Path(path) for path in result.stdout.splitlines() if Path(path).is_file()]


def has_camel_case(name: str) -> bool:
    if name.startswith("__") and name.endswith("__"):
        return False
    return CAMEL_CASE_RE.search(name) is not None


def python_identifier_issues(path: Path) -> list[str]:
    try:
        tree = ast.parse(path.read_text(encoding="utf-8"), filename=str(path))
    except SyntaxError as error:
        return [f"{path}:{error.lineno}: unable to parse Python file"]

    issues: list[str] = []

    def add_issue(name: str, line_number: int) -> None:
        if has_camel_case(name):
            issues.append(f"{path}:{line_number}: use snake_case instead of {name}")

    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
            add_issue(node.name, node.lineno)
        elif isinstance(node, ast.arg):
            add_issue(node.arg, node.lineno)
        elif isinstance(node, ast.Name) and isinstance(node.ctx, ast.Store):
            add_issue(node.id, node.lineno)
        elif isinstance(node, ast.alias) and node.asname:
            add_issue(node.asname, node.lineno)

    return issues


def type_script_extension_issues(path: Path) -> list[str]:
    if path.suffix not in TYPE_SCRIPT_EXTENSIONS:
        return []
    return [f"{path}: TypeScript source files must use the .ts extension"]


def main() -> int:
    issues: list[str] = []

    for path in tracked_paths():
        issues.extend(type_script_extension_issues(path))
        if path.suffix == ".py":
            issues.extend(python_identifier_issues(path))

    if issues:
        print("Coding standards check failed:", file=sys.stderr)
        for issue in issues:
            print(f"- {issue}", file=sys.stderr)
        return 1

    print("Coding standards check passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
