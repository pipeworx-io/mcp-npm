interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * npm MCP — wraps the npm Registry API (free, no auth)
 *
 * Tools:
 * - search_packages: search the npm registry by keyword
 * - get_package: fetch metadata for a specific package
 * - get_downloads: fetch download counts for a package
 */


const REGISTRY = 'https://registry.npmjs.org';
const DOWNLOADS = 'https://api.npmjs.org/downloads/point';

const tools: McpToolExport['tools'] = [
  {
    name: 'search_packages',
    description:
      'Search the npm registry for packages. Returns name, description, latest version, publish date, and publisher.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query string' },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return (default 10, max 50)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_package',
    description:
      'Get detailed metadata for a specific npm package: version, description, dependencies, homepage, and repository.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Exact package name (e.g., "express", "lodash")' },
      },
      required: ['name'],
    },
  },
  {
    name: 'get_downloads',
    description:
      'Get the download count for an npm package over a given period (e.g., last-week, last-month, last-day).',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Package name' },
        period: {
          type: 'string',
          description:
            'Download period: last-day, last-week (default), last-month, or a date range like 2024-01-01:2024-06-30',
        },
      },
      required: ['name'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'search_packages':
      return searchPackages(args.query as string, (args.limit as number) ?? 10);
    case 'get_package':
      return getPackage(args.name as string);
    case 'get_downloads':
      return getDownloads(args.name as string, (args.period as string) ?? 'last-week');
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function searchPackages(query: string, limit: number) {
  const size = Math.min(50, Math.max(1, limit));
  const params = new URLSearchParams({ text: query, size: String(size) });
  const res = await fetch(`${REGISTRY}/-/v1/search?${params}`);
  if (!res.ok) throw new Error(`npm search error: ${res.status} ${res.statusText}`);

  const data = (await res.json()) as {
    objects: {
      package: {
        name: string;
        description?: string;
        version: string;
        date: string;
        publisher?: { username: string };
        links?: { homepage?: string; repository?: string };
        keywords?: string[];
      };
      score: { final: number };
    }[];
    total: number;
  };

  return {
    total: data.total,
    packages: data.objects.map((obj) => ({
      name: obj.package.name,
      description: obj.package.description ?? null,
      version: obj.package.version,
      date: obj.package.date,
      publisher: obj.package.publisher?.username ?? null,
      keywords: obj.package.keywords ?? [],
      homepage: obj.package.links?.homepage ?? null,
      score: Math.round(obj.score.final * 100) / 100,
    })),
  };
}

async function getPackage(packageName: string) {
  const res = await fetch(`${REGISTRY}/${encodeURIComponent(packageName)}/latest`);
  if (!res.ok) {
    if (res.status === 404) throw new Error(`Package not found: ${packageName}`);
    throw new Error(`npm registry error: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as {
    name: string;
    version: string;
    description?: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    homepage?: string;
    repository?: { url?: string } | string;
    license?: string;
    author?: { name?: string } | string;
    keywords?: string[];
    engines?: Record<string, string>;
  };

  const repoUrl =
    typeof data.repository === 'string'
      ? data.repository
      : (data.repository?.url ?? null);

  const authorName =
    typeof data.author === 'string' ? data.author : (data.author?.name ?? null);

  return {
    name: data.name,
    version: data.version,
    description: data.description ?? null,
    license: data.license ?? null,
    author: authorName,
    keywords: data.keywords ?? [],
    homepage: data.homepage ?? null,
    repository: repoUrl,
    dependencies: data.dependencies ?? {},
    devDependencies: data.devDependencies ?? {},
    peerDependencies: data.peerDependencies ?? {},
    engines: data.engines ?? {},
  };
}

async function getDownloads(packageName: string, period: string) {
  const res = await fetch(
    `${DOWNLOADS}/${encodeURIComponent(period)}/${encodeURIComponent(packageName)}`,
  );
  if (!res.ok) {
    if (res.status === 404) throw new Error(`Package not found: ${packageName}`);
    throw new Error(`npm downloads error: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as {
    downloads: number;
    start: string;
    end: string;
    package: string;
  };

  return {
    package: data.package,
    downloads: data.downloads,
    period,
    start: data.start,
    end: data.end,
  };
}

export default { tools, callTool } satisfies McpToolExport;
