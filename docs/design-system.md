# Duckit Design System

The Duckit look — the signature style that makes Duckit components instantly
recognizable. Every component in this registry follows these rules.

## 1. The Duckit Radius — one radius, everywhere

Duckit's signature is a **uniform 16px radius on every component**, rendered
as a **squircle** via the native CSS `corner-shape` property. No more uneven,
mixed-radius components: every surface — Button, Input, Dialog, Sheet, Card,
Badge, Tabs, Tooltip — uses the same token:

```css
:root {
  --duckit-radius: 24px; /* base token (kept for custom large surfaces) */
  --duckit-radius-step: 8px;
  --duckit-radius-md: max(4px, calc(var(--duckit-radius) - var(--duckit-radius-step))); /* 16px */
  --duckit-radius-sm: max(2px, calc(var(--duckit-radius-md) - var(--duckit-radius-step))); /* 8px */
}
```

### Usage rules

| Token | Value (default) | Used for |
|-------|-----------------|----------|
| `--duckit-radius-md` | 16px | **Every component** — controls, surfaces, containers |
| `--duckit-radius-sm` | 8px | Only tiny nested elements (calendar day cells, Kbd) |
| `--duckit-radius` | 24px | Base token for custom large surfaces |
| `rounded-full` | — | Icon buttons (square sizes) and pills — **no squircle** |

Components apply it like this:

```
rounded-[var(--duckit-radius-md)] [corner-shape:squircle]
```

`corner-shape: squircle` curves the corners smoothly **while keeping borders
perfectly intact** — it shapes the whole border-box, not just the background.
Browsers without support (Firefox/Safari) automatically fall back to regular
rounded corners; nothing breaks.

### Rule

**Never hardcode `rounded-lg` / `rounded-md` / `rounded-xl` in core
components.** Always use `rounded-[var(--duckit-radius-*)]` with
`[corner-shape:squircle]`. The only exceptions are `rounded-full` (icon
buttons) and the tiny nested `--duckit-radius-sm` elements.

## 2. Borders on every surface

Every Duckit component ships with a **visible border** — nothing looks
borderless or "unfinished":

- Containers & surfaces: `border border-border`
- Form controls (Input, Textarea, InputGroup): `border border-input`
- Destructive states: `border-destructive/40`
- Buttons: **all variants** carry a border (`border-border`; `link` keeps
  `border-transparent` so it stays a text link)
- Non-surface components (Separator, Label, AspectRatio, Breadcrumb items) and
  Skeleton placeholders stay borderless by design

## 3. Shadow system — shadows follow the shape

Tailwind's `shadow-*` utilities normally render `box-shadow`, which is always
a rectangle and does **not** follow `corner-shape` corners. Duckit redefines
the utilities with `filter: drop-shadow()`, so shadows trace the actual
rendered shape — squircle corners included.

```css
.shadow-lg {
  filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));
  box-shadow: none;
}
```

**Users keep the familiar API** — `shadow`, `shadow-sm`, `shadow-md`,
`shadow-lg`, `shadow-xl`, `shadow-2xl` all follow the squircle shape with zero
new classes. `shadow-none`, `shadow-inner`, and arbitrary `shadow-[...]` keep
their default box-shadow behavior.

This block ships in `duckit init` output and in `src/styles/duckit.css`.

## 4. Focus Ring

Duckit focus states are **thick and unmistakable**:

```
focus-visible:ring-3 focus-visible:ring-inset
aria-invalid:ring-3 aria-invalid:ring-inset
```

- `ring-3` — bolder than the default `ring-2`, so keyboard users never lose
  their place
- `ring-inset` — draws the ring inside the element, hugging the shape instead
  of being clipped
- Invalid inputs get the same treatment with the destructive color token

## 5. Compact Sizing

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

## 6. Color Tokens

All colors go through semantic tokens (`bg-primary`, `text-muted-foreground`,
`border-border`, ...) defined with oklch in `@theme inline`. Never use raw hex
in components — theme tokens keep dark mode and rebranding free.

## 7. Style Checklist for Contributors

Before committing a component, verify:

- [ ] All radii use `rounded-[var(--duckit-radius-md)]` + `[corner-shape:squircle]` — no bare `rounded-lg/md/xl`
- [ ] Surface components have a visible `border` (`border-border` / `border-input` / destructive variant)
- [ ] Focus visible uses `focus-visible:ring-3 focus-visible:ring-inset`
- [ ] Invalid state uses `aria-invalid:ring-3 aria-invalid:ring-inset` + destructive colors
- [ ] Sizes follow the compact scale (`h-8` default, no `h-10`+)
- [ ] Only semantic color tokens — no hardcoded colors
- [ ] Shadows use `shadow-*` (auto drop-shadow via the Duckit shadow system)
- [ ] `"use client"` at the top, single quotes, Prettier-formatted
