#!/usr/bin/env node

import { Command } from 'commander';
import { addCommand } from './commands/add.js';
import { initCommand } from './commands/init.js';

const program = new Command();

program
  .name('duckit')
  .description('CLI tool for adding DuckitIO components to your project')
  .version('0.0.1');

program
  .command('init')
  .description('Initialize Duckit in your project')
  .action(initCommand);

program
  .command('add')
  .description('Add a component to your project')
  .argument('<component>', 'Component name to add')
  .option('-y, --yes', 'Skip confirmation prompt', false)
  .option('-o, --overwrite', 'Overwrite existing files', false)
  .action(addCommand);

program.parse();
