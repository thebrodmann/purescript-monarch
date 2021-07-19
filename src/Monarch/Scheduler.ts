/*
 * Maintainer : Mohammad Hasani (the-dr-lazy.github.io) <the-dr-lazy@pm.me>
 * Copyright  : (c) 2020-2021 Monarch
 * License    : MPL 2.0
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, version 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

interface State {
    deadline: number
}

export interface Scheduler {
    unsafe_shouldYieldToBrowser: Effect<boolean>
    unsafe_promoteDeadline: Effect<Unit>
}

export function mkScheduler(): Scheduler {
    const state: State = { deadline: 0 }

    return {
        unsafe_shouldYieldToBrowser: () => performance.now() > state.deadline,
        unsafe_promoteDeadline: () => (state.deadline = state.deadline + 5),
    }
}
