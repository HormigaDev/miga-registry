import { MoonPhase, world } from '@minecraft/server';

/**
 * Standard Minecraft ticks representing one full day.
 */
const TICKS_PER_DAY = 24000;

/**
 * Notable semantic moments of the day in ticks.
 */
export enum TimeOfDay {
    Sunrise = 0,
    Day = 1000,
    Noon = 6000,
    Sunset = 12000,
    Night = 13000,
    Midnight = 18000,
}

/**
 * Human astronomical solar cycle.
 * Replaces climatic seasons to maintain vanilla biome integrity.
 */
export enum SolarCycle {
    Ascendant = 0,
    Zenith = 1,
    Descendant = 2,
    Nadir = 3,
}

/**
 * Subdivision of each cycle.
 */
export enum SubCycle {
    Early = 0,
    Mid = 1,
    Late = 2,
}

/**
 * Villager economic cycle.
 */
export enum VillagerPhase {
    Scarcity = 0,
    Planting = 1,
    Growth = 2,
    Harvest = 3,
    Trade = 4,
    Prosperity = 5,
}

/**
 * Parsed calendar date.
 */
export interface CalendarDate {
    year: number;
    month: number;
    day: number;
    dayOfYear: number;
}

/**
 * Human astronomical phase.
 */
export interface SolarPhase {
    cycle: SolarCycle;
    subCycle: SubCycle;
}

/**
 * Cultural interpretations of time.
 */
export interface CalendarPhases {
    solar: SolarPhase;
    villager: VillagerPhase;
    moon: MoonPhase;
}

/**
 * Calendar configuration.
 */
export interface CalendarOptions {
    /**
     * Days per month.
     */
    daysPerMonth: number;

    /**
     * Months per year.
     */
    monthsPerYear: number;

    /**
     * First year of the Post Corruptionem era.
     */
    startYear: number;
}

const DEFAULT_CALENDAR_OPTIONS: CalendarOptions = {
    daysPerMonth: 30,
    monthsPerYear: 4,
    startYear: 1000,
};

/**
 * Post Corruptionem deterministic calendar.
 *
 * All cycles are derived from the year length to avoid
 * invalid configurations.
 */
export class Calendar {
    private readonly daysPerYear: number;
    private readonly daysPerSolarCycle: number;
    private readonly daysPerSubCycle: number;
    private readonly daysPerVillagerPhase: number;

    constructor(private readonly options: CalendarOptions = DEFAULT_CALENDAR_OPTIONS) {
        this.daysPerYear = options.daysPerMonth * options.monthsPerYear;
        this.daysPerSolarCycle = Math.floor(this.daysPerYear / 4);
        this.daysPerSubCycle = Math.floor(this.daysPerSolarCycle / 3);
        this.daysPerVillagerPhase = Math.floor(this.daysPerYear / 6);
    }

    /**
     * Absolute world time in ticks.
     */
    getAbsoluteTicks(): number {
        return world.getAbsoluteTime();
    }

    /**
     * Total elapsed days.
     */
    getTotalDays(): number {
        return Math.floor(this.getAbsoluteTicks() / TICKS_PER_DAY);
    }

    /**
     * Current calendar date.
     */
    getDate(): CalendarDate {
        const totalDays = this.getTotalDays();
        const year = this.options.startYear + Math.floor(totalDays / this.daysPerYear);
        const dayOfYear = totalDays % this.daysPerYear;
        const month = Math.floor(dayOfYear / this.options.daysPerMonth) + 1;
        const day = (dayOfYear % this.options.daysPerMonth) + 1;

        return { year, month, day, dayOfYear };
    }

    public get year(): number {
        return this.getDate().year;
    }

    public get month(): number {
        return this.getDate().month;
    }

    public get day(): number {
        return this.getDate().day;
    }

    public get dayOfYear(): number {
        return this.getDate().dayOfYear;
    }

    /**
     * Human solar cycle and sub-cycle.
     */
    getSolarPhase(dayOfYear: number): SolarPhase {
        const cycle = Math.floor(dayOfYear / this.daysPerSolarCycle) % 4;
        const dayInCycle = dayOfYear % this.daysPerSolarCycle;
        const subCycle = Math.min(2, Math.floor(dayInCycle / this.daysPerSubCycle));

        return {
            cycle: cycle as SolarCycle,
            subCycle: subCycle as SubCycle,
        };
    }

    /**
     * Villager economic phase.
     */
    getVillagerPhase(dayOfYear: number): VillagerPhase {
        return (Math.floor(dayOfYear / this.daysPerVillagerPhase) % 6) as VillagerPhase;
    }

    /**
     * Illager lunar phase.
     */
    getMoonPhase(): MoonPhase {
        return world.getMoonPhase();
    }

