from __future__ import annotations

import ast
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SKIP_DIRS = {
    ".git",
    ".vite",
    "build",
    "coverage",
    "dist",
    "node_modules",
}
TYPESCRIPT_SUFFIXES = {".ts", ".tsx", ".mts", ".cts"}
CAMEL_PATTERN = re.compile(r"[a-z][A-Z]")


def iter_files() -> list[Path]:
    files: list[Path] = []
    for path in ROOT.rglob("*"):
        if any(part in SKIP_DIRS for part in path.relative_to(ROOT).parts):
            continue
        if path.is_file():
            files.append(path)
    return files


def is_camel_name(name: str) -> bool:
    if name.startswith("__") and name.endswith("__"):
        return False
    if name.isupper():
        return False
    return CAMEL_PATTERN.search(name) is not None


def collect_store_names(node: ast.AST) -> list[tuple[str, int, int]]:
    names: list[tuple[str, int, int]] = []
    if isinstance(node, ast.Name):
        names.append((node.id, node.lineno, node.col_offset + 1))
        return names
    if isinstance(node, (ast.Tuple, ast.List)):
        for element in node.elts:
            names.extend(collect_store_names(element))
    return names


def python_name_violations(path: Path) -> list[str]:
    try:
        tree = ast.parse(path.read_text(encoding="utf-8"), filename=str(path))
    except SyntaxError as error:
        return [f"{path.relative_to(ROOT)}:{error.lineno}: invalid Python syntax"]

    names: list[tuple[str, int, int]] = []
    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
            names.append((node.name, node.lineno, node.col_offset + 1))
        elif isinstance(node, ast.arg):
            names.append((node.arg, node.lineno, node.col_offset + 1))
        elif isinstance(node, ast.Name) and isinstance(node.ctx, ast.Store):
            names.append((node.id, node.lineno, node.col_offset + 1))
        elif isinstance(node, ast.ExceptHandler) and node.name:
            names.append((node.name, node.lineno, node.col_offset + 1))
        elif isinstance(node, ast.alias) and node.asname:
            names.append((node.asname, node.lineno, node.col_offset + 1))
        elif isinstance(node, ast.MatchAs) and node.name:
            names.append((node.name, node.lineno, node.col_offset + 1))
        elif isinstance(node, ast.MatchStar) and node.name:
            names.append((node.name, node.lineno, node.col_offset + 1))
        elif isinstance(node, ast.For):
            names.extend(collect_store_names(node.target))

    violations: list[str] = []
    for name, line, column in names:
        if is_camel_name(name):
            violations.append(
                f"{path.relative_to(ROOT)}:{line}:{column}: use snake_case, not {name}"
            )
    return violations


def typescript_extension_violations(files: list[Path]) -> list[str]:
    violations: list[str] = []
    for path in files:
        if path.suffix in TYPESCRIPT_SUFFIXES and not path.name.endswith(".ts"):
            violations.append(
                f"{path.relative_to(ROOT)}: TypeScript files must end with .ts"
            )
    return violations


def main() -> int:
    files = iter_files()
    violations = typescript_extension_violations(files)
    for path in files:
        if path.suffix == ".py":
            violations.extend(python_name_violations(path))

    if not violations:
        print("Coding standards check passed.")
        return 0

    print("Coding standards violations:")
    for violation in violations:
        print(f"- {violation}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
