import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DocumentBuilder, ThemeColor } from '../../../../modules/@miga/ui/v0.1.0/index';

/**
 * Standalone mock functions to track calls and arguments.
 * Returning 'this' simulates the chaining behavior of the real Bedrock API.
 */
const mockTitle = vi.fn().mockReturnThis();
const mockBody = vi.fn().mockReturnThis();
const mockButton = vi.fn().mockReturnThis();
const mockShow = vi.fn().mockResolvedValue({ canceled: false, selection: 0 });

/**
 * Mocks the Bedrock UI environment.
 * Replaces the real ActionFormData with a real mock class that can be
 * instantiated with the 'new' keyword.
 */
vi.mock('@minecraft/server-ui', () => {
    class MockActionFormData {
        title = mockTitle;
        body = mockBody;
        button = mockButton;
        show = mockShow;
    }

    return {
        ActionFormData: MockActionFormData,
    };
});

/**
 * Mock player object required by the openFor method.
 */
const mockPlayer = {} as any;

describe('DocumentBuilder i18n and Formatting', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Should correctly flatten mixed strings and RawMessages in titles', () => {
        const doc = new DocumentBuilder();

        doc.title([{ translate: 'ui.test.start' }, ' - ', { translate: 'ui.test.end' }]);

        doc.openFor(mockPlayer);

        expect(mockTitle).toHaveBeenCalledWith({
            rawtext: [
                { translate: 'ui.test.start' },
                { text: ' - ' },
                { translate: 'ui.test.end' },
            ],
        });
    });

    it('Should strip nested rawtext objects to prevent Bedrock UI crashes', () => {
        const doc = new DocumentBuilder();

        doc.addParagraph(['Start ', { rawtext: [{ translate: 'ui.nested.error' }] }]);

        doc.openFor(mockPlayer);

        expect(mockBody).toHaveBeenCalledWith({
            rawtext: [
                { text: ThemeColor.Text },
                { text: 'Start ' },
                { translate: 'ui.nested.error' },
                { text: '§r\n\n' },
            ],
        });
    });

    it('Should correctly format key-value properties with ThemeColors', () => {
        const doc = new DocumentBuilder();

        doc.addProperty('Health', '100', ThemeColor.Positive);
        doc.openFor(mockPlayer);

        expect(mockBody).toHaveBeenCalledWith({
            rawtext: [
                { text: `  ${ThemeColor.Dimmed}` },
                { text: 'Health' },
                { text: `: ${ThemeColor.Positive}` },
                { text: '100' },
                { text: '§r\n' },
            ],
        });
    });
});

describe('DocumentBuilder Interactivity', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Should execute the correct callback when a button is pressed', async () => {
        const actionSpy1 = vi.fn();
        const actionSpy2 = vi.fn();

        /**
         * Simulates the player clicking the second button (index 1).
         */
        mockShow.mockResolvedValueOnce({
            canceled: false,
            selection: 1,
        });

        const doc = new DocumentBuilder()
            .addButton('Button 1', actionSpy1)
            .addButton('Button 2', actionSpy2);

        doc.openFor(mockPlayer);

        /**
         * Uses a microtask flush to ensure the .then() block inside openFor resolves.
         */
        await Promise.resolve();

        expect(actionSpy1).not.toHaveBeenCalled();
        expect(actionSpy2).toHaveBeenCalled();
    });

    it('Should not execute any callback if the form is canceled', async () => {
        const actionSpy = vi.fn();

        mockShow.mockResolvedValueOnce({
            canceled: true,
            selection: undefined,
        });

        const doc = new DocumentBuilder().addButton('Button', actionSpy);

        doc.openFor(mockPlayer);
        await Promise.resolve();

        expect(actionSpy).not.toHaveBeenCalled();
    });
});
