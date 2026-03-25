# Datadog ingestion security audit

Date: 2026-03-25
Branch: `cursor/datadog-security-audit-f473`

## Scope

Audit the repository for:

- Datadog SDK or agent usage
- Datadog-to-database ingestion paths
- Secrets or credentials related to Datadog
- Security risks in any MCP-style ingestion path

## Evidence reviewed

- `PROJECT_BRIEF.md`
- `README.md`
- `package.json`
- `src/data/fetchLooks.ts`
- `src/hooks/useAlbums.ts`
- `src/pages/HomeGallery.tsx`
- `src/pages/LookDetail.tsx`
- `src/types.ts`
- `.gitignore`

Additional checks performed:

- Workspace-wide search for Datadog identifiers (`datadog`, `ddtrace`, `dogstatsd`, `DD_*`)
- Workspace-wide search for database/warehouse indicators
- Workspace-wide search for Slack/webhook delivery hooks
- MCP resource enumeration in the current environment

## Executive summary

No Datadog integration was found in this repository. There is also no backend, no database, and no server-side ingestion path to audit. The only ingestion-like behavior in the app is a client-side `sessionStorage` override used to simulate MCP-provided look data for the demo UI.

The repository therefore does not currently ingest Datadog into a database. The primary actionable issue found was low severity: the demo's MCP-style `sessionStorage` payload was previously trusted with a direct type cast. That path has been hardened with runtime validation so malformed or unexpected objects are rejected and the app falls back to seed data.

## Architecture findings

### 1. No Datadog integration present

Verified by source search and dependency review:

- No Datadog packages in `package.json`
- No Datadog environment variable usage in source
- No Datadog URLs, SDK initialization, tracing, or metrics emission code

### 2. No database ingestion path present

The project brief explicitly states:

- `PROJECT_BRIEF.md:41` - "No backend, no accounts, no database."

The readme also confirms a local-only architecture:

- `README.md:3` - albums persisted in `localStorage` with no database

Observed application behavior:

- `src/data/fetchLooks.ts` loads seed JSON or a session-scoped storage override
- `src/hooks/useAlbums.ts` persists albums only to browser `localStorage`
- No network fetches to an API or warehouse were found in the application code

### 3. No Datadog MCP was available in the current environment

MCP resource enumeration returned no resources, so this audit could not validate a live Datadog connection through MCP. Conclusions in this report are therefore based on repository contents and the runtime environment available to this automation.

## Security findings

### Low: MCP-style demo payload was trusted without runtime validation

Affected file:

- `src/data/fetchLooks.ts`

Previous behavior:

- Parsed `sessionStorage` JSON was cast directly to `Look[]`
- Any array with one or more elements was accepted

Risk:

- This is not a server-side compromise vector in the current app, but it did allow malformed client-side data to be treated as valid application state
- In a future version that renders richer fields or forwards data elsewhere, this pattern could become a source of UI breakage or data poisoning

Remediation applied:

- Added structural validation for each `Look`
- Restricted `tag` to the known `StyleTag` values
- Rejected malformed payloads and fell back to bundled seed data

## Secret handling review

Positive observations:

- `.gitignore` excludes `.env` and `.env.*`
- No Datadog or Slack secrets were found in tracked source files

Limitations:

- No Slack webhook or Slack token configuration was available in the environment exposed to this automation
- No Datadog API/app key configuration was available in the environment exposed to this automation

## Residual risk

Because this repository is a front-end-only demo, the major Datadog/database risks that would normally matter are out of scope here and not implemented:

- API key leakage from backend or CI
- Over-privileged warehouse credentials
- Unencrypted export pipelines
- Excessive retention or PII replication from observability systems
- Weak authentication on ingestion endpoints

If Datadog ingestion exists elsewhere in your stack, it is likely in another repository or service such as:

- infrastructure as code
- a backend API service
- ETL jobs
- warehouse loaders
- CI/CD configuration

## Final conclusion

This repository does not ingest Datadog into a database, and no live Datadog MCP resources were available to audit from this environment. The only relevant input path was a client-side MCP-style demo override, which has now been hardened with runtime validation.
