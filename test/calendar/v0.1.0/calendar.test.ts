import { world } from '@minecraft/server';
import {
    Calendar,
    CalendarEventScheduler,
    SolarCycle,
    SubCycle,
    TimeOfDay,
    VillagerPhase,
} from '../../../modules/calendar/v0.1.0/calendar';

/**
 * Mocks the Bedrock server environment globally.
 */
vi.mock('@minecraft/server', () => {
    return {
        world: {
            getAbsoluteTime: vi.fn(),
            getTimeOfDay: vi.fn(),
            getMoonPhase: vi.fn(),
            seed: 123456789,
        },
    };
});

describe('Calendar Mathematics', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Should calculate the correct date for day zero', () => {
        vi.mocked(world.getAbsoluteTime).mockReturnValue(0);

        const calendar = new Calendar();
        const date = calendar.getDate();

        expect(date.year).toBe(1000);
        expect(date.dayOfYear).toBe(0);
        expect(date.month).toBe(1);
        expect(date.day).toBe(1);
    });

    it('Should roll over to the next year correctly', () => {
        /**
         * 120 days * 24000 ticks = 2880000
         * This tick represents the exact start of Year 1001.
         */
        vi.mocked(world.getAbsoluteTime).mockReturnValue(2880000);

        const calendar = new Calendar();
        const date = calendar.getDate();

        expect(date.year).toBe(1001);
        expect(date.dayOfYear).toBe(0);
    });

    it('Should return the correct Solar Cycle and SubCycle', () => {
        /**
         * Day 35 (840000 ticks) is inside the Zenith cycle (days 30-59).
         * Since Zenith is 30 days long, day 5 of Zenith is SubCycle.Early (days 0-9).
         */
        vi.mocked(world.getAbsoluteTime).mockReturnValue(840000);

        const calendar = new Calendar();
        const phase = calendar.getSolarPhase(calendar.getDate().dayOfYear);

        expect(phase.cycle).toBe(SolarCycle.Zenith);
        expect(phase.subCycle).toBe(SubCycle.Early);
    });

    it('Should calculate the correct Villager Phase', () => {
        /**
         * For a 120-day year, each of the 6 phases lasts exactly 20 days.
         * Scarcity (0-19), Planting (20-39), Growth (40-59),
         * Harvest (60-79), Trade (80-99), Prosperity (100-119).
         * Day 75 (1800000 ticks) should perfectly fall into the Harvest phase.
         */
        vi.mocked(world.getAbsoluteTime).mockReturnValue(1800000);

        const calendar = new Calendar();
        const villagerPhase = calendar.getVillagerPhase(calendar.getDate().dayOfYear);

        expect(villagerPhase).toBe(VillagerPhase.Harvest);
    });
});

describe('Calendar Event Scheduler', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Should ignore events if conditions are not met', () => {
        vi.mocked(world.getAbsoluteTime).mockReturnValue(0);
        vi.mocked(world.getTimeOfDay).mockReturnValue(TimeOfDay.Sunrise);

        const calendar = new Calendar();
        const scheduler = new CalendarEventScheduler(calendar, [
            {
                id: 'test:winter_event',
                weight: 1.0,
                conditions: { solarCycle: SolarCycle.Nadir },
            },
        ]);

        const events = scheduler.pollEvents();
        expect(events.length).toBe(0);
    });

    it('Should ignore events if Villager Phase condition is not met', () => {
        /**
         * Day 30 (720000 ticks) is inside the Planting phase.
         */
        vi.mocked(world.getAbsoluteTime).mockReturnValue(720000);
        vi.mocked(world.getTimeOfDay).mockReturnValue(TimeOfDay.Sunrise);

        const calendar = new Calendar();
        const scheduler = new CalendarEventScheduler(calendar, [
            {
                id: 'test:trade_event',
                weight: 1.0,
                conditions: { villagerPhase: VillagerPhase.Trade },
            },
        ]);

        const events = scheduler.pollEvents();
        // Event expects Trade, but calendar is in Planting. Should be discarded.
        expect(events.length).toBe(0);
    });

    it('Should trigger events when time of day is reached', () => {
        vi.mocked(world.getAbsoluteTime).mockReturnValue(0);
        vi.mocked(world.getTimeOfDay).mockReturnValue(TimeOfDay.Midnight);

        const calendar = new Calendar();
        const scheduler = new CalendarEventScheduler(calendar, [
            {
                id: 'test:midnight_event',
                weight: 1.0,
                timeOfDay: TimeOfDay.Midnight,
            },
        ]);

        const events = scheduler.pollEvents();
        expect(events.length).toBe(1);
        expect(events[0].id).toBe('test:midnight_event');
    });

    it('Should discard expired events safely', () => {
        vi.mocked(world.getAbsoluteTime).mockReturnValue(0);
        /**
         * Simulates a scenario where a player sleeps or an admin changes time
         * skipping directly to Night, bypassing the Noon expiration.
         */
        vi.mocked(world.getTimeOfDay).mockReturnValue(TimeOfDay.Night);

        const calendar = new Calendar();
        const scheduler = new CalendarEventScheduler(calendar, [
            {
                id: 'test:morning_event',
                weight: 1.0,
                timeOfDay: TimeOfDay.Sunrise,
                expirationTime: TimeOfDay.Noon,
            },
        ]);

        const events = scheduler.pollEvents();
        expect(events.length).toBe(0);
    });
});
