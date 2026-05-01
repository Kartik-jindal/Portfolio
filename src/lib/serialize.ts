/**
 * Shared serialize utility.
 * Converts Firestore Timestamp objects ({ seconds, nanoseconds }) to millisecond
 * numbers so data can be safely passed from Server Components to Client Components
 * as JSON-serializable props.
 *
 * Used by every public page that reads from Firestore server-side.
 */
export function serialize<T = any>(data: T): T {
    if (!data) return data;
    return JSON.parse(
        JSON.stringify(data, (_key, value) => {
            if (
                value &&
                typeof value === 'object' &&
                typeof value.seconds === 'number' &&
                typeof value.nanoseconds === 'number'
            ) {
                return new Date(value.seconds * 1000).getTime();
            }
            return value;
        }),
    );
}
