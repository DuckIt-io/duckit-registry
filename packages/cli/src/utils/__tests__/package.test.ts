import { describe, it, expect } from 'vitest'
import { extractPackageName, formatDependency } from '../package.js'

describe('extractPackageName', () => {
  it('extracts scoped package name', () => {
    expect(extractPackageName('@radix-ui/react-slot')).toBe('@radix-ui/react-slot')
    expect(extractPackageName('@radix-ui/react-slot@^1.0.0')).toBe('@radix-ui/react-slot')
  })

  it('extracts regular package name', () => {
    expect(extractPackageName('clsx')).toBe('clsx')
    expect(extractPackageName('clsx@^2.0.0')).toBe('clsx')
  })

  it('extracts package with version', () => {
    expect(extractPackageName('tailwind-merge@^2.0.0')).toBe('tailwind-merge')
  })
})

describe('formatDependency', () => {
  it('parses scoped package without version', () => {
    expect(formatDependency('@radix-ui/react-slot')).toEqual({
      name: '@radix-ui/react-slot',
      version: undefined,
    })
  })

  it('parses scoped package with version', () => {
    expect(formatDependency('@radix-ui/react-slot@^1.0.0')).toEqual({
      name: '@radix-ui/react-slot',
      version: '^1.0.0',
    })
  })

  it('parses regular package', () => {
    expect(formatDependency('clsx@^2.0.0')).toEqual({
      name: 'clsx',
      version: '^2.0.0',
    })
  })
})
