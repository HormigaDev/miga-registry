const PREFIX = '§3[Miga]§r';

export const Logger = {
    info(message: string): void {
        console.info(`${PREFIX} §f${message}`);
    },

    warn(message: string): void {
        console.warn(`${PREFIX} §e[WARN] ${message}`);
    },

    error(message: string, error?: unknown): void {
        const detail = error instanceof Error ? ` | ${error.name}: ${error.message}` : '';
        console.error(`${PREFIX} §c[ERROR] ${message}${detail}`);
    },
};
