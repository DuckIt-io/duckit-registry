import { promises as fs } from 'node:fs'
import path from 'node:path'
import type { RegistryItem } from '@duckit/config'

const REGISTRY_URL =
  process.env.DUCKIT_REGISTRY_URL || 'https://unpkg.com/@duckit/registry@latest/components'
const REGISTRY_JSDELIVR_URL = 'https://cdn.jsdelivr.net/npm/@duckit/registry@latest/components'
const REGISTRY_LOCAL_PATH = process.env.DUCKIT_REGISTRY_LOCAL_PATH

export async function fetchComponent(name: string): Promise<RegistryItem> {
  if (REGISTRY_LOCAL_PATH) {
    const localFile = REGISTRY_LOCAL_PATH.endsWith('.json')
      ? REGISTRY_LOCAL_PATH
      : `${REGISTRY_LOCAL_PATH}/${name}.json`
    const content = await fs.readFile(localFile, 'utf-8')
    return JSON.parse(content) as RegistryItem
  }

  const sources = [
    { url: `${REGISTRY_URL}/${name}.json`, label: 'unpkg' },
    { url: `${REGISTRY_JSDELIVR_URL}/${name}.json`, label: 'jsdelivr' },
  ]

  for (const source of sources) {
    try {
      const response = await fetch(source.url)
      if (!response.ok) continue
      return (await response.json()) as RegistryItem
    } catch {
      continue
    }
  }

  throw new Error(`Component "${name}" not found in any registry source`)
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
