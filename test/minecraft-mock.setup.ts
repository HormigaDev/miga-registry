// test/minecraft-mock.setup.ts
import { vi } from 'vitest';

/**
 * Simulamos @minecraft/server globalmente.
 * Usamos vi.fn() para crear funciones "espía" que podemos modificar
 * más adelante en cada prueba individual.
 */
vi.mock('@minecraft/server', () => {
    return {
        world: {
            getAbsoluteTime: vi.fn().mockReturnValue(0),
            getTimeOfDay: vi.fn().mockReturnValue(0),
            getMoonPhase: vi.fn().mockReturnValue(0),
            sendMessage: vi.fn(),
        },
        system: {
            runInterval: vi.fn(),
            run: vi.fn(),
        },
        // Si necesitas clases puras, puedes devolver clases vacías
        Player: class {},
    };
});

/**
 * Simulamos @minecraft/server-ui globalmente.
 * Devolvemos .mockReturnThis() para permitir el encadenamiento (chaining)
 * que usaste en tu constructor: form.title().body().button()
 */
vi.mock('@minecraft/server-ui', () => {
    const ActionFormDataMock = vi.fn(() => ({
        title: vi.fn().mockReturnThis(),
        body: vi.fn().mockReturnThis(),
        button: vi.fn().mockReturnThis(),
        show: vi.fn().mockResolvedValue({ canceled: false, selection: 0 }),
    }));

    return {
        ActionFormData: ActionFormDataMock,
    };
});
