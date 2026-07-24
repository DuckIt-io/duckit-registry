import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const PROJECT_ROOT = process.env.PROJECT_ROOT || path.resolve(__dirname, '../../..')
const REGISTRY_DIR = path.join(PROJECT_ROOT, 'registry')
const SRC_DIR = path.join(PROJECT_ROOT, 'src', 'components', 'ui')

interface ComponentFile {
  path: string
  content: string
  type: 'component' | 'utils' | 'hook' | 'style'
}

interface RegistryItem {
  name: string
  description?: string
  dependencies: string[]
  devDependencies: string[]
  files: ComponentFile[]
}

type RegistryCategory = 'components' | 'animated' | 'blocks' | 'sections' | 'templates' | 'effects'

interface RegistrySchema {
  $schema?: string
  version: number
  categories: Partial<Record<RegistryCategory, Record<string, RegistryItem>>>
}

async function generateRegistry() {
  console.log(`  Project root: ${PROJECT_ROOT}`)
  console.log(`  Registry dir: ${REGISTRY_DIR}`)
  console.log(`  Source dir: ${SRC_DIR}`)

  const registryPath = path.join(REGISTRY_DIR, 'registry.json')
  const registryContent = await fs.readFile(registryPath, 'utf-8')
  const parsed = JSON.parse(registryContent) as Record<string, unknown>

  let categories: RegistrySchema['categories'] = {}

  if ('categories' in parsed && parsed.categories) {
    categories = { ...(parsed.categories as RegistrySchema['categories']) }
  } else {
    categories = {
      components: {},
    }
    for (const [name, value] of Object.entries(parsed)) {
      const item = value as RegistryItem
      if (categories.components && item && typeof item === 'object' && 'files' in item) {
        categories.components[name] = item
      }
    }
  }

  // Read component files
  const files = await fs.readdir(SRC_DIR)
  const componentFiles = files.filter((f) => f.endsWith('.tsx') && !f.endsWith('.stories.tsx'))

  console.log(`  Found ${componentFiles.length} component files`)

  for (const file of componentFiles) {
    const componentName = file.replace('.tsx', '')
    const content = await fs.readFile(path.join(SRC_DIR, file), 'utf-8')

    const foundInCategory = findInCategories(categories, componentName)
    if (foundInCategory) {
      const [catName, cat] = foundInCategory
      const existing = cat[componentName]
      cat[componentName] = {
        ...existing,
        name: existing?.name || componentName,
        files: [
          {
            path: file,
            content,
            type: 'component',
          },
        ],
      } as RegistryItem
      console.log(`    ${componentName} (in ${catName})`)
    } else {
      if (!categories.components) {
        categories.components = {}
      }
      categories.components[componentName] = {
        name: componentName,
        dependencies: [],
        devDependencies: [],
        files: [
          {
            path: file,
            content,
            type: 'component',
          },
        ],
      }
      console.log(`    ${componentName} (new, added to components)`)
    }
  }

  const schema: RegistrySchema = {
    $schema: 'https://duckit.dev/schema.json',
    version: 1,
    categories,
  }

  await fs.writeFile(registryPath, JSON.stringify(schema, null, 2), 'utf-8')

  const totalItems = Object.values(categories).reduce(
    (sum, cat) => sum + Object.keys(cat || {}).length,
    0,
  )
  console.log(`\nRegistry generated with ${totalItems} items across ${Object.keys(categories).length} categories`)
}

function findInCategories(
  categories: RegistrySchema['categories'],
  name: string,
): [string, Record<string, RegistryItem>] | null {
  for (const [catName, cat] of Object.entries(categories)) {
    if (cat && name in cat) {
      return [catName, cat]
    }
  }
  return null
}

generateRegistry().catch(console.error)
