export interface ComponentFile {
  path: string
  content: string
  type: 'component' | 'utils' | 'hook' | 'style'
}

export interface RegistryItem {
  name: string
  description?: string
  dependencies: string[]
  devDependencies: string[]
  files: ComponentFile[]
}

export type RegistryCategory =
  'components' | 'animated' | 'blocks' | 'sections' | 'templates' | 'effects'

export interface RegistrySchema {
  $schema?: string
  version: number
  categories: Record<RegistryCategory, Record<string, RegistryItem>>
}

export interface ComponentsJson {
  $schema?: string
  style: 'default' | 'new-york'
  rsc: boolean
  tsx: boolean
  tailwind: {
    config: string
    css: string
    baseColor: string
    cssVariables: boolean
    prefix?: string
  }
  iconLibrary?: string
  aliases: {
    components: string
    utils: string
    ui: string
    lib?: string
    hooks?: string
  }
}

export type Framework = 'nextjs' | 'vite' | 'remix' | 'cra' | 'astro'

export interface FrameworkConfig {
  name: Framework
  detect(): boolean
  generateAlias(): string
  generateConfig?(): string
}
