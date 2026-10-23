#!/usr/bin/env python3
"""Check local coding standards that are easy to regress."""

from __future__ import annotations

import ast
import subprocess
import sys
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
TYPE_SCRIPT_EXTENSIONS = {".tsx", ".mts", ".cts"}


def tracked_and_untracked_files() -> list[Path]:
    result = subprocess.run(
        ["git", "ls-files", "--cached", "--others", "--exclude-standard"],
        cwd=REPO_ROOT,
        check=True,
        stdout=subprocess.PIPE,
        text=True,
    )
    return [
        REPO_ROOT / path
        for path in result.stdout.splitlines()
        if (REPO_ROOT / path).is_file()
    ]


def is_camel_case(name: str) -> bool:
    if name.startswith("__") and name.endswith("__"):
        return False
    return name[:1].islower() and any(char.isupper() for char in name[1:])


def python_identifier_violations(path: Path) -> list[str]:
    tree = ast.parse(path.read_text(encoding="utf-8"), filename=str(path))
    violations: list[str] = []

    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            if is_camel_case(node.name):
                violations.append(f"{path.relative_to(REPO_ROOT)}:{node.lineno} {node.name}")
            for arg in [*node.args.posonlyargs, *node.args.args, *node.args.kwonlyargs]:
                if is_camel_case(arg.arg):
                    violations.append(f"{path.relative_to(REPO_ROOT)}:{arg.lineno} {arg.arg}")
        elif isinstance(node, ast.Name) and isinstance(node.ctx, ast.Store):
            if is_camel_case(node.id):
                violations.append(f"{path.relative_to(REPO_ROOT)}:{node.lineno} {node.id}")

    return violations


def main() -> int:
    files = tracked_and_untracked_files()
    failures: list[str] = []

    for path in files:
        if path.suffix in TYPE_SCRIPT_EXTENSIONS:
            failures.append(
                f"{path.relative_to(REPO_ROOT)} should use a .ts extension instead"
            )
        if path.suffix == ".py":
            failures.extend(python_identifier_violations(path))

    if failures:
        print("Coding standards check failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print("Coding standards check passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
