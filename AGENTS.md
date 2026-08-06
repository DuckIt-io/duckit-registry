# Duckit Registry — Complete Guide

## Project Structure

```
DuckitIo-Registry/
├── registry/                  # @duckit/registry — published to npm
│   ├── package.json
│   ├── registry.json          # Full file (backward compat, 63KB)
│   ├── index.json             # Lightweight catalog (5KB, metadata only)
│   └── components/            # Per-component files (internal source)
│       ├── button.json
│       └── ...
│
├── packages/
│   ├── cli/                   # @duckit/cli — CLI tool
│   │   ├── src/
│   │   │   ├── index.ts       # Entry point (commander)
│   │   │   ├── commands/
│   │   │   │   ├── add.ts     # npx duckit add <component>
│   │   │   │   └── init.ts    # npx duckit init
│   │   │   └── utils/
│   │   │       ├── registry.ts    # fetchComponent() logic
│   │   │       ├── framework.ts   # framework detection
│   │   │       └── package.ts     # dep installation, file writing
│   │   ├── scripts/
│   │   │   └── generate-registry.ts  # Generate all registry JSONs
│   │   └── package.json
│   │
│   └── config/                # @duckit/config — shared types (private)
│       └── src/index.ts
│
├── src/components/ui/         # Canonical component source files (.tsx)
│   ├── button.tsx
│   ├── dialog.tsx
│   └── ...
│
├── scripts/
│   └── README.md              # Tooling notes
│
└── .github/workflows/
    ├── ci.yml                 # Quality checks (PR + push to main)
    └── release.yml            # Tag-based publish + GitHub Release
```

---

## Architecture Overview

Three packages with clear responsibilities:

| Package | Location | Published | Purpose |
|---------|----------|-----------|---------|
| `@duckit/registry` | `registry/` | ✅ npm | Registry metadata + component source code as JSON |
| `@duckit/cli` | `packages/cli/` | ✅ npm | CLI for `init` and `add` commands |
| `@duckit/config` | `packages/config/` | ❌ private (workspace) | Shared TypeScript types |

The flow:
```
src/components/ui/*.tsx     ← single source of truth (no external sync)
       │
       ▼
generate-registry.ts
       │
       ▼
registry/index.json         registry/components/*.json    registry/registry.json
       │                           │                            │
       └────────── npm publish (@duckit/registry) ─────────────┘
                                    │
            ┌───────────────────────┼───────────────────┐
            ▼                       ▼                   ▼
        docs site (duckit-nest)    CLI (unpkg)         CLI (jsdelivr)
        fetches @duckit/registry@latest (build-time / client fetch)

              npx duckit add button
              → fetch component JSON from unpkg/jsdelivr
              → install dependencies
              → write .tsx to user project
```

No sync scripts exist. Publish to npm is the only distribution step — docs and
CLI consume the published package directly, so they can never drift.

---

## Registry (@duckit/registry)

### generate-registry.ts — How it works

The script at `packages/cli/scripts/generate-registry.ts`:

1. **Read existing metadata** — Loads `registry/registry.json` to preserve existing `dependencies` and `devDependencies`
2. **Read component files** — Scans `src/components/ui/*.tsx` (skips `*.stories.tsx`)
3. **Merge** — For each file, finds existing entry in categories or creates a new one, injects current file content
4. **Write outputs:**

| Output | Size | Content |
|--------|------|---------|
| `registry/registry.json` | ~63KB | Full catalog with all file contents (npm package) |
| `registry/index.json` | ~5KB | Lightweight catalog — metadata only, empty `files[]` (website) |
| `registry/components/*.json` | ~1-8KB each | Individual component files with full source (website + npm fallback) |

### Output format

`components/button.json`:
```json
{
  "name": "button",
  "dependencies": ["@radix-ui/react-slot", "class-variance-authority"],
  "devDependencies": [],
  "files": [
    {
      "path": "button.tsx",
      "content": "'use client'\n\nimport * as React...",
      "type": "component"
    }
  ]
}
```

### npm package

`registry/package.json` includes:
```json
"files": ["registry.json", "index.json", "components"]
```

The npm package serves as **CDN fallback** for the CLI:
- `unpkg.com/@duckit/registry@latest/components/button.json`
- `cdn.jsdelivr.net/npm/@duckit/registry@latest/components/button.json`

---

## CLI (@duckit/cli)

### fetchComponent() — Per-component fetch

File: `packages/cli/src/utils/registry.ts`

```ts
const REGISTRY_URL = 'https://unpkg.com/@duckit/registry@latest/components'
const REGISTRY_JSDELIVR_URL = 'https://cdn.jsdelivr.net/npm/@duckit/registry@latest/components'
```

Fetch order (tries each in sequence):
1. `https://unpkg.com/@duckit/registry@latest/components/{name}.json` — primary source
2. `https://cdn.jsdelivr.net/npm/@duckit/registry@latest/components/{name}.json` — CDN fallback

If `DUCKIT_REGISTRY_LOCAL_PATH` env var is set, uses local file directly (for development).

### `add` command flow

File: `packages/cli/src/commands/add.ts`

```
npx duckit add button
       │
       ▼
1. Resolve project root (find package.json)
2. Read components.json config
3. fetchComponent('button')
   → Try domain → try unpkg → try jsdelivr
   → Return RegistryItem or throw
4. Install dependencies (if any)
5. Resolve UI path from aliases
6. Write component files to src/components/ui/
```

### `init` command flow

File: `packages/cli/src/commands/init.ts`

