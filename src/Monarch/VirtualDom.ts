/*
 * Maintainer : Mohammad Hasani (the-dr-lazy.github.io) <the-dr-lazy@pm.me>
 * Copyright  : (c) 2020-2021 Monarch
 * License    : MPL 2.0
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, version 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import 'setimmediate'
import { VirtualDomTree, realize } from 'monarch/Monarch/VirtualDom/VirtualDomTree'
import { OutputHandlersList } from 'monarch/Monarch/VirtualDom/OutputHandlersList'

export function unsafe_uncurried_mount<a>(domNode: Node, outputHandlers: OutputHandlersList.Nil, vNode: VirtualDomTree<a>): void {
    while (domNode.firstChild) {
        domNode.removeChild(domNode.lastChild!)
    }

    domNode.appendChild(realize(vNode, outputHandlers))
}

/**
 * ToDo: should be implemented.
 */
function unsafe_uncurried_unmount<message>(domNode: Node, virtualDomTree: VirtualDomTree<message>): void { }
