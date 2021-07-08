import { Tag, Event, Subscribable, Sink, Wirable, Unsubscribe } from '../../Event'
import { Scheduler } from '../../Scheduler'

/**
 * `FunctorMapTo` type constructor
 */
export interface FunctorMapTo<e, b> extends Tagged<Tag.FunctorMapTo>, Subscribable<e, b> {
    source: Wirable<e, any>
    value: b
}

/**
 * `FunctorMapTo` subscribe function
 */
function subscribe<e, b>(this: FunctorMapTo<e, b>, scheduler: Scheduler, sink: Sink<e, b>): Unsubscribe {
    return this.source.subscribe(scheduler, {
        next: sink.next && (t => sink.next!(t, this.value)),
        error: sink.error,
        end: sink.end
    })
}

/**
 * `FunctorMapTo` smart data constructor
 */
export function mk<e, a, b>(value: b, source: Event<e, a>): Event<e, b> {
    switch (source.tag) {
        // Note [Plus Annihilation Axiom]
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // f <$> empty = empty
        case Tag.Empty:
        case Tag.Never:
            return source

        // Note [Functor Composition Axiom]
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // map f . map g = map (f . g)
        //
        // This is an inlined derivation of the functor composition
        // axiom for two special cases:
        // map (const x) . map f = map (const x . f)
        //                       = map (const x)
        //
        case Tag.FunctorMap:
        // map (const x) . map (const y) = map (const x . const y)
        //                               = map (const x)
        case Tag.FunctorMapTo:
            source = source.source
            break
    }

    return { tag: Tag.FunctorMapTo, source, value, subscribe }
}
