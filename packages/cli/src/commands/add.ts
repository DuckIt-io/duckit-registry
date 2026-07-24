import { promises as fs } from 'node:fs'
import path from 'node:path'
import chalk from 'chalk'
import ora from 'ora'
import { fetchRegistry, getRegistryPath, resolveProjectRoot } from '../utils/registry.js'
import { installDependencies, writeComponentFiles } from '../utils/package.js'

export async function addCommand(
  component: string,
  options: { yes: boolean; overwrite: boolean },
) {
  const spinner = ora(`Fetching component: ${component}`).start()

  try {
    const projectRoot = await resolveProjectRoot(process.cwd())

    if (!projectRoot) {
      spinner.fail()
      console.error(chalk.red('Error: Could not find project root (no package.json found)'))
      process.exit(1)
    }

    const configPath = path.join(projectRoot, 'components.json')
    let config: any = {}
    try {
      const configContent = await fs.readFile(configPath, 'utf-8')
      config = JSON.parse(configContent)
    } catch {
      spinner.fail()
      console.error(chalk.red('Error: Could not find components.json. Run `duckit init` first.'))
      process.exit(1)
    }

    spinner.text = 'Fetching component metadata...'
    const registry = await fetchRegistry()

    const componentData = registry[component]
    if (!componentData) {
      spinner.fail()
      console.error(chalk.red(`Error: Component "${component}" not found in registry.`))
      console.log(chalk.yellow('\nAvailable components:'))
      Object.keys(registry).forEach((name) => console.log(`  - ${name}`))
      process.exit(1)
    }

    if (!componentData.files || componentData.files.length === 0) {
      spinner.fail()
      console.error(chalk.red(`Error: Component "${component}" has no files in registry.`))
      process.exit(1)
    }

    if (
      componentData.dependencies.length > 0 ||
      componentData.devDependencies.length > 0
    ) {
      spinner.text = 'Installing dependencies...'
      await installDependencies(
        projectRoot,
        componentData.dependencies,
        componentData.devDependencies,
      )
    }

    const aliases = config.aliases || {}
    const uiPath = path.join(projectRoot, getRegistryPath(aliases))

    spinner.text = 'Writing component files...'
    const written = await writeComponentFiles(uiPath, componentData.files, options.overwrite)

    if (written.length === 0) {
      spinner.warn(chalk.yellow(`Component "${component}" files already exist (use --overwrite to replace)`))
    } else {
      spinner.succeed(chalk.green(`Successfully added ${component} component!`))
      console.log(chalk.blue(`\nLocation: ${path.join(uiPath, component)}`))
    }

    if (componentData.dependencies.length > 0) {
      console.log(chalk.yellow('\nDependencies installed:'))
      componentData.dependencies.forEach((dep) => console.log(`  - ${dep}`))
    }
  } catch (error) {
    spinner.fail()
    console.error(chalk.red('Error:'), error instanceof Error ? error.message : error)
    process.exit(1)
  }
}