    /**
     * Return all cultural interpretations.
     */
    getPhases(): CalendarPhases {
        const { dayOfYear } = this.getDate();

        return {
            solar: this.getSolarPhase(dayOfYear),
            villager: this.getVillagerPhase(dayOfYear),
            moon: this.getMoonPhase(),
        };
    }
}

/**
 * Optional conditions required for an event to be evaluated.
 */
export interface CalendarEventConditions {
    /**
     * Minimum day of the year.
     */
    minDay?: number;

    /**
     * Maximum day of the year.
     */
    maxDay?: number;

    /**
     * Required lunar phase.
     */
    moonPhase?: MoonPhase;

    /**
     * Required villager economic phase.
     */
    villagerPhase?: VillagerPhase;

    /**
     * Required astronomical solar cycle.
     */
    solarCycle?: SolarCycle;

    /**
     * Required subdivision of the solar cycle.
     */
    subCycle?: SubCycle;
}

/**
 * Definition of a calendar event.
 */
export interface CalendarEventDefinition {
    /**
     * Unique event identifier.
     */
    id: string;

    /**
     * Probability weight between 0.0 and 1.0.
     */
    weight: number;

    /**
     * Expected execution time. Defaults to Sunrise (0) if not provided.
     */
    timeOfDay?: TimeOfDay | number;

    /**
     * Maximum absolute tick of the day to evaluate.
     * If the time is skipped past this point, the event is safely discarded.
     */
    expirationTime?: TimeOfDay | number;

    /**
     * Environmental and temporal requirements for the event.
     */
    conditions?: CalendarEventConditions;
}

/**
 * A resolved event that has successfully passed all conditions and probability.
 */
export interface ScheduledCalendarEvent {
    id: string;
    year: number;
    dayOfYear: number;
    timeOfDay: number;
    expirationTime?: number;
}

/**
 * An enriched event representation containing cultural and astronomical context,
 * ideal for bulk queries like monthly or yearly almanacs.
 */
export interface EnrichedCalendarEvent {
    id: string;
    day: number;
    dayOfYear: number;
    month: number;
    timeOfDay: number;
    solarCycle: SolarCycle;
    villagerPhase: VillagerPhase;
}

/**
 * Deterministic pseudo-random number generator.
 */
export class SeededRandom {
    constructor(private seed: number) {}

