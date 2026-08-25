#!/usr/bin/env python3
import ast
import keyword
import re
import subprocess
import sys
from pathlib import Path
from typing import Iterable

ROOT = Path(__file__).resolve().parents[1]
CAMEL_CASE_PATTERN = re.compile(r'[a-z][a-z0-9]*[A-Z]')
FORBIDDEN_TYPESCRIPT_SUFFIXES = {'.tsx', '.mts', '.cts'}


def repo_files() -> list[Path]:
    result = subprocess.run(
        ['git', 'ls-files', '--cached', '--others', '--exclude-standard'],
        cwd=ROOT,
        check=True,
        stdout=subprocess.PIPE,
        text=True,
    )
    return [ROOT / line for line in result.stdout.splitlines() if line and (ROOT / line).exists()]


def python_files(files: Iterable[Path]) -> list[Path]:
    return [path for path in files if path.suffix == '.py']


def bad_typescript_files(files: Iterable[Path]) -> list[Path]:
    return [
        path
        for path in files
        if path.suffix in FORBIDDEN_TYPESCRIPT_SUFFIXES
    ]


def has_camel_case(value: str) -> bool:
    return bool(CAMEL_CASE_PATTERN.search(value))


def node_names(node: ast.AST) -> Iterable[str]:
    for child in ast.walk(node):
        if isinstance(child, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
            yield child.name
        elif isinstance(child, ast.Name):
            yield child.id
        elif isinstance(child, ast.arg):
            yield child.arg
        elif isinstance(child, ast.Attribute) and isinstance(child.ctx, ast.Store):
            yield child.attr
        elif isinstance(child, ast.alias):
            yield child.asname or child.name.rsplit('.', 1)[-1]
        elif isinstance(child, ast.ExceptHandler) and child.name:
            yield child.name


def python_camel_case_errors(path: Path) -> list[str]:
    source = path.read_text()
    tree = ast.parse(source, filename=str(path))
    errors: list[str] = []

    for name in sorted(set(node_names(tree))):
        if keyword.iskeyword(name):
            continue
        if has_camel_case(name):
            errors.append(f'{path.relative_to(ROOT)}: Python identifier `{name}` is camelCase')

    return errors


def main() -> int:
    files = repo_files()
    errors: list[str] = []

    errors.extend(
        f'{path.relative_to(ROOT)}: TypeScript source must use the .ts extension'
        for path in bad_typescript_files(files)
    )

    for path in python_files(files):
        errors.extend(python_camel_case_errors(path))

    if errors:
        print('Coding standards check failed:')
        for error in errors:
            print(f'- {error}')
        return 1

    print('Coding standards check passed.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
