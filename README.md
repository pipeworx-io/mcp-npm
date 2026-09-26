# mcp-npm

npm MCP — wraps the npm Registry API (free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1683+ live data sources.

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

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/npm/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1683+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## No MCP client? Call it over HTTP

```bash
curl -X POST https://gateway.pipeworx.io/v1/tools/npm_search_packages \
  -H 'Content-Type: application/json' \
  -d '{"query":"http server framework"}'
```

No account needed for the first calls. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/npm_search_packages`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.

## Standalone (no gateway account)

This package also runs as a local stdio MCP server — no Pipeworx account, no
gateway round-trip:

```json
{
  "mcpServers": {
    "npm": {
      "command": "npx",
      "args": ["-y", "@pipeworx/mcp-npm"]
    }
  }
}
```

Or run it directly to confirm it starts:

```bash
npx -y @pipeworx/mcp-npm
```

It speaks MCP over stdin/stdout and answers `initialize`/`tools/list`/`tools/call`
for **only** this pack's tools — none of the shared meta-tools the gateway
connection above adds. Same source, same tools, no ask_pipeworx routing.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Npm data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
