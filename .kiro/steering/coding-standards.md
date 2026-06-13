# Coding Standards

## JavaScript Module Conventions

### Import Maps
- Use import maps with explicit, bare specifiers ending with `*.js` for all JavaScript references that run in the browser
- Example: `"be-hive/": "/node_modules/be-hive/"`

### File Extensions
- Use `*.mjs` files exclusively for npm build scripts, not for browser code
- Use `*.js` files (not `*.ts`) for all browser-executable code
- Enable TypeScript support in `*.js` files via `@ts-check` directive at the top of files

### TypeScript Support
- Add `// @ts-check` at the beginning of JavaScript files to enable TypeScript checking
- Use JSDoc comments for type annotations when needed
- Leverage type definitions from the `types` submodule

## Generated Files: Never Edit *.json Directly

### The Build Pipeline

Each project has `*.mjs` source files that generate corresponding `*.json` configuration files:
- `emc.mjs` → `emc.json` (canonical enhancement config)
- `[emoji].mjs` → `[emoji].json` (emoji shorthand config, imports emc.json)

### Rules

1. **NEVER edit `*.json` files directly** (except `package.json`) — they are generated artifacts
2. **Always edit the `*.mjs` source file** and then run `npm run build`
3. **The `*.mjs` files are the single source of truth** for enhancement configuration
4. **After any change to `*.mjs` files**, run `npm run build` to regenerate the JSON
