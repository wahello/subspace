// @flow

import type { ActionObservable } from "redux-observable"
// $FlowFixMe
import { interval } from "rxjs"
import { switchMap, map } from "rxjs/operators"
import { ofType } from "redux-observable"

import type { Action } from "../../../types"
import { Loop } from "../../modules"

export function loop(action$: ActionObservable<Action>) {
  return action$.pipe(
    ofType(Loop.START),
    switchMap(() => interval(1 / 60)),
    map(Loop.tick),
    // takeUntil(action$.pipe(ofType(Loop.PAUSE))),
  )
}

export default [loop]
