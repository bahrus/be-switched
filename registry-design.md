# Registry Design for be-switched

## Problem

The `NValueSwitchHandler` and `🎚️.js` relied on `be-hive/Registry.js` to store named handlers that users could register (e.g., `register('isEqual', e => e.r = e.f.lhs === e.f.rhs)`). That Registry has been removed from the revamped be-hive. We need a replacement that is scoped to be-switched.

## Requirements

1. Users can register named handler functions for use with `on if handlerName, per ...` syntax
2. The registry must be available before the enhancement processes templates (handlers registered in `<script type=module>` blocks)
3. Built-in handlers (like `eq`, `nearlyEq`) should be pre-registered
4. Registration should be simple — one import, one call

## Alternatives

### Option A: Module-level Map (Simplest)

A plain `Map` exported from a dedicated module. No classes, no complexity.

```js
// registry.js
/** @type {Map<string, Function>} */
const handlers = new Map();

export function register(name, handler) {
    handlers.set(name, handler);
}

export function get(name) {
    return handlers.get(name);
}

// Built-in handlers
register('eq', e => { e.r = e.args[0] === e.args[1]; });
register('nearlyEq', e => {
    e.r = Math.abs(e.args[0] - e.args[1]) < Number(e.target.dataset.maxDiff || 10);
});
```

**Pros:**
- Dead simple, zero dependencies
- Module singleton guarantees single instance per import map resolution
- Synchronous access — no async overhead
- Tree-shakeable if built-ins are moved to a separate file

**Cons:**
- Global to the entire page (but so was be-hive/Registry)
- No scoping per enhancement instance

---

### Option B: Symbol-keyed Global Registry

Use `Symbol.for()` to store the registry on `globalThis`, guaranteeing a single instance even across multiple module versions.

```js
// registry.js
const REGISTRY_KEY = Symbol.for('be-switched:handlers');
if (!globalThis[REGISTRY_KEY]) {
    globalThis[REGISTRY_KEY] = new Map();
}

/** @type {Map<string, Function>} */
const handlers = globalThis[REGISTRY_KEY];

export function register(name, handler) {
    handlers.set(name, handler);
}

export function get(name) {
    return handlers.get(name);
}
```

**Pros:**
- Survives duplicate module instances (e.g., CDN + local copy)
- Same simplicity as Option A
- Pattern already used in id-generation for global counters

**Cons:**
- Slightly less clean (globalThis pollution, albeit via Symbol)
- Debugging slightly harder (can't just inspect the Map from devtools without the symbol)

---

### Option C: Enhancement-scoped Registry (via EMC customData)

Store handlers in the EMC's `customData` object, so each enhancement "instance" (be-switched vs 🎚️) could theoretically have its own set of handlers.

```js
// In emc.mjs customData:
customData: {
    handlers: {
        eq: (e) => { e.r = e.args[0] === e.args[1]; },
        nearlyEq: (e) => { ... }
    },
    ...
}

// register function receives the emc config:
export function register(emc, name, handler) {
    emc.customData.handlers[name] = handler;
}
```

**Pros:**
- Scoped per enhancement configuration
- Different emoji aliases could have different handler sets
- No globals

**Cons:**
- Registration API is more awkward — user needs access to the emc object
- Doesn't match current user-facing API (`import {register} from 'be-switched/🎚️.js'`)
- Harder to register handlers from arbitrary script blocks that don't import the emc

---

### Option D: CustomEvent-based Registration

Use DOM events to register handlers — scripts dispatch a registration event, and be-switched listens for it.

```js
// User code:
document.dispatchEvent(new CustomEvent('be-switched:register', {
    detail: { name: 'isEqual', handler: e => e.r = e.f.lhs === e.f.rhs }
}));
```

**Pros:**
- No imports needed for registration
- Works with any script loading order (if listener is set up early)
- Decoupled

**Cons:**
- Unusual pattern — less discoverable
- Timing issues if the enhancement processes before the event is dispatched
- Harder to type-check
- No way to query registered handlers synchronously

---

## Recommendation: Option A (Module-level Map)

**Why:**

1. **Simplicity** — It's the least amount of code, easiest to understand, and matches the existing user-facing API pattern (`import {register} from '...'`).

2. **Reliability** — ES module singletons are guaranteed by the import map. Since be-switched already requires an import map for all its dependencies, the registry module will always resolve to a single instance.

3. **The scoping concern is theoretical** — In practice, `be-switched` and `🎚️` are the same enhancement with different attribute names. There's no real use case for different handler sets per alias. If that ever changes, Option A can be evolved into Option B trivially.

4. **Matches the ecosystem** — This is how libraries like Lit, Stencil, and even the DOM itself (CustomElementRegistry) work — a module-level singleton.

## Proposed Implementation

```
be-switched/
├── registry.js          ← new file: Map + register/get + built-ins
├── 🎚️.js               ← re-exports register from registry.js  
├── NValueSwitchHandler.js ← imports get() from registry.js
```

The `🎚️.js` file becomes:

```js
import { register } from './registry.js';
export { register };

// ... existing seed/mount logic
```

And `NValueSwitchHandler` replaces `import('be-hive/Registry.js')` with:

```js
import { get } from './registry.js';
const handler = get(registeredHandler);
```
