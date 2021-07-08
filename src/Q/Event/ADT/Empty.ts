import { Tag, Sink } from '../../Event';
import { Scheduler } from '../../Scheduler';

/**
 * `Empty` type constructor
 */
export interface Empty extends Tagged<Tag.Empty> {
    subscribe<a>(scheduler: Scheduler,sink: Sink<a>): void
}

/**
 * `Empty` subscribe function
 */
function subscribe<a>(_scheduler: Scheduler, _sink: Sink<a>): void {
    // ToDo: call the `sink.end` at 0.
}

/**
 * `Empty` data constructor
 */
export const empty: Empty = {
    tag: Tag.Empty,
    subscribe
}
