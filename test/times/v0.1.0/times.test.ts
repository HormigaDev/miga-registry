import { describe, it, expect } from 'vitest';
import { Times } from '../../../modules/times/v0.1.0/times';

describe('Times - Minecraft Time Conversions', () => {
    describe('hours', () => {
        it('Should convert 1 hour to 1000 ticks by default', () => {
            const result = Times.hours();
            expect(result).toBe(1000);
        });

        it('Should convert multiple hours to ticks', () => {
            expect(Times.hours(3)).toBe(3000);
            expect(Times.hours(5)).toBe(5000);
            expect(Times.hours(24)).toBe(24000);
        });

        it('Should handle fractional hours', () => {
            expect(Times.hours(0.5)).toBe(500);
            expect(Times.hours(1.5)).toBe(1500);
        });
    });

    describe('days', () => {
        it('Should convert 1 day to 24000 ticks by default', () => {
            const result = Times.days();
            expect(result).toBe(24000);
        });

        it('Should convert multiple days to ticks', () => {
            expect(Times.days(2)).toBe(48000);
            expect(Times.days(7)).toBe(168000);
            expect(Times.days(30)).toBe(720000);
        });

        it('Should handle fractional days', () => {
            expect(Times.days(0.5)).toBe(12000);
            expect(Times.days(1.5)).toBe(36000);
        });
    });

    describe('months', () => {
        it('Should convert 1 month (30 days) to 720000 ticks by default', () => {
            const result = Times.months();
            expect(result).toBe(720000);
        });

        it('Should convert multiple months to ticks', () => {
            expect(Times.months(2)).toBe(1440000);
            expect(Times.months(6)).toBe(4320000);
            expect(Times.months(12)).toBe(8640000);
        });

        it('Should handle fractional months', () => {
            expect(Times.months(0.5)).toBe(360000);
            expect(Times.months(1.5)).toBe(1080000);
        });
    });

    describe('years', () => {
        it('Should convert 1 year (12 months) to 8640000 ticks by default', () => {
            const result = Times.years();
            expect(result).toBe(8640000);
        });

        it('Should convert multiple years to ticks', () => {
            expect(Times.years(2)).toBe(17280000);
            expect(Times.years(5)).toBe(43200000);
            expect(Times.years(10)).toBe(86400000);
        });

        it('Should handle fractional years', () => {
            expect(Times.years(0.5)).toBe(4320000);
            expect(Times.years(1.5)).toBe(12960000);
        });
    });

    describe('shortYears', () => {
        it('Should convert 1 short year (4 months) to 2880000 ticks by default', () => {
            const result = Times.shortYears();
            expect(result).toBe(2880000);
        });

        it('Should convert multiple short years to ticks', () => {
            expect(Times.shortYears(2)).toBe(5760000);
            expect(Times.shortYears(3)).toBe(8640000);
            expect(Times.shortYears(4)).toBe(11520000);
        });

        it('Should handle fractional short years', () => {
            expect(Times.shortYears(0.5)).toBe(1440000);
            expect(Times.shortYears(1.5)).toBe(4320000);
        });
    });

    describe('Time unit relationships', () => {
        it('Should maintain correct relationship: 1 day = 24 hours', () => {
            expect(Times.days(1)).toBe(Times.hours(24));
        });

        it('Should maintain correct relationship: 1 month = 30 days', () => {
            expect(Times.months(1)).toBe(Times.days(30));
        });

        it('Should maintain correct relationship: 1 year = 12 months', () => {
            expect(Times.years(1)).toBe(Times.months(12));
        });

        it('Should maintain correct relationship: 1 short year = 4 months', () => {
            expect(Times.shortYears(1)).toBe(Times.months(4));
        });

        it('Should maintain correct relationship: 1 year = 3 short years', () => {
            expect(Times.years(1)).toBe(Times.shortYears(3));
        });
    });

    describe('Edge cases', () => {
        it('Should handle zero values', () => {
            expect(Times.hours(0)).toBe(0);
            expect(Times.days(0)).toBe(0);
            expect(Times.months(0)).toBe(0);
            expect(Times.years(0)).toBe(0);
            expect(Times.shortYears(0)).toBe(0);
        });

        it('Should handle large values', () => {
            expect(Times.hours(1000)).toBe(1000000);
            expect(Times.days(365)).toBe(8760000);
            expect(Times.years(100)).toBe(864000000);
        });
    });
});
