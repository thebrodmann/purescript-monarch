import { Tag } from '../../Event'

/**
 * `Never` type constructor
 */
export interface Never extends Tagged<Tag.Never> { }

/**
 * `Never` data constructor
 */
export const never: Never = { tag: Tag.Never }
