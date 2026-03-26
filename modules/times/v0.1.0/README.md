# ⏱️ Times (Minecraft Time Utility)

Lightweight utility for converting Minecraft time units into ticks.

## 📌 Overview

Minecraft uses **ticks** as its base time unit:

- `1 second = 20 ticks`
- `1 hour = 1000 ticks`
- `1 day = 24000 ticks`

This module provides simple helpers to convert higher-level units (hours, days, months, years) into ticks.

## 📦 Usage

```typescript
import { Times } from 'times';

// Hours
Times.hours(3); // 3000 ticks

// Days
Times.days(2); // 48000 ticks

// Months (30 days)
Times.months(1); // 720000 ticks

// Years (12 months)
Times.years(1); // 8640000 ticks

// Short years (4 months)
Times.shortYears(1); // 2880000 ticks
```

## 🧠 Concepts

| Unit       | Equivalent   |
| ---------- | ------------ |
| Hour       | 1000 ticks   |
| Day        | 24,000 ticks |
| Month      | 30 days      |
| Year       | 12 months    |
| Short Year | 4 months     |

## 🎯 Use Cases

- Minecraft server scheduling
- Plugin/mod development
- Time-based game logic

## 📄 License

MIT
