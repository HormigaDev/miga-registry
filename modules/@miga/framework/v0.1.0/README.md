# @miga/framework v0.1.0

> Production‑grade framework for Minecraft Bedrock Addons

This package provides a lightweight runtime that simplifies common tasks when
building addons for Minecraft Bedrock Edition using the script engine. It
abstracts event routing, component registration, and startup handling so you
can focus on game logic.

---

## Key Concepts

### `MigaApp`

The central application instance. Creating a `MigaApp` wires up lifecycle hooks
and provides helpers for registering components and scheduling startup
callbacks.

```ts
import { MigaApp } from '@miga/framework';

const app = new MigaApp();

app.onStart(() => {
    world.sendMessage('Addon ready!');
});
```

`MigaApp` accepts an optional `ComponentRegistry` when you need to register
custom block or item components (see below).

### `ComponentRegistry`

Queue block/item component definitions and flush them during the engine's
startup event. This ensures registration happens at the proper time while
keeping your module code declarative.

```ts
import { ComponentRegistry } from '@miga/framework';

const registry = new ComponentRegistry();

registry.registerBlock('miga:bouncy_block', {
    onEntityFallOn(event) {
        event.entity?.applyKnockback(0, 0, 0, 2);
    },
});

registry.registerItem('miga:magic_wand', {
    onUse(event) {
        event.source.sendMessage('Zap!');
    },
});

const app = new MigaApp(registry);
```

### `EventRouter` & Middleware

EventRouter offers a simple middleware-style API for both before/after world
events. Handlers are executed sequentially and may short‑circuit by returning
`false`.

```ts
import { EventRouter } from '@miga/framework';

const router = new EventRouter();

router.after('playerJoin', (event) => {
    event.player.sendMessage('Welcome!');
});

// Guard example
router.before('blockPlace', (event) => {
    if (!event.player.hasTag('builder')) return false;
});
```

Helper types are exported for convenience:

```ts
import type { Middleware, ExtractEventData } from '@miga/framework';
```

---

## Getting Started

This module is intended to be fetched by the [Miga CLI](https://github.com/HormigaDev/miga-cli) and
bundled into your addon; it is _not_ distributed via npm or any JavaScript
registry. The CLI will place the sources under `.miga_modules/` and rewrite
bare imports for you during the build.

```bash
# grab the latest published copy (or a specific version)
miga fetch @miga/framework --version 0.1.0
```

> 📁 Your addon should have a `miga.json` manifest; add
> `"@miga/framework": "*"` (or a concrete version) to the
> `dependencies` section.

Imports remain simple and version‑agnostic:

```ts
import { MigaApp } from '@miga/framework';
```

Once the code is available in `.miga_modules`, initialise the framework early:

1. create an optional `ComponentRegistry` if you need to register custom
   block/item components.
2. construct `MigaApp` (passing the registry, if any).
3. attach `onStart` callbacks or add router handlers before the world loads.

```ts
import { MigaApp, ComponentRegistry, EventRouter } from '@miga/framework';

const registry = new ComponentRegistry();
const router = new EventRouter();

const app = new MigaApp(registry);

app.onStart(() => {
    // world is fully loaded
});

router.after('playerJoin', (ev) => {
    ev.player.sendMessage('hi');
});
```

> 🔧 Because Miga rewrites imports during compilation, **never** reference
> internal paths such as `../../.miga_modules/...` in your source. Use only
> the bare module name shown above.

---

## Development

- Source files live in `src/`.
- Build/packaging is handled by the root `scripts/prepare-module.js` script.
- The repository follows semantic versioning; bump `manifest.json` accordingly.

---

## License

This project is licensed under the [MIT License](../../LICENSE).
