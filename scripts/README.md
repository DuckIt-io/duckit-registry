# Scripts

## sync.sh

Sync component source files from DuckitIo to `src/components/ui/`.

```bash
SOURCE_DIR=/path/to/components bash scripts/sync.sh
```

If `SOURCE_DIR` is not set, defaults to the local DuckitIo path.

## update-and-publish.sh

Run the full workflow: sync components, generate registry, and publish.

```bash
bash scripts/update-and-publish.sh
```
