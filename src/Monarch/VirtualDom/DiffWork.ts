/*
 * Maintainer : Mohammad Hasani (the-dr-lazy.github.io) <the-dr-lazy@pm.me>
 * Copyright  : (c) 2020-2021 Monarch
 * License    : MPL 2.0
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, version 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { VirtualDomTree, DownstreamNode, diff } from './VirtualDomTree'
import { PatchTree } from './PatchTree'
import { Scheduler } from '../Scheduler'

type Queue<a, b> = Array<{
    address: number[]
    patchTree: PatchTree
    downstreamNodes: DownstreamNode<a, b>[]
}>

interface State<a, b> {
    rootVNode: VirtualDomTree<b>
    rootPatchTree?: PatchTree.Root
    firstUpstreamPatchTree?: PatchTree
    address: PatchTree.Address
    queue: Queue<a, b>
}

export interface DiffWork<a, b> {
    node: DownstreamNode<a, b>
    state: State<a, b>
}

export function mkRootDiffWork<a, b>(x: VirtualDomTree<a>, y: VirtualDomTree<b>): DiffWork<a, b> {
    return {
        node: { x, y, ix: 0 },
        state: {
            rootVNode: y,
            address: [],
            queue: [],
        },
    }
}


export interface DiffWorkResult<message> {
    rootVNode: VirtualDomTree<message>
    rootPatchTree: PatchTree
}

export interface DiffWorkEnvironment<a, b> {
    unsafe_dispatchDiffWork(work: DiffWork<a, b>): void
    unsafe_finishDiffWork(result: DiffWorkResult<b>): void
    scheduler: Scheduler
}

/**
 * ToDo: document this function.
 */
export function unsafe_uncurried_performDiffWork<a, b>(
    work: DiffWork<a, b>,
    { scheduler, unsafe_finishDiffWork, unsafe_dispatchDiffWork }: DiffWorkEnvironment<a, b>,
): void {
    const { state } = work

    let node: DownstreamNode<a, b> | undefined = work.node

    scheduler.unsafe_promoteDeadline()

    while (node && !scheduler.unsafe_shouldYieldToBrowser()) {
        const { patches, downstreamNodes } = diff(node.x, node.y)

        let patchTree

        if (state.firstUpstreamPatchTree && node.ix !== undefined && patches.length !== 0) {
            state.firstUpstreamPatchTree.children = state.firstUpstreamPatchTree.children || []

            patchTree = { address: [...state.address, node.ix], patches }

            state.firstUpstreamPatchTree.children.push(patchTree)
        } else if (state.firstUpstreamPatchTree) {
            if (node.ix === undefined && patches.length !== 0) {
                Array.prototype.push.apply(state.firstUpstreamPatchTree.patches, patches)
            }

            patchTree = state.firstUpstreamPatchTree
        } else {
            state.rootPatchTree = {
                children: [{ address: [0], patches: patches.length !== 0 ? patches : undefined }],
            }

            patchTree = state.firstUpstreamPatchTree = state.rootPatchTree.children![0]
        }

        if (downstreamNodes && downstreamNodes.length !== 0) {
            state.queue.push({
                address: patches.length !== 0 || node.ix === undefined ? [] : [...state.address, node.ix],
                patchTree,
                downstreamNodes,
            })
        }

        node = state.queue[0]?.downstreamNodes.shift()

        if (node === undefined) {
            state.queue.shift()
            state.firstUpstreamPatchTree = state.queue[0]?.patchTree
            state.address = state.queue[0]?.address

            node = state.queue[0]?.downstreamNodes.shift()
        }
    }

    if (node) {
        unsafe_dispatchDiffWork({ node, state })

        return
    }

    unsafe_finishDiffWork(<DiffWorkResult<b>><unknown>work.state)
}
