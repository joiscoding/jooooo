#!/usr/bin/env python3
"""Enforce repository coding standards that are not covered by the compiler."""

from __future__ import annotations

import ast
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SKIPPED_DIRS = {'.git', '.venv', 'dist', 'node_modules'}
CAMEL_CASE_PATTERN = re.compile(r'[a-z][A-Z]')


def iter_repo_files() -> list[Path]:
    return [
        path
        for path in ROOT.rglob('*')
        if path.is_file() and not any(part in SKIPPED_DIRS for part in path.relative_to(ROOT).parts)
    ]


def is_camel_case(name: str) -> bool:
    return bool(CAMEL_CASE_PATTERN.search(name))


def report_tsx_files(paths: list[Path]) -> list[str]:
    return [
        f'TypeScript source must end in .ts, not .tsx: {path.relative_to(ROOT)}'
        for path in paths
        if path.suffix == '.tsx'
    ]


def python_identifier_errors(path: Path) -> list[str]:
    source = path.read_text(encoding='utf-8')
    try:
        tree = ast.parse(source, filename=str(path))
    except SyntaxError as error:
        return [f'Could not parse Python file {path.relative_to(ROOT)}: {error}']

    errors: list[str] = []
    relative_path = path.relative_to(ROOT)
    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
            if is_camel_case(node.name):
                errors.append(
                    f'Python identifier uses camelCase in {relative_path}:{node.lineno}: {node.name}'
                )
        elif isinstance(node, ast.arg):
            if is_camel_case(node.arg):
                errors.append(
                    f'Python identifier uses camelCase in {relative_path}:{node.lineno}: {node.arg}'
                )
        elif isinstance(node, ast.Name) and isinstance(node.ctx, ast.Store):
            if is_camel_case(node.id):
                errors.append(
                    f'Python identifier uses camelCase in {relative_path}:{node.lineno}: {node.id}'
                )
        elif isinstance(node, ast.keyword) and node.arg and is_camel_case(node.arg):
            errors.append(
                f'Python keyword uses camelCase in {relative_path}:{node.lineno}: {node.arg}'
            )

    return errors


def main() -> int:
    paths = iter_repo_files()
    errors = report_tsx_files(paths)
    for path in paths:
        if path.suffix == '.py':
            errors.extend(python_identifier_errors(path))

    if errors:
        print('Coding standards check failed:', file=sys.stderr)
        for error in errors:
            print(f'- {error}', file=sys.stderr)
        return 1

    print('Coding standards check passed.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
