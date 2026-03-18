import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Get project root from environment or resolve from script location
const PROJECT_ROOT = process.env.PROJECT_ROOT || path.resolve(__dirname, '../../../../..');
const REGISTRY_DIR = path.join(PROJECT_ROOT, 'registry');
const SRC_DIR = path.join(PROJECT_ROOT, 'src', 'components', 'ui');

interface ComponentFile {
  path: string;
  content: string;
  type: 'component' | 'utils' | 'hook' | 'style';
}

interface ComponentRegistry {
  name: string;
  dependencies: string[];
  devDependencies: string[];
  files: ComponentFile[];
}

async function generateRegistry() {
  console.log(`📂 Project root: ${PROJECT_ROOT}`);
  console.log(`📂 Registry dir: ${REGISTRY_DIR}`);
  console.log(`📂 Source dir: ${SRC_DIR}`);
  
  const registryPath = path.join(REGISTRY_DIR, 'registry.json');
  const registryContent = await fs.readFile(registryPath, 'utf-8');
  const registry: Record<string, ComponentRegistry> = JSON.parse(registryContent);

  // Read all component files
  const files = await fs.readdir(SRC_DIR);
  const componentFiles = files.filter(f => f.endsWith('.tsx') && !f.endsWith('.stories.tsx'));

  console.log(`📦 Found ${componentFiles.length} component files`);

  for (const file of componentFiles) {
    const componentName = file.replace('.tsx', '');
    const content = await fs.readFile(path.join(SRC_DIR, file), 'utf-8');

    if (registry[componentName]) {
      registry[componentName].files = [{
        path: file,
        content,
        type: 'component'
      }];
      console.log(`  ✅ ${componentName}`);
    } else {
      console.log(`  ⚠️  ${componentName} (not in registry)`);
    }
  }

  // Write updated registry
  await fs.writeFile(registryPath, JSON.stringify(registry, null, 2), 'utf-8');
  console.log('\n✅ Registry generated successfully!');
  console.log(`📦 Generated ${Object.keys(registry).length} components`);
}

generateRegistry().catch(console.error);
