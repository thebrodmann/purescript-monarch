import * as OutputHandlersList from 'monarch/Monarch/VirtualDom/OutputHandlersList'
import { VirtualDomTree } from 'monarch/Monarch/VirtualDom/VirtualDomTree'
import { PatchTree, unsafe_uncurried_applyPatchTree } from 'monarch/Monarch/VirtualDom/PatchTree'
import { DiffWork, unsafe_uncurried_mount, mkDiffWork, unsafe_uncurried_performDiffWork } from 'monarch/Monarch/VirtualDom'
import { mkScheduler } from 'monarch/Monarch/Scheduler'
import { asap } from 'asap/browser-asap'
import 'setimmediate'

interface Spec<input, model, message> {
    init(input: input): model
    input: input
    update(message: message): (model: model) => model
    container: HTMLElement
    view(model: model): VirtualDomTree<message>
}

interface FinishDiffWorkSpec<message> {
    rootVNode: VirtualDomTree<message>
    rootPathTree: PatchTree
}

export function document<input, model, message>({ init, input, update, container, view }: Spec<input, model, message>) {
    const initialModel = init(input)
    const initialVirtualDomTree = view(initialModel)
    const outputHandlers = OutputHandlersList.nil(dispatchMessage)
    const scheduler = mkScheduler()
    const environment = { scheduler, dispatchDiffWork, finishDiffWork }

    let model = initialModel
    let commitedVirtualDomTree = initialVirtualDomTree
    let diffWork: DiffWork<any, any> | undefined = undefined

    let requestedAsyncRenderId: number | undefined = undefined
    let requestedAsyncPerformDiffWorkId: number | undefined = undefined

    function dispatchMessage(message: message): void {
        const previousModel = model
        const nextModel = update(message)(model)

        if (previousModel === nextModel) return

        model = nextModel

        if (!requestedAsyncRenderId) {
            requestedAsyncRenderId = requestAsap(render)
        }
    }

    function render() {
        const nextVirtualDomTree = view(model)
        const initialDiffWork = mkDiffWork(commitedVirtualDomTree)(nextVirtualDomTree)

        requestedAsyncRenderId = undefined

        dispatchDiffWork(initialDiffWork)
    }

    function dispatchDiffWork(nextDiffWork: DiffWork<any, any>): void {
        diffWork = nextDiffWork

        if (!requestedAsyncPerformDiffWorkId) {
            requestedAsyncPerformDiffWorkId = window.setImmediate(() => {
                unsafe_uncurried_performDiffWork(diffWork!, environment)
            })
        }
    }

    function finishDiffWork({ rootVNode, rootPathTree }: FinishDiffWorkSpec<message>): void {
        commitedVirtualDomTree = rootVNode
        requestedAsyncPerformDiffWorkId = undefined

        requestAnimationFrame(() => {
            unsafe_uncurried_applyPatchTree(container, rootPathTree)
        })
    }

    requestAnimationFrame(() => {
        unsafe_uncurried_mount(container, outputHandlers, initialVirtualDomTree)
    })
}

function requestAsap(task: () => void) {
    asap(task)
    return 1
}