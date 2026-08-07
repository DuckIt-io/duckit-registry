import { promises as fs } from 'node:fs'
import path from 'node:path'
import chalk from 'chalk'
import ora from 'ora'
import { resolveProjectRoot } from '../utils/registry.js'
import { installDependencies } from '../utils/package.js'
import { detectFramework, generateAliasConfig, getFrameworkLabel } from '../utils/framework.js'

const COMPONENTS_JSON = `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
`

const UTILS_FILE = `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`

const CSS_VARIABLES = `@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 224 71.4% 4.1%;
    --card: 0 0% 100%;
    --card-foreground: 224 71.4% 4.1%;
    --popover: 0 0% 100%;
    --popover-foreground: 224 71.4% 4.1%;
    --primary: 220.9 39.3% 11%;
    --primary-foreground: 210 20% 98%;
    --secondary: 220 14.3% 95.9%;
    --secondary-foreground: 220.9 39.3% 11%;
    --muted: 220 14.3% 95.9%;
    --muted-foreground: 220 8.9% 46.1%;
    --accent: 220 14.3% 95.9%;
    --accent-foreground: 220.9 39.3% 11%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 20% 98%;
    --border: 220 13% 91%;
    --input: 220 13% 91%;
    --ring: 224 71.4% 4.1%;
    --radius: 0.5rem;
    --duckit-radius: 24px;
    --duckit-radius-step: 8px;
    --duckit-radius-md: max(4px, calc(var(--duckit-radius) - var(--duckit-radius-step)));
    --duckit-radius-sm: max(2px, calc(var(--duckit-radius-md) - var(--duckit-radius-step)));
  }

  .dark {
    --background: 224 71.4% 4.1%;
    --foreground: 210 20% 98%;
    --card: 224 71.4% 4.1%;
    --card-foreground: 210 20% 98%;
    --popover: 224 71.4% 4.1%;
    --popover-foreground: 210 20% 98%;
    --primary: 210 20% 98%;
    --primary-foreground: 220.9 39.3% 11%;
    --secondary: 215 27.9% 16.9%;
    --secondary-foreground: 210 20% 98%;
    --muted: 215 27.9% 16.9%;
    --muted-foreground: 217.9 10.6% 64.9%;
    --accent: 215 27.9% 16.9%;
    --accent-foreground: 210 20% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 20% 98%;
    --border: 215 27.9% 16.9%;
    --input: 215 27.9% 16.9%;
    --ring: 216 12.2% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/*
 * Duckit shadow system.
 *
 * Tailwind's shadow-* utilities produce box-shadow, which renders as a
 * rectangle and does NOT follow corner-shape (squircle) corners. We override
 * them with filter: drop-shadow() so shadows trace the actual rendered shape,
 * while keeping the familiar shadow / shadow-sm / shadow-lg API.
 *
 * shadow-none, shadow-inner, and arbitrary shadow-[...] keep their default
 * box-shadow behavior.
 */
.shadow-sm {
  filter: drop-shadow(0 1px 1px rgb(0 0 0 / 0.05));
  box-shadow: none;
}

.shadow {
  filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.05));
  box-shadow: none;
}

.shadow-md {
  filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06));
  box-shadow: none;
}

.shadow-lg {
  filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));
  box-shadow: none;
}

.shadow-xl {
  filter: drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08));
  box-shadow: none;
}

.shadow-2xl {
  filter: drop-shadow(0 25px 25px rgb(0 0 0 / 0.15));
  box-shadow: none;
}
`

export async function initCommand() {
  const spinner = ora('Initializing Duckit...').start()

  try {
    const projectRoot = await resolveProjectRoot(process.cwd())

    if (!projectRoot) {
      spinner.fail()
      console.error(chalk.red('Error: Could not find project root (no package.json found)'))
      process.exit(1)
    }

    const pkgJsonPath = path.join(projectRoot, 'package.json')
    const pkgJson = JSON.parse(await fs.readFile(pkgJsonPath, 'utf-8'))

    const framework = detectFramework(pkgJson)
    spinner.info(`Detected framework: ${getFrameworkLabel(framework)}`)

    spinner.text = 'Installing dependencies...'
    const requiredDeps = [
      'clsx',
      'tailwind-merge',
      'class-variance-authority',
      '@radix-ui/react-slot',
      'tailwindcss-animate',
    ]
    await installDependencies(projectRoot, requiredDeps)

    const componentsJsonPath = path.join(projectRoot, 'components.json')
    try {
      await fs.access(componentsJsonPath)
      spinner.info('components.json already exists')
    } catch {
      await fs.writeFile(componentsJsonPath, COMPONENTS_JSON, 'utf-8')
      spinner.succeed(chalk.green('Created components.json'))
    }

    const utilsPath = path.join(projectRoot, 'src', 'lib', 'utils.ts')
    await fs.mkdir(path.dirname(utilsPath), { recursive: true })
    try {
      await fs.access(utilsPath)
      spinner.info('src/lib/utils.ts already exists')
    } catch {
      await fs.writeFile(utilsPath, UTILS_FILE, 'utf-8')
      spinner.succeed(chalk.green('Created src/lib/utils.ts'))
    }

    const uiDir = path.join(projectRoot, 'src', 'components', 'ui')
    await fs.mkdir(uiDir, { recursive: true })
    spinner.succeed(chalk.green('Created src/components/ui directory'))

    // Setup alias config based on framework
    if (framework === 'vite') {
      const viteConfigPath = path.join(projectRoot, 'vite.config.ts')
      try {
        await fs.access(viteConfigPath)
        const existing = await fs.readFile(viteConfigPath, 'utf-8')
        if (!existing.includes("'@':") && !existing.includes('"@":')) {
          const updated = existing.replace(
            /plugins:\s*\[([^\]]+)\]/,
            `plugins: [$1],\n  resolve: {\n    alias: {\n      '@': path.resolve(__dirname, './src'),\n    },\n  }`,
          )
          await fs.writeFile(viteConfigPath, updated, 'utf-8')
          spinner.succeed(chalk.green('Added path alias to vite.config.ts'))
        } else {
          spinner.info('Path alias already in vite.config.ts')
        }
      } catch {
        await fs.writeFile(viteConfigPath, generateAliasConfig(framework), 'utf-8')
        spinner.succeed(chalk.green('Created vite.config.ts with path alias'))
      }
    }

    if (framework === 'nextjs') {
      const tsconfigPath = path.join(projectRoot, 'tsconfig.json')
      try {
        const tsconfig = JSON.parse(await fs.readFile(tsconfigPath, 'utf-8'))
        if (!tsconfig.compilerOptions?.paths?.['@/*']) {
          spinner.info('Add path alias "@/*" to your tsconfig.json')
        }
      } catch {
        spinner.info('Create a tsconfig.json with path alias for "@/*"')
      }
    }

    spinner.succeed(chalk.green(`Duckit initialized for ${getFrameworkLabel(framework)}!`))
    console.log(chalk.blue('\nYou can now add components:'))
    console.log(chalk.cyan('  npx @duckit/cli@latest add button'))
    console.log(chalk.cyan('  npx @duckit/cli@latest add dialog'))
    console.log(chalk.cyan('  npx @duckit/cli@latest add input'))
  } catch (error) {
    spinner.fail()
    console.error(chalk.red('Error:'), error instanceof Error ? error.message : error)
    process.exit(1)
  }
}
