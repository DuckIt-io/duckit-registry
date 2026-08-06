import type { Framework } from '@duckit/config'

export function detectFramework(pkg: Record<string, unknown>): Framework {
  const deps = {
    ...((pkg.dependencies as Record<string, string>) || {}),
    ...((pkg.devDependencies as Record<string, string>) || {}),
  }

  if (deps.next) return 'nextjs'
  if (deps['@remix-run/react']) return 'remix'
  if (deps['react-scripts']) return 'cra'
  if (deps['@astrojs/react']) return 'astro'
  if (deps.vite || deps['@vitejs/plugin-react']) return 'vite'

  return 'vite'
}

export function generateAliasConfig(framework: Framework): string {
  switch (framework) {
    case 'nextjs':
      return `{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}`
    case 'vite':
      return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})`
    case 'remix':
      return `// In remix.config.js or vite.config.ts for Remix v2
export default {
  // Remix v2 uses the \`@\` alias by default
}`
    default:
      return `// Configure your bundler to resolve "@" to "./src"`
  }
}

export function getFrameworkLabel(framework: Framework): string {
  const labels: Record<Framework, string> = {
    nextjs: 'Next.js',
    vite: 'Vite',
    remix: 'Remix',
    cra: 'Create React App',
    astro: 'Astro',
  }
  return labels[framework]
}
