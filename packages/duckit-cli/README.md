# Duckit CLI

CLI tool untuk menambahkan DuckitIO components ke project Anda.

## 🚀 Quick Start

### Init Project Baru

```bash
npx @duckit/duckit@latest init
```

### Add Components

```bash
# Single component
npx @duckit/duckit@latest add button

# Multiple components
npx @duckit/duckit@latest add button input dialog

# Skip confirmation
npx @duckit/duckit@latest add button -y
```

## 📦 Available Components (20 Total)

**Form:** button, input, textarea, input-group

**Navigation:** breadcrumb, navigation-menu, tabs

**Overlay:** dialog, alert-dialog, sheet, tooltip, command

**Display:** alert, badge, separator, skeleton, scroll-area, aspect-ratio, collapsible, calendar

## 📋 Commands

### `init` - Initialize Duckit

```bash
npx @duckit/duckit@latest init
```

Setup project Anda dengan:
- Install dependencies yang diperlukan
- Buat `components.json`
- Buat `src/lib/utils.ts`
- Buat folder `src/components/ui`

### `add` - Add Component

```bash
npx @duckit/duckit@latest add <component> [options]
```

**Options:**
- `-y, --yes` - Skip confirmation prompt
- `-o, --overwrite` - Overwrite existing files

## Setup

Project Anda harus memiliki `components.json` di root directory:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

## Development

### Build CLI

```bash
cd packages/duckit-cli
npm install
npm run build
```

### Generate Registry

```bash
npm run generate-registry
```

### Test Locally

```bash
# Use local registry file
DUCKIT_REGISTRY_LOCAL_PATH=/path/to/registry/registry.json \
  node dist/index.js add button
```

## Publishing

### Publish Registry

```bash
cd registry
npm version patch
npm publish --access public
```

### Publish CLI

```bash
cd packages/duckit-cli
npm version patch
npm publish --access public
```

## License

MIT
