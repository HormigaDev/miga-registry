/**
 * BiMap (Bi-directional Map)
 * Enforces a 1:1 relationship between Keys and Values.
 * Garantiza una relación 1:1 entre Claves (K) y Valores (V).
 */
export class BiMap<K, V> {
    private forward: Map<K, V>;
    private reverse: Map<V, K>;

    constructor(entries?: [K, V][]) {
        this.forward = new Map<K, V>();
        this.reverse = new Map<V, K>();

        if (entries) {
            for (const [key, value] of entries) {
                this.set(key, value);
            }
        }
    }

    /**
     * Sets the value for the key.
     * If the key already exists, updates the value.
     * If the value already exists for another key, that old key is removed (enforcing 1:1).
     */
    set(key: K, value: V): void {
        // 1. Clean up existing key in forward map
        if (this.forward.has(key)) {
            const oldValue = this.forward.get(key)!;
            this.reverse.delete(oldValue);
        }

        // 2. Clean up existing value in reverse map (enforce uniqueness)
        if (this.reverse.has(value)) {
            const oldKey = this.reverse.get(value)!;
            this.forward.delete(oldKey);
        }

        // 3. Set new entries
        this.forward.set(key, value);
        this.reverse.set(value, key);
    }

    getByKey(key: K): V | undefined {
        return this.forward.get(key);
    }

    getByValue(value: V): K | undefined {
        return this.reverse.get(value);
    }

    hasKey(key: K): boolean {
        return this.forward.has(key);
    }

    hasValue(value: V): boolean {
        return this.reverse.has(value);
    }

    /**
     * Removes an entry by key.
     */
    deleteByKey(key: K): boolean {
        if (!this.forward.has(key)) return false;
        const value = this.forward.get(key)!;
        this.forward.delete(key);
        this.reverse.delete(value);
        return true;
    }

    /**
     * Removes an entry by value.
     */
    deleteByValue(value: V): boolean {
        if (!this.reverse.has(value)) return false;
        const key = this.reverse.get(value)!;
        this.reverse.delete(value);
        this.forward.delete(key);
        return true;
    }

    get size(): number {
        return this.forward.size;
    }

    clear(): void {
        this.forward.clear();
        this.reverse.clear();
    }
}
