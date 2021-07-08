import { Subscribable, Wirable, Event, Tag, Sink, Unsubscribe } from '../../Event'
import { Scheduler } from '../../Scheduler'

/**
 * `FilterMap` type constructor
 */
export interface FilterMap<e, a, b> extends Tagged<Tag.FilterMap>, Subscribable<e, b> {
    source: Wirable<e, a>
    p: (a: a) => boolean
    f: (a: a) => b
}

/**
 * `FilterMap` subscribe function
 */
function subscribe<e, a, b>(this: FilterMap<e, a, b>, scheduler: Scheduler, sink: Sink<e, b>): Unsubscribe {
    return this.source.subscribe(scheduler, {
        next: sink.next && ((t, a) => this.p(a) && sink.next!(t, this.f(a))),
        error: sink.error,
        end: sink.end
    })
}

/**
 * `FilterMap` smart data constructor
 */
export function mk<e, a, b>(p: FilterMap<e, a, b>['p'], f: FilterMap<e, a, b>['f'], source: Event<e, a>): Event<e, b> {
    // Note [Plus Annihilation Axiom]
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // f <$> empty = empty
    if (source.tag === Tag.Empty || source.tag === Tag.Never) return source

    return { tag: Tag.FilterMap, p, f, source, subscribe }
}
