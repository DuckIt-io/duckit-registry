# Duckit Registry

Modern component registry platform for the React ecosystem. Discover, preview, and install high-quality UI components directly into your projects.

Unlike traditional npm packages, Duckit distributes **source code** through a registry compatible with the shadcn/ui Registry API, so you fully own and customize every component.

## Packages

| Package | Description | npm |
|---------|-------------|-----|
| `@duckit/registry` | Component registry metadata | [View](https://www.npmjs.com/package/@duckit/registry) |
| `@duckit/cli` | CLI tool for installation | [View](https://www.npmjs.com/package/@duckit/cli) |

## Quick Start

### 1. Init project

```bash
npx @duckit/cli@latest init
```

This will:
- Create `components.json`
- Add `src/lib/utils.ts` with `cn()` utility
- Install required dependencies
- Set up alias configuration for your framework

### 2. Add components

```bash
npx @duckit/cli@latest add button
npx @duckit/cli@latest add dialog input
```

## Available Components

| Component | Description |
|-----------|-------------|
| `button` | Button with multiple variants |
| `alert-dialog` | Alert and confirmation dialog |
| `alert` | Alert banner for notifications |
| `badge` | Badge/label component |
| `breadcrumb` | Navigation breadcrumb |
| `calendar` | Date picker calendar |
| `collapsible` | Collapsible content section |
| `command` | Command palette (cmd+k) |
| `dialog` | Modal dialog |
| `input` | Text input field |
| `input-group` | Grouped input fields |
| `navigation-menu` | Navigation menu |
| `scroll-area` | Custom scrollable area |
| `separator` | Visual separator |
| `sheet` | Side sheet panel |
| `skeleton` | Loading skeleton |
| `tabs` | Tab navigation |
| `textarea` | Multi-line text input |
| `tooltip` | Tooltip on hover |
| `aspect-ratio` | Maintain aspect ratio |

## Design System

Every Duckit component shares one signature style: a **generous radius scale**
(`--duckit-radius: 24px`), **thick inset focus rings** (`ring-3 ring-inset`),
and **compact sizing**. See [docs/design-system.md](docs/design-system.md) for
the full spec — tokens, usage rules, and the contributor checklist.

## Framework Support

Duckit CLI automatically detects your framework:

- **Next.js** — Configures tsconfig path aliases
- **Vite** — Creates/updates vite.config.ts with `@` alias
- **Remix** — Basic setup instructions
- **Create React App** — Basic setup instructions
- **Astro** — Basic setup instructions

## Development

### Project Structure

```
duckit-registry/
├── package.json              # Root workspace config
├── tsconfig.json             # Root TypeScript config
├── vitest.config.ts          # Test configuration
│
├── registry/                 # @duckit/registry
│   ├── package.json
│   └── registry.json         # Component metadata & source code
│
├── packages/
│   ├── cli/                  # @duckit/cli
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── commands/
│   │   │   │   ├── add.ts
│   │   │   │   └── init.ts
│   │   │   └── utils/
│   │   │       ├── framework.ts
│   │   │       ├── registry.ts
│   │   │       └── package.ts
│   │   ├── scripts/
│   │   │   └── generate-registry.ts
│   │   └── package.json
│   │
│   └── config/               # @duckit/config (shared types)
│       └── src/
│           └── index.ts
│
├── src/
│   └── components/ui/        # Component source files
│       ├── button.tsx
│       ├── input.tsx
│       └── ...
│
├── scripts/
│   └── README.md              # Tooling notes
│
└── .github/
    └── workflows/
        ├── ci.yml
        └── release.yml
```

### Commands

```bash
# Install dependencies
npm install

# Build CLI
npm run build

# Run tests
npm test

# Generate registry from component files
npm run generate-registry

# Bump version and publish registry
npm run version:registry
npm run publish:registry

# Format code
npm run format
```

### Workflow

`src/components/ui/` is the **single source of truth** — no external sync. The docs
site (duckit-nest) and the CLI both consume the published `@duckit/registry` npm
package, so a publish is the only "sync" step:

```bash
npm run generate-registry   # 1. regenerate registry JSONs from src/
npm run version:registry    # 2. bump patch version (creates git tag)
npm run publish:registry    # 3. publish to npm
```

After publishing, docs and CLI pick up the new components automatically.

## Registry Schema

The registry uses a categorized schema:

```json
{
  "$schema": "https://duckit.dev/schema.json",
  "version": 1,
  "categories": {
    "components": { ... },
    "animated": { ... },
    "blocks": { ... },
    "sections": { ... },
    "templates": { ... },
    "effects": { ... }
  }
}
```

## License

MIT
