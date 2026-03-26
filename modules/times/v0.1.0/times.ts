/**
 * Utility class for representing and converting Minecraft time units.
 *
 * In Minecraft:
 * - 1 real-world second = 20 ticks
 * - 1 in-game hour = 1000 ticks
 * - 1 in-game day = 24000 ticks
 *
 * This class provides helpers to convert common time units into ticks.
 */
export class Times {
    /** Number of ticks in one Minecraft hour. */
    private static hour = 1000;

    /** Number of ticks in one Minecraft day (24 hours). */
    private static day = this.hour * 24;

    /** Number of ticks in one Minecraft month (30 days). */
    private static month = this.day * 30;

    /** Number of ticks in one Minecraft year (12 months). */
    private static year = this.month * 12;

    /** Number of ticks in a short Minecraft year (4 months). */
    private static shortYear = this.month * 4;

    /**
     * Converts Minecraft hours to ticks.
     *
     * @param t - Number of hours (default is 1)
     * @returns Equivalent time in ticks
     *
     * @example
     * Times.hours(3) // 3000 ticks
     */
    public static hours(t: number = 1): number {
        return this.hour * t;
    }

    /**
     * Converts Minecraft days to ticks.
     *
     * @param t - Number of days (default is 1)
     * @returns Equivalent time in ticks
     *
     * @example
     * Times.days(2) // 48000 ticks
     */
    public static days(t: number = 1): number {
        return this.day * t;
    }

    /**
     * Converts Minecraft months to ticks.
     *
     * A month is defined as 30 in-game days.
     *
     * @param t - Number of months (default is 1)
     * @returns Equivalent time in ticks
     *
     * @example
     * Times.months(1) // 720000 ticks
     */
    public static months(t: number = 1): number {
        return this.month * t;
    }

    /**
     * Converts Minecraft years to ticks.
     *
     * A year is defined as 12 in-game months.
     *
     * @param t - Number of years (default is 1)
     * @returns Equivalent time in ticks
     *
     * @example
     * Times.years(1) // 8640000 ticks
     */
    public static years(t: number = 1): number {
        return this.year * t;
    }

    /**
     * Converts short Minecraft years to ticks.
     *
     * A short year is defined as 4 in-game months.
     *
     * @param t - Number of short years (default is 1)
     * @returns Equivalent time in ticks
     *
     * @example
     * Times.shortYears(1) // 2880000 ticks
     */
    public static shortYears(t: number = 1): number {
        return this.shortYear * t;
    }
}
