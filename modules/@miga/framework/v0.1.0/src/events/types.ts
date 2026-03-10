/**
 * A middleware function for a given event type `T`.
 *
 * @example
 * const guard: Middleware<PlayerJoinAfterEvent> = (event, next) => {
 *   if (!event.player.hasTag("allowed")) return;
 *   next();
 * };
 */
export type Middleware<T> = (event: T) => void | false;

/**
 * Extracts the event data type from a native Bedrock `EventSignal`.
 *
 * @example
 * type JoinData = ExtractEventData<typeof world.afterEvents.playerJoin>;
 * // → PlayerJoinAfterEvent
 */
export type ExtractEventData<T> = T extends {
    subscribe(callback: (arg: infer A) => void): unknown;
}
    ? A
    : never;
