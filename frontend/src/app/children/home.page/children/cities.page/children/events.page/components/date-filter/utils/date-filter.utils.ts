import { TuiDay } from '@taiga-ui/cdk';


/**
 * Maps an array of Date objects to TuiDay objects and sorts them in ascending order.
 * @param dates Array of Date objects to map and sort.
 * @returns Sorted array of TuiDay objects.
 */
export function mapAndSortDates(dates: Date[]): TuiDay[] {
    return (dates ?? [])
        .map(date => new TuiDay(date.getFullYear(), date.getMonth(), date.getDate()))
        .sort((a, b) => a.daySameOrBefore(b) ? -1 : 1);
}

/**
 * Returns a handler function that checks if a given TuiDay is present in the dates array and returns a marker if so.
 * @param dates Array of TuiDay objects to check against.
 * @param calendarDot Marker to return if the day matches.
 * @returns A function that takes a TuiDay and returns the marker or an empty array.
 */
export function getMarkerHandler(dates: TuiDay[], calendarDot: [string]): (day: TuiDay) => [string] | [] {
    return (day: TuiDay): [string] | [] => dates.some(d => d.daySame(day)) ? calendarDot : [];
}