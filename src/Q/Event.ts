import * as ADT from './Event/ADT'
import { Time, Scheduler } from './Scheduler'

/**
 * Disjoint union tags for `Event` type
 */
export const enum Tag {
    Empty,
    Filter,
    FilterMap,
    FunctorMap,
    FunctorMapTo,
    Never,
    Producer,
}

/**
 * Event ADT
 */
export type Event<e, a> =
    | ADT.Empty
    | ADT.Filter<e, a>
    | ADT.FilterMap<e, any, a>
    | ADT.FunctorMap<e, any, a>
    | ADT.FunctorMapTo<e, a>
    | ADT.Never
    | ADT.Producer<e, a>

export type Wirable<e, a> = Exclude<Event<e, a>, ADT.Empty | ADT.Never>

export interface Subscribable<e, a> {
    subscribe(scheduler: Scheduler, sink: Sink<e, a>): Unsubscribe
}

export interface Sink<e, a> {
    next?(t: Time, a: a): void
    error?(t: Time, error: e): void
    end?(t: Time): void
}

export type Unsubscribe = Effect<Unit>
