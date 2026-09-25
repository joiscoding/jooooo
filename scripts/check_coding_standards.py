import ast
import re
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CAMEL_CASE_RE = re.compile(r"[a-z0-9][A-Z]")


@dataclass(frozen=True)
class naming_issue:
    path: Path
    line: int
    name: str


def git_file_paths() -> list[Path]:
    result = subprocess.run(
        ["git", "ls-files", "--cached", "--others", "--exclude-standard"],
        cwd=ROOT,
        check=True,
        text=True,
        capture_output=True,
    )
    return [
        ROOT / line
        for line in result.stdout.splitlines()
        if line and (ROOT / line).is_file()
    ]


def is_camel_case(name: str) -> bool:
    return bool(CAMEL_CASE_RE.search(name))


def python_naming_issues(path: Path) -> list[naming_issue]:
    tree = ast.parse(path.read_text(encoding="utf-8"), filename=str(path))
    issues: list[Naming_issue] = []
    seen: set[tuple[int, str]] = set()

    def add_issue(line: int, name: str) -> None:
        if not is_camel_case(name):
            return
        key = (line, name)
        if key in seen:
            return
        seen.add(key)
        issues.append(naming_issue(path=path, line=line, name=name))

    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
            add_issue(node.lineno, node.name)
        elif isinstance(node, ast.arg):
            add_issue(node.lineno, node.arg)
        elif isinstance(node, ast.Name) and isinstance(node.ctx, (ast.Store, ast.Del)):
            add_issue(node.lineno, node.id)
        elif isinstance(node, ast.alias) and node.asname:
            add_issue(node.lineno, node.asname)

    return issues


def main() -> int:
    paths = git_file_paths()
    tsx_paths = sorted(path for path in paths if path.suffix == ".tsx")
    naming_issues = [
        issue
        for path in paths
        if path.suffix == ".py"
        for issue in python_naming_issues(path)
    ]

    if not tsx_paths and not naming_issues:
        print("Coding standards check passed.")
        return 0

    if tsx_paths:
        print("TypeScript files must use the .ts extension, not .tsx:")
        for path in tsx_paths:
            print(f"  - {path.relative_to(ROOT)}")

    if naming_issues:
        print("Python identifiers must not use camelCase:")
        for issue in naming_issues:
            relative = issue.path.relative_to(ROOT)
            print(f"  - {relative}:{issue.line} {issue.name}")

    return 1


if __name__ == "__main__":
    sys.exit(main())
