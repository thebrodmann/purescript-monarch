export type Time = number
export type Delay = number
export type Period = number
export type Offset = number

export interface Scheduler {
    now: Effect<Time>
    schedule(work: Effect<Unit>): void
}
