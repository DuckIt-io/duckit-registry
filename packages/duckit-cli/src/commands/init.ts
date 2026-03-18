import { promises as fs } from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import ora from 'ora';

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
`;

const UTILS_FILE = `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`;

const TAILWIND_DIRECTIVES = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;

const VITE_CONFIG = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
`;

const TAILWIND_CONFIG = `const plugin = require("tailwindcss/plugin");

const smoothCornersPlugin = plugin(function ({ addUtilities, addBase }) {
  // Generate SVG mask data URI with proper encoding for all browsers
  const makeMask = (r, w = 100, h = 100) => {
    const cp = r * 0.3;
    const path = [
      \`M 0,\${r}\`,
      \`C 0,\${cp} \${cp},0 \${r},0\`,
      \`L \${w - r},0\`,
      \`C \${w - cp},0 \${w},\${cp} \${w},\${r}\`,
      \`L \${w},\${h - r}\`,
      \`C \${w},\${h - cp} \${w - cp},\${h} \${w - r},\${h}\`,
      \`L \${r},\${h}\`,
      \`C \${cp},\${h} 0,\${h - cp} 0,\${h - r}\`,
      'Z',
    ].join(' ');
    // Use single quotes and proper encoding for Firefox compatibility
    const svg = \\\`<svg xmlns='http://www.w3.org/2000/svg' width='\${w}' height='\${h}'><path d='\${path}' fill='black'/></svg>\\\`;
    return \\\`url('data:image/svg+xml;utf8,\${encodeURIComponent(svg)}')\\\`;
  };

  // Generate clip-path for additional fallback
  const makeClipPath = (r, w = 100, h = 100) => {
    const cp = r * 0.3;
    return \\\`path('M 0,\${r} C 0,\${cp} \${cp},0 \${r},0 L \${w - r},0 C \${w - cp},0 \${w},\${cp} \${w},\${r} L \${w},\${h - r} C \${w},\${h - cp} \${w - cp},\${h} \${w - r},\${h} L \${r},\${h} C \${cp},\${h} 0,\${h - cp} 0,\${h - r} Z')\\\`;
  };

  // Base smooth corner styles with cross-browser support
  const smoothBase = {
    // Standard border-radius as fallback
    'border-radius': 'inherit',
    // Firefox and standard mask properties
    '-webkit-mask-size': '100% 100%',
    '-webkit-mask-repeat': 'no-repeat',
    '-webkit-mask-position': 'center',
    'mask-size': '100% 100%',
    'mask-repeat': 'no-repeat',
    'mask-position': 'center',
    'mask-mode': 'alpha',
    '-webkit-mask-mode': 'alpha',
  };

  addBase({
    // Ensure all elements can use mask properties
    '*': {
      '-webkit-backface-visibility': 'hidden',
      'backface-visibility': 'hidden',
    },
  });

  addUtilities({
    '.rounded-sm': {
      'border-radius': '24px',
      ...smoothBase,
      '-webkit-mask-image': makeMask(20),
      'mask-image': makeMask(20),
      // Fallback clip-path for browsers without mask support
      'clip-path': makeClipPath(20),
    },
    '.rounded-md': {
      'border-radius': '26px',
      ...smoothBase,
      '-webkit-mask-image': makeMask(22),
      'mask-image': makeMask(22),
      'clip-path': makeClipPath(22),
    },
    '.rounded-lg': {
      'border-radius': '28px',
      ...smoothBase,
      '-webkit-mask-image': makeMask(24),
      'mask-image': makeMask(24),
      'clip-path': makeClipPath(24),
    },
    '.rounded-xl': {
      'border-radius': '32px',
      ...smoothBase,
      '-webkit-mask-image': makeMask(28),
      'mask-image': makeMask(28),
      'clip-path': makeClipPath(28),
    },
    '.rounded-button': {
      'border-radius': '12px',
      ...smoothBase,
      '-webkit-mask-image': makeMask(12),
      'mask-image': makeMask(12),
      'clip-path': makeClipPath(12),
    },
    '.rounded-input': {
      'border-radius': '12px',
      ...smoothBase,
      '-webkit-mask-image': makeMask(12),
      'mask-image': makeMask(12),
      'clip-path': makeClipPath(12),
    },
    // Modern browser with native squircle support
    '@supports (corner-shape: squircle)': {
      '.rounded-sm, .rounded-md, .rounded-lg, .rounded-xl, .rounded-button, .rounded-input': {
        'corner-shape': 'squircle',
        '-webkit-mask-image': 'none',
        'mask-image': 'none',
        'clip-path': 'none',
      },
    },
    // Firefox-specific: use mask without clip-path override
    '@-moz-document url-prefix()': {
      '.rounded-sm, .rounded-md, .rounded-lg, .rounded-xl, .rounded-button, .rounded-input': {
        'clip-path': 'none !important',
      },
    },
  });
});

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  plugins: [require("tailwindcss-animate"), smoothCornersPlugin],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        input: "var(--radius-input)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
};
`;

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
    --radius-input: 0.5rem;
    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 240 5.9% 10%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 240 4.8% 95.9%;
    --sidebar-accent-foreground: 240 5.9% 10%;
    --sidebar-border: 220 13% 91%;
    --sidebar-ring: 217.2 91.2% 59.8%;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
    --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
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
    --sidebar-background: 240 5.9% 10%;
    --sidebar-foreground: 240 4.8% 95.9%;
    --sidebar-primary: 224.3 76.3% 48%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 240 3.7% 15.9%;
    --sidebar-accent-foreground: 240 4.8% 95.9%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 217.2 91.2% 59.8%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-family: var(--font-sans);
  }
}
`;

export async function initCommand() {
  const spinner = ora('Initializing Duckit...').start();
  
  try {
    // Resolve project root
    const projectRoot = await resolveProjectRoot(process.cwd());
    
    if (!projectRoot) {
      spinner.fail();
      console.error(chalk.red('Error: Could not find project root (no package.json found)'));
      process.exit(1);
    }

    // Check if package.json exists
    const packageJsonPath = path.join(projectRoot, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
    
    // Install required dependencies
    spinner.text = 'Installing dependencies...';
    const requiredDeps = ['clsx', 'tailwind-merge', 'class-variance-authority', '@radix-ui/react-slot', 'tailwindcss-animate'];
    await installDependencies(projectRoot, requiredDeps);
    
    // Create components.json
    const componentsJsonPath = path.join(projectRoot, 'components.json');
    try {
      await fs.access(componentsJsonPath);
      spinner.info('components.json already exists');
    } catch {
      await fs.writeFile(componentsJsonPath, COMPONENTS_JSON, 'utf-8');
      spinner.succeed(chalk.green('Created components.json'));
    }
    
    // Create lib/utils.ts
    const utilsPath = path.join(projectRoot, 'src', 'lib', 'utils.ts');
    await fs.mkdir(path.dirname(utilsPath), { recursive: true });
    try {
      await fs.access(utilsPath);
      spinner.info('src/lib/utils.ts already exists');
    } catch {
      await fs.writeFile(utilsPath, UTILS_FILE, 'utf-8');
      spinner.succeed(chalk.green('Created src/lib/utils.ts'));
    }
    
    // Create components/ui directory
    const uiDir = path.join(projectRoot, 'src', 'components', 'ui');
    await fs.mkdir(uiDir, { recursive: true });
    spinner.succeed(chalk.green('Created src/components/ui directory'));

    // Setup Tailwind CSS
    const cssPath = path.join(projectRoot, 'src', 'index.css');
    const tailwindConfigPath = path.join(projectRoot, 'tailwind.config.js');
    
    // Check if tailwind.config.js exists
    try {
      await fs.access(tailwindConfigPath);
      // Update existing tailwind.config.js
      spinner.text = 'Updating tailwind.config.js...';
      await fs.writeFile(tailwindConfigPath, TAILWIND_CONFIG, 'utf-8');
      spinner.succeed(chalk.green('Updated tailwind.config.js'));
    } catch {
      // Create new tailwind.config.js
      await fs.writeFile(tailwindConfigPath, TAILWIND_CONFIG, 'utf-8');
      spinner.succeed(chalk.green('Created tailwind.config.js'));
    }
    
    // Setup CSS with Tailwind directives and variables
    const cssDir = path.dirname(cssPath);
    await fs.mkdir(cssDir, { recursive: true });

    try {
      await fs.access(cssPath);
      const existingCss = await fs.readFile(cssPath, 'utf-8');

      // Check if Tailwind directives already exist
      if (existingCss.includes('@tailwind base')) {
        // Already has Tailwind, just add CSS variables if not present
        if (!existingCss.includes('--background')) {
          const newCss = existingCss.trimEnd() + '\n\n' + CSS_VARIABLES;
          await fs.writeFile(cssPath, newCss, 'utf-8');
          spinner.succeed(chalk.green('Added CSS variables to src/index.css'));
        } else {
          spinner.info('CSS already configured');
        }
      } else {
        // Has CSS but no Tailwind directives - replace with full config
        const newCss = TAILWIND_DIRECTIVES + '\n' + CSS_VARIABLES;
        await fs.writeFile(cssPath, newCss, 'utf-8');
        spinner.succeed(chalk.green('Updated src/index.css with Tailwind'));
      }
    } catch {
      // Create new index.css
      await fs.writeFile(cssPath, TAILWIND_DIRECTIVES + '\n' + CSS_VARIABLES, 'utf-8');
      spinner.succeed(chalk.green('Created src/index.css with Tailwind'));
    }

    // Setup Vite config with path alias
    const viteConfigPath = path.join(projectRoot, 'vite.config.ts');
    try {
      await fs.access(viteConfigPath);
      const existingViteConfig = await fs.readFile(viteConfigPath, 'utf-8');
      
      // Check if alias already configured
      if (!existingViteConfig.includes("'@':") && !existingViteConfig.includes('"@":')) {
        // Add alias to existing config
        const newViteConfig = existingViteConfig.replace(
          /plugins:\s*\[([^\]]+)\]/,
          `plugins: [$1],\n  resolve: {\n    alias: {\n      '@': path.resolve(__dirname, './src'),\n    },\n  }`
        );
        await fs.writeFile(viteConfigPath, newViteConfig, 'utf-8');
        spinner.succeed(chalk.green('Added path alias to vite.config.ts'));
      } else {
        spinner.info('Path alias already in vite.config.ts');
      }
    } catch {
      // Create new vite.config.ts
      await fs.writeFile(viteConfigPath, VITE_CONFIG, 'utf-8');
      spinner.succeed(chalk.green('Created vite.config.ts with path alias'));
    }

    spinner.succeed(chalk.green('\n🎉 Duckit initialized successfully!'));
    console.log(chalk.blue('\nYou can now add components:'));
    console.log(chalk.cyan('  npx @duckit/duckit@latest add button'));
    console.log(chalk.cyan('  npx @duckit/duckit@latest add dialog'));
    console.log(chalk.cyan('  npx @duckit/duckit@latest add input'));
    
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

async function installDependencies(projectRoot: string, deps: string[]) {
  const { exec } = await import('node:child_process');
  const { promisify } = await import('node:util');
  const execAsync = promisify(exec);
  
  const installCmd = `npm install ${deps.join(' ')}`;
  
  try {
    await execAsync(installCmd, { cwd: projectRoot });
  } catch (error) {
    throw new Error(`Failed to install dependencies: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
