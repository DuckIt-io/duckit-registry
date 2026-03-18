# DuckitIO - Component Registry & CLI

DuckitIO adalah kumpulan komponen UI React berbasis Radix UI dan Tailwind CSS, dengan CLI untuk instalasi mudah.

## 📦 Packages

### @duckit/registry
Registry yang berisi metadata semua komponen DuckitIO.

**npm:** https://www.npmjs.com/package/@duckit/registry

### @duckit/duckit (CLI)
CLI tool untuk menambahkan komponen ke project Anda.

**npm:** https://www.npmjs.com/package/@duckit/duckit

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge
```

### 2. Setup components.json

Buat file `components.json` di root project:

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

### 3. Add Components

```bash
# Menggunakan npx
npx @duckit/duckit@latest add button

# Atau tambahkan multiple components
npx @duckit/duckit@latest add button input dialog
```

## 📚 Available Components

| Component | Description |
|-----------|-------------|
| `button` | Button dengan berbagai variant |
| `alert-dialog` | Dialog untuk alert dan konfirmasi |
| `alert` | Alert banner untuk notifikasi |
| `badge` | Badge/label kecil |
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

## 🛠 Development

### Project Structure

```
DuckitIo/
├── packages/
│   └── duckit-cli/       # CLI package
│       ├── src/
│       │   ├── index.ts
│       │   └── commands/
│       │       └── add.ts
│       ├── scripts/
│       │   └── generate-registry.ts
│       └── package.json
├── registry/
│   ├── registry.json     # Component registry
│   └── package.json
├── src/
│   └── components/ui/    # Component source files
└── scripts/
    └── update-registry.sh
```

### Build CLI

```bash
cd packages/duckit-cli
npm install
npm run build
```

### Generate Registry

```bash
cd packages/duckit-cli
npm run generate-registry
```

### Test Locally

```bash
# Use local registry
DUCKIT_REGISTRY_LOCAL_PATH=$(pwd)/registry/registry.json \
  node packages/duckit-cli/dist/index.js add button
```

### Publish

```bash
# Publish registry
cd registry
npm version patch
npm publish --access public

# Publish CLI
cd packages/duckit-cli
npm version patch
npm publish --access public
```

## 🔗 Links

- **GitHub:** https://github.com/DuckIt-io/DuckitIo
- **npm (registry):** https://www.npmjs.com/package/@duckit/registry
- **npm (CLI):** https://www.npmjs.com/package/@duckit/duckit

## 📄 License

MIT
# DuckitIo-Registry
