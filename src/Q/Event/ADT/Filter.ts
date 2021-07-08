import { Subscribable, Wirable, Event, Tag, Sink, Unsubscribe } from '../../Event'
import { Scheduler } from '../../Scheduler'

/**
 * `Filter` type constructor
 */
export interface Filter<e, a> extends Tagged<Tag.Filter>, Subscribable<e, a> {
    source: Wirable<e, a>
    p: (a: a) => boolean
}

/**
 * `Filter` subscribe function
 */
function subscribe<e, a>(this: Filter<e, a>, scheduler: Scheduler, sink: Sink<e, a>): Unsubscribe {
    return this.source.subscribe(scheduler, {
        next: sink.next && ((t, a) => this.p(a) && sink.next!(t, a)),
        error: sink.error,
        end: sink.end
    })
}

/**
 * `Filter` smart data constructor
 */
export function mk<e, a>(p: Filter<e, a>['p'], source: Event<e, a>): Event<e, a> {
    switch (source.tag) {
        // Note [Plus Annihilation Axiom]
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // f <$> empty = empty
        case Tag.Empty:
        case Tag.Never: return source

        // ToDo: explain the axiom
        case Tag.Filter: return mk(a => source.p(a) && p(a), source.source)
    }

    return { tag: Tag.Filter, p, source, subscribe }
}
