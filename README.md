# mcp-npm

npm MCP — wraps the npm Registry API (free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search_packages` | Search npm for packages by keyword. Returns package names, descriptions, latest versions, publish dates, and publishers. Use when discovering libraries for a task. |
| `get_package` | Get full details for a specific package: version, description, dependencies, homepage, repository, and license. Use after search_packages to evaluate a candidate package. |
| `get_downloads` | Fetch npm download counts for a package over a named period (last-day, last-week, last-month, last-year) or a custom date range like "2024-01-01:2024-06-30". Returns total downloads, start date, and end date. |
| `list_versions` | List published versions of an npm package with publish dates, dist-tags (latest/next/beta), and deprecation notices — answers "what versions of <pkg> exist", "when was <pkg> last published", "is the latest version deprecated". Returns versions newest-first, plus the package created/last-modified timestamps. |
| `get_version_info` | Get metadata for a SPECIFIC version (or dist-tag) of an npm package: dependencies, dev/peer dependencies, engines, license, tarball + integrity hash + unpacked size, and any deprecation notice. Use for "dependencies of <pkg>@<version>", pinned-version audits, or inspecting a particular release. Version accepts an exact version (e.g. "4.18.2"), a dist-tag (e.g. "latest", "next"), or omit for the latest. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "npm": {
      "url": "https://gateway.pipeworx.io/npm/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Npm data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