```
npx duckit init
       │
       ▼
1. Detect framework (Next.js, Vite, Remix, CRA, Astro)
2. Create components.json
3. Write src/lib/utils.ts with cn() utility
4. Install base dependencies
5. Configure path aliases for framework
```

---

## GitHub Workflows

### ci.yml — Quality Check

Trigger: PR or push to `main`

```yaml
jobs:
  quality:
    1. npm ci
    2. tsc --noEmit          # Type check
    3. prettier --check       # Format check
    4. Generate registry      # npm -w @duckit/cli run generate-registry
    5. Verify up-to-date      # git status --porcelain registry/ → fail if changed
```

### release.yml — Publish & Release

Trigger: push tag `v*`

```yaml
jobs:
  release:
    1. npm ci
    2. Generate registry
    3. Build CLI (tsc)
    4. Publish @duckit/registry — compares local version vs npm, skip if same
    5. Publish @duckit/cli — compares local version vs npm, skip if same
    6. Create GitHub Release — auto-generated release notes from commits
```

**Required secrets:**
- `NPM_TOKEN` — npm automation token with publish access

**Required permissions:**
- `contents: write` — to create GitHub Release

---

## Cara Update Komponen

### 1. Edit component source

Edit file di `src/components/ui/{name}.tsx`.

### 2. Generate registry

```bash
npm run generate-registry
```

Ini mengupdate:
- `registry/registry.json`
- `registry/index.json`
- `registry/components/{name}.json`

### 3. Publish ke npm

```bash
npm run version:registry   # bump patch
npm run publish:registry   # publish
```

Atau push tag untuk trigger CI release:
```bash
git push origin main --tags
```

Docs site (duckit-nest) dan CLI otomatis mengonsumsi versi baru — tidak ada langkah sync.

### 4. Commit registry repo

```bash
git add registry/
git commit -m "feat: update {component} component"
git push origin develop
```

---

## Cara Nambah Komponen Baru

### 1. Buat file component

Buat `src/components/ui/{name}.tsx` dengan pattern yang sama seperti komponen lain:
```tsx
'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

// Component implementation...
```

### 2. Generate registry

```bash
npm run generate-registry
```

Script akan otomatis:
- Deteksi file baru
- Tambah ke `categories.components`
- Set `dependencies: []` dan `devDependencies: []` (isi manual jika perlu deps tambahan)

### 3. Isi dependencies (jika ada)

Edit `registry/registry.json` — cari entry komponen baru, isi `dependencies` sesuai package npm yang dibutuhkan.

**Jalankan `npm run generate-registry` lagi** setelah edit dependencies (script akan preserve metadata lama tapi overwrite file content).

### 4. Update README

Tambah baris ke tabel "Available Components" di `README.md`.

### 5. Publish

Ikuti langkah 3-4 dari [Cara Update Komponen](#cara-update-komponen).

---

## Cara Release

### Manual publish

```bash
# Registry
npm run version:registry     # bump patch (e.g. 0.0.5 → 0.0.6)
npm run publish:registry     # publish to npm

# CLI
npm run version:cli          # bump patch (e.g. 0.0.7 → 0.0.8)
npm run build                # build CLI
npm run publish:cli          # publish to npm
```

### Auto release via CI (recommended)

```bash
# Bump version (creates git tag automatically)
npm run version:registry

# Push tag → triggers release.yml
git push origin main --tags
```

CI akan:
1. Generate registry
2. Build CLI
3. Publish @duckit/registry (skip jika versi sudah di npm)
4. Publish @duckit/cli (skip jika versi sudah di npm)
5. Buat GitHub Release dengan release notes otomatis

### Tag version convention

Tag format: `v{version}` — contoh: `v0.0.6`

Mengikuti output dari `npm version patch`:
- Registry: `npm -w @duckit/registry version patch` → tag `v0.0.x`
- CLI: `npm -w @duckit/cli version patch` → tag `v0.0.x`

---

## Distribusi ke Website

### Mekanisme

Tidak ada sync script. Docs site (duckit-nest) fetch langsung dari npm:

```
npm publish @duckit/registry
       │
       ▼
https://unpkg.com/@duckit/registry@latest/index.json          → docs index (metadata)
https://unpkg.com/@duckit/registry@latest/components/{name}.json → halaman komponen (full source)
https://cdn.jsdelivr.net/npm/@duckit/registry@latest/...      → fallback CDN
```

`public/r/` tidak lagi ada di duckit-nest — stale files mustahil terjadi.

---

## Environment Variables

| Variable | Used In | Purpose |
|----------|---------|---------|
| `DUCKIT_REGISTRY_URL` | CLI `registry.ts` | Override registry URL (default: unpkg components dir) |
| `DUCKIT_REGISTRY_LOCAL_PATH` | CLI `registry.ts` | Use local JSON instead of fetch (development) |
| `PROJECT_ROOT` | `generate-registry.ts` | Override project root path |

---

## Root Scripts Reference

```bash
npm run build               # Build CLI (tsc)
npm run dev                 # Watch mode CLI build
npm run lint                # tsc --noEmit + prettier --check
npm run typecheck           # tsc --noEmit
npm test                    # vitest run
npm run generate-registry   # Generate all registry JSONs
npm run format              # prettier --write
npm run version:registry    # npm version patch for @duckit/registry
npm run publish:registry    # npm publish for @duckit/registry
npm run version:cli         # npm version patch for @duckit/cli
npm run publish:cli         # npm publish for @duckit/cli
```
