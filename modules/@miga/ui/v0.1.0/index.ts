import { Player, RawMessage } from '@minecraft/server';
import { ActionFormData } from '@minecraft/server-ui';

/**
 * Standardized color palette for UI consistency.
 */
export enum ThemeColor {
    Primary = '§g',
    Secondary = '§e',
    Text = '§f',
    Dimmed = '§7',
    Lore = '§8',
    Highlight = '§b',
    Positive = '§a',
    Negative = '§c',
}

/**
 * Flexible type that allows single strings, translations, or an ordered array of both
 * to build composite inline sentences.
 */
export type UIContent = string | RawMessage | (string | RawMessage)[];

/**
 * Definition of an interactive document button.
 */
export interface DocumentButton {
    text: RawMessage;
    iconPath?: string;
    action: () => void;
}

/**
 * Agnostic document builder that enforces typography and spacing guidelines.
 * Wraps ActionFormData to create clean interfaces with deep, flat i18n support.
 */
export class DocumentBuilder {
    private titleContent: RawMessage = { rawtext: [] };
    private bodyElements: RawMessage[] = [];
    private buttons: DocumentButton[] = [];

    /**
     * Safely flattens an array of strings and RawMessages into a strict, single-level
     * array of RawMessage objects. Strips out nested 'rawtext' wrappers.
     */
    private flattenContent(content: UIContent): RawMessage[] {
        const flat: RawMessage[] = [];
        const items = Array.isArray(content) ? content : [content];

        for (const item of items) {
            if (typeof item === 'string') {
                flat.push({ text: item });
            } else if ('rawtext' in item && Array.isArray(item.rawtext)) {
                flat.push(...item.rawtext);
            } else {
                flat.push(item);
            }
        }

        return flat;
    }

    /**
     * Sets the main title of the UI form. Supports composite inline text.
     */
    public title(content: UIContent): this {
        this.titleContent = { rawtext: this.flattenContent(content) };
        return this;
    }

    /**
     * Internal helper to safely append styled content with a prefix and suffix.
     */
    private pushFormatted(prefix: string, content: UIContent, suffix: string): void {
        this.bodyElements.push({ text: prefix });
        this.bodyElements.push(...this.flattenContent(content));
        this.bodyElements.push({ text: suffix });
    }

    /**
     * Adds a primary section header. Supports composite inline text.
     */
    public addHeader(content: UIContent): this {
        this.pushFormatted(`${ThemeColor.Primary}§l`, content, '§r\n');
        return this;
    }

    /**
     * Adds a secondary header. Supports composite inline text.
     */
    public addSubHeader(content: UIContent): this {
        this.pushFormatted(`\n${ThemeColor.Secondary}`, content, '§r\n');
        return this;
    }

    /**
     * Adds a standard paragraph of text. Supports composite inline text.
     */
    public addParagraph(content: UIContent): this {
        this.pushFormatted(ThemeColor.Text, content, '§r\n\n');
        return this;
    }

    /**
     * Adds a key-value property pair.
     * Fully supports flat translations and composite arrays for both key and value.
     */
    public addProperty(
        key: UIContent,
        value: UIContent,
        valueColor: ThemeColor = ThemeColor.Text,
    ): this {
        this.bodyElements.push({ text: `  ${ThemeColor.Dimmed}` });
        this.bodyElements.push(...this.flattenContent(key));

        this.bodyElements.push({ text: `: ${valueColor}` });
        this.bodyElements.push(...this.flattenContent(value));

        this.bodyElements.push({ text: '§r\n' });

        return this;
    }

    /**
     * Adds a visual divider line.
     */
    public addDivider(): this {
        this.bodyElements.push({
            text: `\n${ThemeColor.Dimmed}----------------------------§r\n\n`,
        });
        return this;
    }

    /**
     * Adds an italicized lore or disclaimer note at the bottom.
     */
    public addLoreNote(content: UIContent): this {
        this.pushFormatted(`\n${ThemeColor.Lore}§o* `, content, '§r\n');
        return this;
    }

    /**
     * Adds an interactive button to the document. Supports composite inline text.
     */
    public addButton(content: UIContent, action: () => void, iconPath?: string): this {
        this.buttons.push({
            text: { rawtext: this.flattenContent(content) },
            iconPath,
            action,
        });
        return this;
    }

    /**
     * Compiles and displays the form to the target player.
     */
    public openFor(player: Player): void {
        const form = new ActionFormData();

        form.title(this.titleContent);

        if (this.bodyElements.length > 0) {
            form.body({ rawtext: this.bodyElements });
        }

        for (const btn of this.buttons) {
            if (btn.iconPath) {
                form.button(btn.text, btn.iconPath);
            } else {
                form.button(btn.text);
            }
        }

        form.show(player).then((response) => {
            if (response.canceled || response.selection === undefined) {
                return;
            }

            const selectedButton = this.buttons[response.selection];
            if (selectedButton && selectedButton.action) {
                selectedButton.action();
            }
        });
    }
}
