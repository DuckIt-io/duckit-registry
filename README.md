# Duckit Registry

Modern component registry platform for the React ecosystem. Discover, preview, and install high-quality UI components directly into your projects.

Unlike traditional npm packages, Duckit distributes **source code** through a registry compatible with the shadcn/ui Registry API, so you fully own and customize every component.

## Packages

| Package | Description | npm |
|---------|-------------|-----|
| `@duckit/registry` | Component registry metadata | [View](https://www.npmjs.com/package/@duckit/registry) |
| `@duckit/cli` | CLI tool for installation | [View](https://www.npmjs.com/package/@duckit/duckit) |

## Quick Start

### 1. Init project

```bash
npx @duckit/duckit@latest init
```

This will:
- Create `components.json`
- Add `src/lib/utils.ts` with `cn()` utility
- Install required dependencies
- Set up alias configuration for your framework

### 2. Add components

```bash
npx @duckit/duckit@latest add button
npx @duckit/duckit@latest add dialog input
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
├── packages/
│   ├── registry/             # @duckit/registry
│   │   ├── package.json
│   │   └── registry.json     # Component metadata & source code
│   │
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
│   ├── sync.sh              # Sync from DuckitIo
│   ├── update-and-publish.sh
│   └── update-registry.sh
│
└── .github/
    └── workflows/
        └── ci.yml
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

# Format code
npm run format
```

### Sync Components

```bash
bash scripts/sync.sh
```

To specify a custom source path:

```bash
SOURCE_DIR=/path/to/components bash scripts/sync.sh
```

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
