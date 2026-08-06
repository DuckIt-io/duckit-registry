# Scripts

No sync scripts are needed anymore. `src/components/ui/` is the single source
of truth; docs and CLI consume the published `@duckit/registry` npm package.

The only generation step is run from the repo root:

```bash
npm run generate-registry   # refresh registry/registry.json, index.json, components/*.json
```
