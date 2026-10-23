#!/usr/bin/env python3
import ast
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TYPE_SCRIPT_EXTENSIONS = {'.cts', '.ctsx', '.mts', '.mtsx', '.tsx'}


def tracked_paths() -> list[Path]:
  result = subprocess.run(
    ['git', 'ls-files', '--cached', '--others', '--exclude-standard'],
    cwd=ROOT,
    check=True,
    capture_output=True,
    text=True,
  )
  return [
    ROOT / line
    for line in result.stdout.splitlines()
    if line and (ROOT / line).exists()
  ]


def is_camel_case(name: str) -> bool:
  if name.startswith('__') and name.endswith('__'):
    return False
  return bool(re.search(r'[a-z][A-Z]', name) or re.match(r'[A-Z][a-z]', name))


def stored_names(node: ast.AST) -> list[tuple[str, int]]:
  names: list[tuple[str, int]] = []
  for child in ast.walk(node):
    if isinstance(child, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
      names.append((child.name, child.lineno))
    elif isinstance(child, ast.arg):
      names.append((child.arg, child.lineno))
    elif isinstance(child, ast.Name) and isinstance(child.ctx, ast.Store):
      names.append((child.id, child.lineno))
    elif isinstance(child, ast.alias) and child.asname:
      names.append((child.asname, child.lineno))
  return names


def python_errors(path: Path) -> list[str]:
  relative_path = path.relative_to(ROOT)
  tree = ast.parse(path.read_text(), filename=str(relative_path))
  return [
    f'{relative_path}:{line}: Python identifier "{name}" must use snake_case.'
    for name, line in stored_names(tree)
    if is_camel_case(name)
  ]


def type_script_extension_errors(paths: list[Path]) -> list[str]:
  errors = []
  for path in paths:
    relative_path = path.relative_to(ROOT)
    if path.suffix in TYPE_SCRIPT_EXTENSIONS:
      errors.append(f'{relative_path}: TypeScript files must end with .ts.')
  return errors


def main() -> int:
  paths = tracked_paths()
  errors = type_script_extension_errors(paths)

  for path in paths:
    if path.suffix == '.py':
      errors.extend(python_errors(path))

  if errors:
    print('\n'.join(errors))
    return 1

  print('Coding standards check passed.')
  return 0


if __name__ == '__main__':
  sys.exit(main())
