#!/usr/bin/env python3
"""Check project coding standards that are not covered by TypeScript."""

from __future__ import annotations

import ast
import re
import subprocess
import sys
from pathlib import Path


CAMEL_CASE_RE = re.compile(r"^[a-z]+(?:[A-Z][A-Za-z0-9]*)+$")
DISALLOWED_TS_SUFFIXES = {".cts", ".mts", ".tsx"}


def tracked_paths() -> list[Path]:
    result = subprocess.run(
        ["git", "ls-files", "--cached", "--others", "--exclude-standard"],
        check=True,
        stdout=subprocess.PIPE,
        text=True,
    )
    return [
        Path(line)
        for line in result.stdout.splitlines()
        if line and Path(line).is_file()
    ]


def is_camel_case(name: str) -> bool:
    return bool(CAMEL_CASE_RE.match(name))


def names_from_target(node: ast.AST) -> list[str]:
    match node:
        case ast.Name(id=name):
            return [name]
        case ast.Tuple(elts=items) | ast.List(elts=items):
            names: list[str] = []
            for item in items:
                names.extend(names_from_target(item))
            return names
        case _:
            return []


class PythonNameVisitor(ast.NodeVisitor):
    def __init__(self, path: Path) -> None:
        self.path = path
        self.violations: list[str] = []

    def check_name(self, name: str, line: int) -> None:
        if is_camel_case(name):
            self.violations.append(f"{self.path}:{line}: camelCase `{name}`")

    def visit_FunctionDef(self, node: ast.FunctionDef) -> None:
        self.check_name(node.name, node.lineno)
        self.generic_visit(node)

    def visit_AsyncFunctionDef(self, node: ast.AsyncFunctionDef) -> None:
        self.check_name(node.name, node.lineno)
        self.generic_visit(node)

    def visit_arg(self, node: ast.arg) -> None:
        self.check_name(node.arg, node.lineno)
        self.generic_visit(node)

    def visit_Assign(self, node: ast.Assign) -> None:
        for target in node.targets:
            for name in names_from_target(target):
                self.check_name(name, node.lineno)
        self.generic_visit(node)

    def visit_AnnAssign(self, node: ast.AnnAssign) -> None:
        for name in names_from_target(node.target):
            self.check_name(name, node.lineno)
        self.generic_visit(node)

    def visit_AugAssign(self, node: ast.AugAssign) -> None:
        for name in names_from_target(node.target):
            self.check_name(name, node.lineno)
        self.generic_visit(node)

    def visit_For(self, node: ast.For) -> None:
        for name in names_from_target(node.target):
            self.check_name(name, node.lineno)
        self.generic_visit(node)

    def visit_With(self, node: ast.With) -> None:
        for item in node.items:
            if item.optional_vars is None:
                continue
            for name in names_from_target(item.optional_vars):
                self.check_name(name, node.lineno)
        self.generic_visit(node)

    def visit_ExceptHandler(self, node: ast.ExceptHandler) -> None:
        if node.name is not None:
            self.check_name(node.name, node.lineno)
        self.generic_visit(node)

    def visit_NamedExpr(self, node: ast.NamedExpr) -> None:
        for name in names_from_target(node.target):
            self.check_name(name, node.lineno)
        self.generic_visit(node)


def python_violations(path: Path) -> list[str]:
    try:
        tree = ast.parse(path.read_text(encoding="utf-8"), filename=str(path))
    except SyntaxError as err:
        return [f"{path}:{err.lineno}: unable to parse Python file: {err.msg}"]
    visitor = PythonNameVisitor(path)
    visitor.visit(tree)
    return visitor.violations


def main() -> int:
    violations: list[str] = []
    for path in tracked_paths():
        if path.suffix in DISALLOWED_TS_SUFFIXES:
            violations.append(
                f"{path}: TypeScript files must use the .ts extension"
            )
        if path.suffix == ".py":
            violations.extend(python_violations(path))

    if violations:
        print("Coding standard violations found:")
        for violation in violations:
            print(f"- {violation}")
        return 1

    print("Coding standards check passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
