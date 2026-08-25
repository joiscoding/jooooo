from __future__ import annotations

import re
import sys
import tokenize
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SKIPPED_DIRS = {
    '.git',
    'dist',
    'node_modules',
}
TYPE_SCRIPT_SUFFIXES = {
    '.cts',
    '.mts',
    '.tsx',
}
CAMEL_CASE_NAME = re.compile(r'^[a-z][A-Za-z0-9_]*[A-Z][A-Za-z0-9_]*$')


def is_skipped(path: Path) -> bool:
    relative_parts = path.relative_to(ROOT).parts
    return any(part in SKIPPED_DIRS for part in relative_parts)


def iter_repo_files() -> list[Path]:
    return [path for path in ROOT.rglob('*') if path.is_file() and not is_skipped(path)]


def find_type_script_errors(paths: list[Path]) -> list[str]:
    errors: list[str] = []

    for path in paths:
        if path.suffix in TYPE_SCRIPT_SUFFIXES:
            errors.append(f'{path.relative_to(ROOT)} must use a .ts extension')

    return errors


def find_python_name_errors(paths: list[Path]) -> list[str]:
    errors: list[str] = []

    for path in paths:
        if path.suffix != '.py':
            continue

        try:
            with path.open('rb') as file_obj:
                tokens = tokenize.tokenize(file_obj.readline)
                for token in tokens:
                    if token.type != tokenize.NAME:
                        continue
                    if CAMEL_CASE_NAME.match(token.string):
                        location = f'{path.relative_to(ROOT)}:{token.start[0]}:{token.start[1] + 1}'
                        errors.append(f'{location} uses camelCase identifier "{token.string}"')
        except tokenize.TokenError as exc:
            errors.append(f'{path.relative_to(ROOT)} could not be tokenized: {exc}')

    return errors


def main() -> int:
    paths = iter_repo_files()
    errors = [
        *find_type_script_errors(paths),
        *find_python_name_errors(paths),
    ]

    if errors:
        print('Coding standard violations found:')
        for error in errors:
            print(f'- {error}')
        return 1

    print('Coding standards passed.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
