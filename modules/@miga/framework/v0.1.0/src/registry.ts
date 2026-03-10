import type { BlockCustomComponent, ItemCustomComponent, StartupEvent } from '@minecraft/server';
import { Logger } from 'logger';

type RegistryEntry =
    | { type: 'BLOCK'; id: string; impl: BlockCustomComponent }
    | { type: 'ITEM'; id: string; impl: ItemCustomComponent };

export class ComponentRegistry {
    private queue: RegistryEntry[] = [];

    /**
     * Queues a custom Block Component for registration during startup.
     *
     * @example
     * registry.registerBlock("miga:bouncy_block", {
     *   onEntityFallOn(event) { event.entity?.applyKnockback(0, 0, 0, 2); }
     * });
     */
    registerBlock(id: string, impl: BlockCustomComponent): void {
        this.queue.push({ type: 'BLOCK', id, impl });
    }

    /**
     * Queues a custom Item Component for registration during startup.
     *
     * @example
     * registry.registerItem("miga:magic_wand", {
     *   onUse(event) { event.source.sendMessage("Zap!"); }
     * });
     */
    registerItem(id: string, impl: ItemCustomComponent): void {
        this.queue.push({ type: 'ITEM', id, impl });
    }

    flush(event: StartupEvent): void {
        if (this.queue.length === 0) return;

        Logger.info(`Flushing registry (${this.queue.length} entries)...`);

        for (const entry of this.queue) {
            try {
                if (entry.type === 'BLOCK') {
                    event.blockComponentRegistry.registerCustomComponent(entry.id, entry.impl);
                } else {
                    event.itemComponentRegistry.registerCustomComponent(entry.id, entry.impl);
                }
                Logger.info(`  §aOK§r [${entry.type}] "${entry.id}"`);
            } catch (err) {
                Logger.error(`Failed to register [${entry.type}] "${entry.id}". Skipping.`, err);
            }
        }

        this.queue = [];
    }
}
