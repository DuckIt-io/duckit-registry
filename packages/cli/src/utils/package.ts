import { promises as fs } from 'node:fs'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import path from 'node:path'

const execAsync = promisify(exec)

export function parsePackageName(dep: string): string {
  if (dep.startsWith('@')) {
    const parts = dep.split('@')
    return parts[0] && parts[0].length > 0
      ? `@${parts[0].replace('@', '')}@${parts.slice(1).join('@')}`
      : dep
  }
  const parts = dep.split('@')
  return parts[0] || dep
}

export function extractPackageName(dep: string): string {
  if (dep.startsWith('@')) {
    const match = dep.match(/^(@[^@]+)/)
    return match ? match[1]! : dep
  }
  const match = dep.match(/^([^@]+)/)
  return match ? match[1]! : dep
}

export function formatDependency(dep: string): { name: string; version?: string } {
  if (dep.startsWith('@')) {
    const match = dep.match(/^(@[^@]+)(?:@(.+))?$/)
    return { name: match ? match[1]! : dep, version: match?.[2] }
  }
  const match = dep.match(/^([^@]+)(?:@(.+))?$/)
  return { name: match ? match[1]! : dep, version: match?.[2] }
}

export async function installDependencies(
  projectRoot: string,
  deps: string[],
  devDeps: string[] = [],
) {
  if (deps.length === 0 && devDeps.length === 0) return

  const pkgJsonPath = path.join(projectRoot, 'package.json')
  const pkgJson = JSON.parse(await fs.readFile(pkgJsonPath, 'utf-8'))

  const existingDeps = new Set([
    ...Object.keys(pkgJson.dependencies || {}),
    ...Object.keys(pkgJson.devDependencies || {}),
  ])

  const missingDeps = deps.filter((dep) => !existingDeps.has(extractPackageName(dep)))
  const missingDevDeps = devDeps.filter((dep) => !existingDeps.has(extractPackageName(dep)))

  if (missingDeps.length === 0 && missingDevDeps.length === 0) return

  const installParts: string[] = []
  if (missingDeps.length > 0) installParts.push(missingDeps.join(' '))
  if (missingDevDeps.length > 0) installParts.push(`-D ${missingDevDeps.join(' ')}`)

  const installCmd = `npm install ${installParts.join(' ')}`

  try {
    await execAsync(installCmd, { cwd: projectRoot })
  } catch (error) {
    throw new Error(
      `Failed to install dependencies: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

export async function writeComponentFiles(
  uiPath: string,
  files: { path: string; content: string }[],
  overwrite: boolean,
): Promise<string[]> {
  const written: string[] = []

  for (const file of files) {
    const targetPath = path.join(uiPath, file.path)

    if (!overwrite) {
      try {
        await fs.access(targetPath)
        continue
      } catch {
        // File doesn't exist, safe to write
      }
    }

    await fs.mkdir(path.dirname(targetPath), { recursive: true })
    await fs.writeFile(targetPath, file.content, 'utf-8')
    written.push(file.path)
  }

  return written
}
