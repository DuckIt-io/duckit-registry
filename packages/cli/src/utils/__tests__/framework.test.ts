import { describe, it, expect } from 'vitest'
import { detectFramework } from '../framework.js'

describe('detectFramework', () => {
  it('detects Next.js', () => {
    expect(detectFramework({ dependencies: { next: '14.0.0' } })).toBe('nextjs')
  })

  it('detects Vite', () => {
    expect(detectFramework({ devDependencies: { vite: '5.0.0' } })).toBe('vite')
  })

  it('detects Vite with @vitejs/plugin-react', () => {
    expect(detectFramework({ devDependencies: { '@vitejs/plugin-react': '4.0.0' } })).toBe('vite')
  })

  it('defaults to Vite for unknown', () => {
    expect(detectFramework({ dependencies: { express: '4.0.0' } })).toBe('vite')
  })

  it('handles empty package.json', () => {
    expect(detectFramework({})).toBe('vite')
  })
})
