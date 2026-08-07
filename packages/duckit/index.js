#!/usr/bin/env node

// Alias package for @duckit/cli — lets `npx duckit ...` resolve correctly.
// The real CLI (commander program) parses argv at module scope.
import '@duckit/cli/dist/index.js'
