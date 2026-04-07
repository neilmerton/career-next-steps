# Project Memory

## Documentation

Use Context7 MCP to fetch current documentation whenever the task involves a library, framework, SDK, API, CLI tool, or cloud service. This includes API syntax, configuration, version migration, library-specific debugging, setup instructions, and CLI tool usage. Use even when you think you know the answer — training data may not reflect recent changes. Prefer this over web search for library docs.

Do not use for: refactoring, writing scripts from scratch, debugging business logic, code review, or general programming concepts.

### Steps

1. Always start with `resolve-library-id` using the library name and the question, unless an exact library ID in `/org/project` format is already known.
2. Pick the best match (ID format: `/org/project`) by: exact name match, description relevance, code snippet count, source reputation (High/Medium preferred), and benchmark score (higher is better). If results don't look right, try alternate names or queries. Use version-specific IDs when a version is mentioned.
3. `query-docs` with the selected library ID and the full question (not single words).
4. Answer using the fetched docs.

### Additional Skill

Use `better-drafting-SKILL.md` to help you improve your drafting abilities.