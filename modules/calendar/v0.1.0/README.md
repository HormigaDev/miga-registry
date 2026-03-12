# Calendar Module (v0.1.0)

The **Post‑Corruptionem Calendar** provides a deterministic, seed‑based
calendar system for Minecraft Bedrock behaviour packs. Unlike the vanilla
calendar, which is limited to simple day/night cycles, this module enables
script authors to query human‑readable dates, cultural phases, and schedule
conditional events that react to the in‑game clock.

## Features

- Converts absolute `world` ticks into years, months, days, and day‑of‑year.
- Exposes semantic time enums such as `TimeOfDay`, `SolarCycle`, `SubCycle`,
  and `VillagerPhase`.
- Combines solar, villager, and lunar phases into a single `CalendarPhases`
  object for easy inspection.
- Deterministic event scheduler (`CalendarEventScheduler`) that produces the
  same results every day given the same world seed.
- Configurable calendar length and epoch via `CalendarOptions`.

## Installation

```bash
miga fetch calendar --version 0.1.0
```

Miga automatically rewrites the import path during build time; simply
import the symbols you need:

```ts
import {
    Calendar,
    CalendarEventScheduler,
    CalendarOptions,
    TimeOfDay,
    VillagerPhase,
} from 'calendar';
```

## Basic Usage

```ts
const calendar = new Calendar();
const date = calendar.getDate();
// { year: 1000, month: 1, day: 1, dayOfYear: 0 }

const phases = calendar.getPhases();
// { solar: {...}, villager: ..., moon: ... }

const scheduler = new CalendarEventScheduler(calendar, [
    { id: 'morning-song', weight: 0.5, timeOfDay: TimeOfDay.Sunrise },
]);

// in tick handler
const events = scheduler.pollEvents();
events.forEach((e) => console.log('trigger', e.id));
```

## API Overview

Refer to the TypeScript source for complete types. Key exports are:

- `Calendar`, `CalendarOptions`
- `CalendarEventScheduler`, `CalendarEventDefinition`, `CalendarEventConditions`
- Enums: `TimeOfDay`, `SolarCycle`, `SubCycle`, `VillagerPhase`

---

_This module is part of the Miga registry._
