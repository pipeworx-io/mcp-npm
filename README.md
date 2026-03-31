# mcp-npm

npm MCP — wraps the npm Registry API (free, no auth)

Part of the [Pipeworx](https://pipeworx.io) open MCP gateway.

## Tools

| Tool | Description |
|------|-------------|

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

Or use the CLI:

```bash
npx pipeworx use npm
```

## License

MIT
