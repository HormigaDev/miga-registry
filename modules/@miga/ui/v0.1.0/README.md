# @miga/ui – UI Toolkit (v0.1.0)

A minimal, framework‑agnostic library for building _ActionForm_ documents with
consistent styling in Minecraft Bedrock add‑ons. It is designed to reduce
boilerplate when creating in‑game menus, dialogs, and informational screens.

## Highlights

- **Theme colour enum** (`ThemeColor`) for standardized text & decoration.
- **Flexible content** (`UIContent`) accepts strings, translation objects, or
  nested arrays for complex inline messages.
- **Fluent `DocumentBuilder`** that handles headers, paragraphs, properties,
  dividers, lore notes, and interactive buttons.
- Automatic flattening of RawMessage structures to prevent malformed output.

## Installation

```bash
miga fetch @miga/ui --version 0.1.0
```

Use it in your addon as follows:

```ts
import { DocumentBuilder, ThemeColor } from '@miga/ui';

function showWelcome(player: Player) {
    new DocumentBuilder()
        .title('Welcome to My Add‑On')
        .addParagraph('This is a styled paragraph using theme colours.')
        .addButton('Start', () => {
            /* ... */
        })
        .openFor(player);
}
```

## API Overview

- `ThemeColor` – enum of colour codes
- `UIContent` – alias for allowable message types
- `DocumentBuilder` – main class for composing forms
- `DocumentButton` – button definition used internally

---

_Part of the official Miga namespace modules._
