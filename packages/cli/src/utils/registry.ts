import { promises as fs } from 'node:fs'
import path from 'node:path'
import { RegistrySchema, RegistryItem } from '@duckit/config'

const REGISTRY_URL = process.env.DUCKIT_REGISTRY_URL || 'https://raw.githubusercontent.com/DuckIt-io/DuckitIo/main/registry'
const REGISTRY_NPM_URL = 'https://unpkg.com/@duckit/registry@latest/registry.json'
const REGISTRY_JSDELIVR_URL = 'https://cdn.jsdelivr.net/npm/@duckit/registry@latest/registry.json'
const REGISTRY_LOCAL_PATH = process.env.DUCKIT_REGISTRY_LOCAL_PATH

interface FlatRegistry {
  [key: string]: RegistryItem
}

function flattenRegistry(schema: RegistrySchema): FlatRegistry {
  const flat: FlatRegistry = {}
  for (const category of Object.values(schema.categories)) {
    for (const [name, item] of Object.entries(category)) {
      flat[name] = item
    }
  }
  return flat
}

export async function fetchRegistry(): Promise<FlatRegistry> {
  if (REGISTRY_LOCAL_PATH) {
    const content = await fs.readFile(REGISTRY_LOCAL_PATH, 'utf-8')
    const data = JSON.parse(content)
    if (data.categories) {
      return flattenRegistry(data as RegistrySchema)
    }
    return data as FlatRegistry
  }

  const sources = [
    { url: `${REGISTRY_URL}/registry.json`, label: 'GitHub Raw' },
    { url: REGISTRY_NPM_URL, label: 'unpkg' },
    { url: REGISTRY_JSDELIVR_URL, label: 'jsdelivr' },
  ]

  for (const source of sources) {
    try {
      const response = await fetch(source.url)
      if (!response.ok) continue
      const data: unknown = await response.json()
      if (data && typeof data === 'object' && 'categories' in data) {
        return flattenRegistry(data as RegistrySchema)
      }
      return data as FlatRegistry
    } catch {
      continue
    }
  }

  throw new Error('Failed to fetch registry from all sources')
}

export function getRegistryPath(aliases: Record<string, string>): string {
  const uiAlias = aliases.ui || '@/components/ui'
  return uiAlias.replace('@/', 'src/')
}

export async function resolveProjectRoot(cwd: string): Promise<string | null> {
  let current = cwd
  while (current !== path.dirname(current)) {
    const pkgPath = path.join(current, 'package.json')
    try {
      await fs.access(pkgPath)
      return current
    } catch {
      current = path.dirname(current)
    }
  }
  return null
}
