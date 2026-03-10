import type { Middleware } from './types';

export function runChain<T>(chain: Middleware<T>[], event: T): void {
    for (let i = 0; i < chain.length; i++) {
        if (chain[i](event) === false) {
            break;
        }
    }
}
