# 🦆 Duckit CLI - Complete Guide

## 🚀 Quick Start

### Untuk Project Baru (Init)

```bash
# 1. Initialize Duckit di project Anda
npx @duckit/duckit@latest init

# 2. Add components yang Anda butuhkan
npx @duckit/duckit@latest add button
npx @duckit/duckit@latest add input
npx @duckit/duckit@latest add dialog
```

### Untuk Project yang Sudah Ada

Jika project Anda sudah memiliki `components.json`, langsung gunakan:

```bash
npx @duckit/duckit@latest add button
```

---

## 📦 Available Components (20 Total)

### Form Components
| Component | Command | Dependencies |
|-----------|---------|--------------|
| Button | `add button` | @radix-ui/react-slot, class-variance-authority |
| Input | `add input` | - |
| Textarea | `add textarea` | - |
| Input Group | `add input-group` | - |

### Navigation Components
| Component | Command | Dependencies |
|-----------|---------|--------------|
| Breadcrumb | `add breadcrumb` | - |
| Navigation Menu | `add navigation-menu` | @radix-ui/react-navigation-menu |
| Tabs | `add tabs` | @radix-ui/react-tabs |

### Overlay Components
| Component | Command | Dependencies |
|-----------|---------|--------------|
| Dialog | `add dialog` | @radix-ui/react-dialog |
| Alert Dialog | `add alert-dialog` | @radix-ui/react-alert-dialog |
| Sheet | `add sheet` | @radix-ui/react-dialog |
| Tooltip | `add tooltip` | @radix-ui/react-tooltip |
| Command | `add command` | cmdk, @radix-ui/react-dialog |

### Display Components
| Component | Command | Dependencies |
|-----------|---------|--------------|
| Alert | `add alert` | - |
| Badge | `add badge` | - |
| Separator | `add separator` | @radix-ui/react-separator |
| Skeleton | `add skeleton` | - |
| Scroll Area | `add scroll-area` | @radix-ui/react-scroll-area |
| Aspect Ratio | `add aspect-ratio` | @radix-ui/react-aspect-ratio |
| Collapsible | `add collapsible` | @radix-ui/react-collapsible |
| Calendar | `add calendar` | react-day-picker, date-fns |

---

## 🛠 Commands

### `init` - Initialize Duckit

Menyiapkan project Anda untuk menggunakan Duckit components.

```bash
npx @duckit/duckit@latest init
```

**Apa yang dilakukan:**
1. Install dependencies yang diperlukan
2. Buat `components.json` (jika belum ada)
3. Buat `src/lib/utils.ts` dengan fungsi `cn()`
4. Buat folder `src/components/ui`

### `add` - Add Component

Menambahkan component ke project Anda.

```bash
# Single component
npx @duckit/duckit@latest add button

# Multiple components
npx @duckit/duckit@latest add button input dialog

# Skip confirmation
npx @duckit/duckit@latest add button -y

# Overwrite existing file
npx @duckit/duckit@latest add button -o
```

**Options:**
- `-y, --yes` - Skip confirmation prompt
- `-o, --overwrite` - Overwrite existing files

---

## 📋 Prerequisites

Sebelum menggunakan Duckit, pastikan project Anda memiliki:

### 1. React + TypeScript

```bash
npm install react react-dom typescript @types/react @types/react-dom
```

### 2. Tailwind CSS

```bash
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. Required Dependencies

```bash
npm install clsx tailwind-merge class-variance-authority @radix-ui/react-slot lucide-react
```

### 4. Path Aliases (tsconfig.json)

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 5. Tailwind Config (tailwind.config.js)

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

## 📁 Project Structure

Setelah init, structure project Anda akan seperti:

```
my-project/
├── src/
│   ├── lib/
│   │   └── utils.ts          # cn() utility function
│   ├── components/
│   │   └── ui/               # Components dari Duckit
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       └── ...
│   ├── App.tsx
│   └── main.tsx
├── components.json           # Duckit configuration
├── tailwind.config.js
└── tsconfig.json
```

---

## 🔧 Configuration (components.json)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

---

## 💡 Usage Examples

### Button Component

```tsx
import { Button } from "@/components/ui/button"

function App() {
  return (
    <div>
      <Button>Click me</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="destructive">Delete</Button>
    </div>
  )
}
```

### Dialog Component

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

function App() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome!</DialogTitle>
        </DialogHeader>
        <p>This is a dialog content.</p>
      </DialogContent>
    </Dialog>
  )
}
```

### Form Component

```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

function LoginForm() {
  return (
    <form>
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter your email" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
        <Button type="submit">Login</Button>
      </div>
    </form>
  )
}
```

---

## 🐛 Troubleshooting

### Error: "Cannot find module '@/components/ui/button'"

**Solution:** Pastikan path alias sudah dikonfigurasi di `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Error: "cn is not defined"

**Solution:** Pastikan `src/lib/utils.ts` sudah dibuat:

```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Components tidak styled

**Solution:** Pastikan Tailwind CSS sudah dikonfigurasi dengan benar:

1. `tailwind.config.js` includes your files:
```js
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]
```

2. Import Tailwind di `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 📚 Resources

- **GitHub:** https://github.com/DuckIt-io/DuckitIo
- **npm (CLI):** https://www.npmjs.com/package/@duckit/duckit
- **npm (Registry):** https://www.npmjs.com/package/@duckit/registry

---

## 📄 License

MIT
