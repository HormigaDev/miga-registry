import { system, world } from '@minecraft/server';
import type { BlockCustomComponent, ItemCustomComponent } from '@minecraft/server';
export { EventRouter } from './events/router';
import { ComponentRegistry } from './registry';
import { Logger } from 'logger';

export class MigaApp {
    private readonly startCallbacks: (() => void)[] = [];

    constructor(private readonly registry?: ComponentRegistry) {
        this.bootstrap();
    }

    private bootstrap(): void {
        system.beforeEvents.startup.subscribe((event) => {
            this.registry?.flush(event);
        });

        world.afterEvents.worldLoad.subscribe(() => {
            Logger.info('World loaded. Running onStart callbacks...');
            for (const cb of this.startCallbacks) {
                try {
                    cb();
                } catch (err) {
                    Logger.error('Error in onStart callback.', err);
                }
            }
        });

        Logger.info('Framework initialized.');
    }

    /**
     * Registers a callback to execute once the world has fully loaded.
     *
     * @example
     * app.onStart(() => {
     *   world.sendMessage("Addon ready!");
     * });
     */
    onStart(cb: () => void): void {
        this.startCallbacks.push(cb);
    }

    readonly components = {
        /**
         * Queues a Block Component for registration during `system.beforeEvents.startup`.
         */
        registerBlock: (id: string, impl: BlockCustomComponent): void => {
            if (!this.registry) {
                throw new Error(
                    'Registry must be provided to the MigaApp constructor to register a custom block component.',
                );
            }
            this.registry.registerBlock(id, impl);
        },

        /**
         * Queues an Item Component for registration during `system.beforeEvents.startup`.
         */
        registerItem: (id: string, impl: ItemCustomComponent): void => {
            if (!this.registry) {
                throw new Error(
                    'Registry must be provided to the MigaApp constructor to register a custom item component.',
                );
            }
            this.registry.registerItem(id, impl);
        },
    };
}
