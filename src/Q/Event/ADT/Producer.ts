import { Tag, Subscribable } from '../../Event'

/**
 * `Producer` type constructor
 */
export interface Producer<e, a> extends Tagged<Tag.Producer>, Subscribable<e, a> {}

/**
 * `Producer` smart data constructor
 */
export function mk<e, a>(subscribe: Producer<e, a>['subscribe']): Producer<e, a> {
    return { tag: Tag.Producer, subscribe }
}
