#!/usr/bin/env node

import { Command } from 'commander'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { addCommand } from './commands/add.js'
import { initCommand } from './commands/init.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8'))

const program = new Command()

program
  .name('duckit')
  .description('CLI tool for adding Duckit components to your project')
  .version(pkg.version)

program.command('init').description('Initialize Duckit in your project').action(initCommand)

program
  .command('add')
  .description('Add a component to your project')
  .argument('<component>', 'Component name to add')
  .option('-y, --yes', 'Skip confirmation prompt', false)
  .option('-o, --overwrite', 'Overwrite existing files', false)
  .action(addCommand)

program.parse()