    /**
     * Generates the next floating point number between 0.0 and 1.0.
     */
    next(): number {
        let t = (this.seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    /**
     * Generates the next integer up to the specified maximum.
     */
    nextInt(max: number): number {
        return Math.floor(this.next() * max);
    }
}

/**
 * Deterministic scheduler for chronological events.
 */
export class CalendarEventScheduler {
    private lastCheckedDay = -1;
    private pendingEvents: ScheduledCalendarEvent[] = [];
    private readonly seed: number = +world.seed;

    constructor(
        private readonly calendar: Calendar,
        private readonly events: CalendarEventDefinition[],
    ) {}

    /**
     * Retrieves events scheduled for the current tick of the day.
     * Events are safely popped from the queue or discarded if expired.
     */
    public pollEvents(): ScheduledCalendarEvent[] {
        const date = this.calendar.getDate();
        const currentTick = world.getTimeOfDay();

        if (date.dayOfYear !== this.lastCheckedDay) {
            this.lastCheckedDay = date.dayOfYear;
            this.pendingEvents = this.computeEventsForDay(date);
        }

        const readyEvents: ScheduledCalendarEvent[] = [];
        const remainingEvents: ScheduledCalendarEvent[] = [];

        for (const event of this.pendingEvents) {
            if (event.expirationTime !== undefined && currentTick > event.expirationTime) {
                continue;
            }

            if (currentTick >= event.timeOfDay) {
                readyEvents.push(event);
            } else {
                remainingEvents.push(event);
            }
        }

        this.pendingEvents = remainingEvents;

        return readyEvents;
    }

    /**
     * Returns a list of all events scheduled for today,
     * without consuming them or affecting actual execution. Ideal for the Almanac.
     */
    public getTodaysEvents(): ScheduledCalendarEvent[] {
        const today = this.calendar.getDate();
        return this.computeEventsForDay(today);
    }

    /**
     * Retrieves scheduled events for a specific arbitrary day.
     */
    public getEventsForDay(year: number, dayOfYear: number): ScheduledCalendarEvent[] {
        const rng = new SeededRandom(this.seed ^ year ^ dayOfYear);
        const result: ScheduledCalendarEvent[] = [];
        const phases = this.getPhasesFor(year, dayOfYear);

        for (const def of this.events) {
            if (this.evaluateConditions(def.conditions, dayOfYear, phases)) {
                if (rng.next() < def.weight) {
                    result.push({
                        id: def.id,
                        year: year,
                        dayOfYear: dayOfYear,
                        timeOfDay: def.timeOfDay ?? TimeOfDay.Sunrise,
                        expirationTime: def.expirationTime,
                    });
                }
            }
        }

        return result;
    }

    /**
     * Retrieves an enriched list of all scheduled events for a specific month.
     */
    public getEventsForMonth(year: number, month: number): EnrichedCalendarEvent[] {
        const options = (this.calendar as any).options as CalendarOptions;
        const result: EnrichedCalendarEvent[] = [];

        const startDayOfYear = (month - 1) * options.daysPerMonth;
        const endDayOfYear = startDayOfYear + options.daysPerMonth - 1;

        for (let dayOfYear = startDayOfYear; dayOfYear <= endDayOfYear; dayOfYear++) {
            const dayEvents = this.getEventsForDay(year, dayOfYear);
            const phases = this.getPhasesFor(year, dayOfYear);
            const dayOfMonth = (dayOfYear % options.daysPerMonth) + 1;

            for (const event of dayEvents) {
                result.push({
                    id: event.id,
                    day: dayOfMonth,
                    dayOfYear: dayOfYear,
                    month: month,
                    timeOfDay: event.timeOfDay,
                    solarCycle: phases.solar.cycle,
                    villagerPhase: phases.villager,
                });
            }
        }

        return result;
    }

    /**
     * Retrieves an enriched list of all scheduled events for an entire year.
     */
    public getEventsForYear(year: number): EnrichedCalendarEvent[] {
        const options = (this.calendar as any).options as CalendarOptions;
        const daysPerYear = options.daysPerMonth * options.monthsPerYear;
        const result: EnrichedCalendarEvent[] = [];

        for (let dayOfYear = 0; dayOfYear < daysPerYear; dayOfYear++) {
            const dayEvents = this.getEventsForDay(year, dayOfYear);
            const phases = this.getPhasesFor(year, dayOfYear);
            const month = Math.floor(dayOfYear / options.daysPerMonth) + 1;
            const dayOfMonth = (dayOfYear % options.daysPerMonth) + 1;

            for (const event of dayEvents) {
                result.push({
                    id: event.id,
                    day: dayOfMonth,
                    dayOfYear: dayOfYear,
                    month: month,
                    timeOfDay: event.timeOfDay,
                    solarCycle: phases.solar.cycle,
                    villagerPhase: phases.villager,
                });
            }
        }

        return result;
    }

    /**
     * Computes the astronomical and cultural phases for an arbitrary day.
     * Required for deterministic prediction of future or past events.
     */
    private getPhasesFor(year: number, dayOfYear: number): CalendarPhases {
        const options = (this.calendar as any).options as CalendarOptions;
        const daysPerYear = options.daysPerMonth * options.monthsPerYear;
        const totalDays = (year - options.startYear) * daysPerYear + dayOfYear;

        return {
            solar: this.calendar.getSolarPhase(dayOfYear),
            villager: this.calendar.getVillagerPhase(dayOfYear),
            moon: totalDays % 8,
        };
    }

    /**
     * Verifies if the current calendar state meets the event conditions.
     */
    private evaluateConditions(
        conditions: CalendarEventConditions | undefined,
        dayOfYear: number,
        phases: CalendarPhases,
    ): boolean {
        if (!conditions) {
            return true;
        }

        if (conditions.minDay !== undefined && dayOfYear < conditions.minDay) {
            return false;
        }
        if (conditions.maxDay !== undefined && dayOfYear > conditions.maxDay) {
            return false;
        }
        if (conditions.solarCycle !== undefined && phases.solar.cycle !== conditions.solarCycle) {
            return false;
        }
        if (conditions.subCycle !== undefined && phases.solar.subCycle !== conditions.subCycle) {
            return false;
        }
        if (
            conditions.villagerPhase !== undefined &&
            phases.villager !== conditions.villagerPhase
        ) {
            return false;
        }
        if (conditions.moonPhase !== undefined && phases.moon !== conditions.moonPhase) {
            return false;
        }

        return true;
    }

    /**
     * Deterministically computes all scheduled events for a given day.
     */
    private computeEventsForDay(date: CalendarDate): ScheduledCalendarEvent[] {
        const rng = new SeededRandom(this.seed ^ date.year ^ date.dayOfYear);
        const result: ScheduledCalendarEvent[] = [];
        const phases = this.calendar.getPhases();

        for (const def of this.events) {
            if (this.evaluateConditions(def.conditions, date.dayOfYear, phases)) {
                if (rng.next() < def.weight) {
                    result.push({
                        id: def.id,
                        year: date.year,
                        dayOfYear: date.dayOfYear,
                        timeOfDay: def.timeOfDay ?? TimeOfDay.Sunrise,
                        expirationTime: def.expirationTime,
                    });
                }
            }
        }

        return result;
    }
}
