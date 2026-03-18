import { promises as fs } from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import ora from 'ora';

// Try GitHub Raw first (for public repos), fallback to npm CDNs
const REGISTRY_URL = process.env.DUCKIT_REGISTRY_URL || 'https://raw.githubusercontent.com/DuckIt-io/DuckitIo/main/registry';
const REGISTRY_NPM_URL = 'https://unpkg.com/@duckit/registry@latest/registry.json';
const REGISTRY_JSDELIVR_URL = 'https://cdn.jsdelivr.net/npm/@duckit/registry@latest/registry.json';
const REGISTRY_LOCAL_PATH = process.env.DUCKIT_REGISTRY_LOCAL_PATH;

interface ComponentRegistry {
  name: string;
  dependencies: string[];
  devDependencies: string[];
  files: ComponentFile[];
}

interface ComponentFile {
  path: string;
  content: string;
  type: 'component' | 'utils' | 'hook' | 'style';
}

export async function addCommand(component: string, options: { yes: boolean; overwrite: boolean }) {
  const spinner = ora(`Fetching component: ${component}`).start();
  
  try {
    // Resolve project root (find package.json)
    const projectRoot = await resolveProjectRoot(process.cwd());
    
    if (!projectRoot) {
      spinner.fail();
      console.error(chalk.red('Error: Could not find project root (no package.json found)'));
      process.exit(1);
    }

    // Read components.json
    const configPath = path.join(projectRoot, 'components.json');
    let config: any = {};
    try {
      const configContent = await fs.readFile(configPath, 'utf-8');
      config = JSON.parse(configContent);
    } catch {
      spinner.fail();
      console.error(chalk.red('Error: Could not find components.json. Run `duckit init` first.'));
      process.exit(1);
    }

    // Fetch component registry
    spinner.text = `Fetching component metadata...`;
    
    let registry: Record<string, ComponentRegistry>;
    
    // Use local registry file if specified (for development)
    if (REGISTRY_LOCAL_PATH) {
      const registryContent = await fs.readFile(REGISTRY_LOCAL_PATH, 'utf-8');
      registry = JSON.parse(registryContent) as Record<string, ComponentRegistry>;
    } else {
      // Try GitHub Raw first, then fallback to npm CDNs
      try {
        const registryResponse = await fetch(`${REGISTRY_URL}/registry.json`);
        if (!registryResponse.ok) {
          throw new Error(`GitHub Raw failed: ${registryResponse.status}`);
        }
        registry = await registryResponse.json() as Record<string, ComponentRegistry>;
      } catch (error) {
        // Fallback to unpkg
        spinner.text = `GitHub Raw failed, trying unpkg...`;
        try {
          const npmResponse = await fetch(REGISTRY_NPM_URL);
          if (!npmResponse.ok) {
            throw new Error(`unpkg failed: ${npmResponse.status}`);
          }
          registry = await npmResponse.json() as Record<string, ComponentRegistry>;
        } catch {
          // Final fallback to jsdelivr
          spinner.text = `unpkg failed, trying jsdelivr...`;
          const jsdelivrResponse = await fetch(REGISTRY_JSDELIVR_URL);
          if (!jsdelivrResponse.ok) {
            throw new Error('Failed to fetch registry from all sources');
          }
          registry = await jsdelivrResponse.json() as Record<string, ComponentRegistry>;
        }
      }
    }

    const componentData = registry[component];
    if (!componentData) {
      spinner.fail();
      console.error(chalk.red(`Error: Component "${component}" not found in registry.`));
      console.log(chalk.yellow('\nAvailable components:'));
      Object.keys(registry).forEach(name => console.log(`  - ${name}`));
      process.exit(1);
    }

    // Debug: Check if files exist in registry
    if (!componentData.files || componentData.files.length === 0) {
      spinner.fail();
      console.error(chalk.red(`Error: Component "${component}" has no files in registry.`));
      console.error(chalk.yellow('This might be a registry issue. Please report this bug.'));
      process.exit(1);
    }

    // Install dependencies
    if (componentData.dependencies.length > 0 || componentData.devDependencies.length > 0) {
      spinner.text = 'Installing dependencies...';
      await installDependencies(projectRoot, componentData);
    }

    // Download and write files
    const aliases = config.aliases || {};
    // Resolve @ alias to src/
    const uiPath = (aliases.ui || '@/components/ui').replace('@/', 'src/');
    
    for (const file of componentData.files) {
      const targetPath = path.join(projectRoot, uiPath, file.path);
      
      // Create directory if not exists
      await fs.mkdir(path.dirname(targetPath), { recursive: true });
      
      // Write file
      await fs.writeFile(targetPath, file.content, 'utf-8');
    }

    spinner.succeed(chalk.green(`Successfully added ${component} component!`));
    console.log(chalk.blue(`\nComponent added to: ${path.join(projectRoot, uiPath)}`));
    
    if (componentData.dependencies.length > 0) {
      console.log(chalk.yellow('\nInstalled dependencies:'));
      componentData.dependencies.forEach(dep => console.log(`  - ${dep}`));
    }
    
  } catch (error) {
    spinner.fail();
    console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

async function resolveProjectRoot(cwd: string): Promise<string | null> {
  let current = cwd;
  while (current !== path.dirname(current)) {
    const packagePath = path.join(current, 'package.json');
    try {
      await fs.access(packagePath);
      return current;
    } catch {
      current = path.dirname(current);
    }
  }
  return null;
}

async function installDependencies(projectRoot: string, componentData: ComponentRegistry) {
  const packageJsonPath = path.join(projectRoot, 'package.json');
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
  
  const depsToAdd = new Set<string>();
  
  // Check which dependencies are missing
  for (const dep of componentData.dependencies) {
    const [name] = dep.split('@');
    if (!packageJson.dependencies?.[name]) {
      depsToAdd.add(dep);
    }
  }
  
  for (const dep of componentData.devDependencies) {
    const [name] = dep.split('@');
    if (!packageJson.devDependencies?.[name]) {
      depsToAdd.add(dep);
    }
  }
  
  if (depsToAdd.size > 0) {
    const { exec } = await import('node:child_process');
    const { promisify } = await import('node:util');
    const execAsync = promisify(exec);
    
    const deps = Array.from(depsToAdd);
    const installCmd = `npm install ${deps.join(' ')}`;
    
    try {
      await execAsync(installCmd, { cwd: projectRoot });
    } catch (error) {
      throw new Error(`Failed to install dependencies: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
