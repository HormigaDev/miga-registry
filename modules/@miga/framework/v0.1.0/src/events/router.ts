import { world } from '@minecraft/server';
import type { WorldAfterEvents, WorldBeforeEvents } from '@minecraft/server';
import type { ExtractEventData, Middleware } from './types';
import { runChain } from './utils';
import { Logger } from 'logger';

type AfterEventData<K extends keyof WorldAfterEvents> = Parameters<
    WorldAfterEvents[K]['subscribe']
>[0] extends (arg: infer E) => void
    ? E
    : never;

type BeforeEventData<K extends keyof WorldBeforeEvents> = Parameters<
    WorldBeforeEvents[K]['subscribe']
>[0] extends (arg: infer E) => void
    ? E
    : never;

export class EventRouter {
    private readonly afterMiddlewares = new Map<keyof WorldAfterEvents, Middleware<any>[]>();

    private readonly beforeMiddlewares = new Map<keyof WorldBeforeEvents, Middleware<any>[]>();

    private readonly activeAfter = new Set<keyof WorldAfterEvents>();
    private readonly activeBefore = new Set<keyof WorldBeforeEvents>();

    after<K extends keyof WorldAfterEvents>(
        eventName: K,
        callback: Middleware<ExtractEventData<AfterEventData<K>>>,
    ): void {
        if (!this.afterMiddlewares.has(eventName)) {
            this.afterMiddlewares.set(eventName, []);
        }

        this.afterMiddlewares.get(eventName)!.push(callback as Middleware<any>);

        if (this.activeAfter.has(eventName)) return;

        this.activeAfter.add(eventName);
        this.bindAfter(eventName);
    }

    before<K extends keyof WorldBeforeEvents>(
        eventName: K,
        callback: Middleware<ExtractEventData<BeforeEventData<K>>>,
    ): void {
        if (!this.beforeMiddlewares.has(eventName)) {
            this.beforeMiddlewares.set(eventName, []);
        }

        this.beforeMiddlewares.get(eventName)!.push(callback as Middleware<any>);

        if (this.activeBefore.has(eventName)) return;

        this.activeBefore.add(eventName);
        this.bindBefore(eventName);
    }

    private bindAfter<K extends keyof WorldAfterEvents>(eventName: K): void {
        const signal = world.afterEvents[eventName];

        signal.subscribe((eventData) => {
            const chain = this.afterMiddlewares.get(eventName);
            if (!chain || chain.length === 0) return;

            try {
                runChain(chain as Middleware<typeof eventData>[], eventData);
            } catch (err) {
                Logger.error(`Unhandled error in after chain for "${String(eventName)}".`, err);
            }
        });
    }

    private bindBefore<K extends keyof WorldBeforeEvents>(eventName: K): void {
        const signal = world.beforeEvents[eventName];

        signal.subscribe((eventData) => {
            const chain = this.beforeMiddlewares.get(eventName);
            if (!chain || chain.length === 0) return;

            try {
                runChain(chain as Middleware<typeof eventData>[], eventData);
            } catch (err) {
                Logger.error(`Unhandled error in before chain for "${String(eventName)}".`, err);
            }
        });
    }
}
