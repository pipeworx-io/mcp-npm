# @pipeworx/mcp-npm

MCP server for npm — search packages, get details, and download stats. Wraps the [npm Registry API](https://github.com/npm/registry/blob/main/docs/REGISTRY-API.md) (free, no auth required).

## Tools

| Tool | Description |
|------|-------------|
| `search_packages` | Search the npm registry for packages by keyword |
| `get_package` | Get detailed metadata for a specific npm package |
| `get_downloads` | Get download counts for a package over a given period |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "npm": {
      "url": "https://gateway.pipeworx.io/npm/mcp"
    }
  }
}
```

Or run via CLI:

```bash
npx pipeworx use npm
```

## License

MIT
