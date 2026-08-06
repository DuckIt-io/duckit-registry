# Duckit Design System

The Duckit look — the signature style that makes Duckit components instantly
recognizable. Every component in this registry follows these rules.

## 1. The Duckit Radius

Duckit's signature is its **generous, friendly radius scale**. All corners are
driven by three CSS custom properties that users define once:

```css
:root {
  --duckit-radius: 24px;          /* signature base — large, friendly */
  --duckit-radius-step: 8px;      /* linear scale step */
  --duckit-radius-md: max(4px, calc(var(--duckit-radius) - var(--duckit-radius-step))); /* 16px */
  --duckit-radius-sm: max(2px, calc(var(--duckit-radius-md) - var(--duckit-radius-step))); /* 8px */
}
```

`duckit init` writes these variables into your CSS automatically.

### When to use which token

| Token | Value (default) | Used for |
|-------|-----------------|----------|
| `--duckit-radius` | 24px | Hero surfaces: sheets, cards, code blocks, large containers |
| `--duckit-radius-md` | 16px | Interactive controls: buttons, inputs, alerts, dialogs, badges |
| `--duckit-radius-sm` | 8px | Small/nested elements: tags inside groups, compact chips |
| `rounded-full` | — | Icon buttons (square) and pills |

### Rule

**Never hardcode `rounded-lg` / `rounded-md` / `rounded-xl` in core
components.** Always use `rounded-[var(--duckit-radius-*)]`. This keeps every
component consistent and lets users scale the entire system with a single
variable. The only exceptions are nested micro-elements (e.g. inside
`button-group`) and `rounded-full` for icon buttons.

## 2. Focus Ring

Duckit focus states are **thick and unmistakable**:

```
focus-visible:ring-3 focus-visible:ring-inset
aria-invalid:ring-3 aria-invalid:ring-inset
```

- `ring-3` — bolder than the default `ring-2`, so keyboard users never lose
  their place
- `ring-inset` — draws the ring inside the element, hugging the squircle-ish
  corner instead of being clipped by `overflow`
- Invalid inputs get the same treatment with the destructive color token

## 3. Compact Sizing

Duckit controls are **compact by default** — small footprints, tight gaps:

| Size | Height | Use |
|------|--------|-----|
| `xs` | 24px (`h-6`) | Dense toolbars, tables |
| `sm` | 28px (`h-7`) | Secondary actions |
| `default` | 32px (`h-8`) | Primary actions (default) |
| `lg` | 36px (`h-9`) | Prominent CTAs |
| `icon` | 36px (`size-9`, `rounded-full`) | Icon-only buttons |

Gap scale: `gap-1` (`sm`/`xs`), `gap-1.5` (default/lg). Padding hugs content —
`px-2.5` for default — the compact feel is part of the brand.

## 4. Color Tokens

All colors go through semantic tokens (`bg-primary`, `text-muted-foreground`,
`border-border`, ...) defined with oklch in `@theme inline`. Never use raw hex
in components — theme tokens keep dark mode and rebranding free.

## 5. Style Checklist for Contributors

Before committing a component, verify:

- [ ] All radii use `rounded-[var(--duckit-radius-*)]` — no bare `rounded-lg/md/xl`
- [ ] Focus visible uses `focus-visible:ring-3 focus-visible:ring-inset`
- [ ] Invalid state uses `aria-invalid:ring-3 aria-invalid:ring-inset` + destructive colors
- [ ] Sizes follow the compact scale (`h-8` default, no `h-10`+)
- [ ] Only semantic color tokens — no hardcoded colors
- [ ] `"use client"` at the top, single quotes, Prettier-formatted
