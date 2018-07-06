// @flow

import { createReduxModule } from "@subspace/redux-module"

import type { Body } from "../../../model"

type State = {
  byId: {
    [number]: Body,
  },
}

type AddBody = {
  type: "ADD_BODY",
  payload: {
    body: Body,
  },
}

type UpdateBody = {
  type: "UPDATE_BODY",
  payload: {
    body: Body,
  },
}

type RotateBody = {
  type: "ROTATE_BODY",
  payload: {
    bodyId: string,
    angle: number,
  },
}

type ApplySnapshot = {
  type: "APPLY_SNAPSHOT",
  payload: {
    frame: number,
    bodies: Body[],
  },
}

type Action = AddBody | UpdateBody | RotateBody | ApplySnapshot

export type { State as PhysicsState, Action as PhysicsAction }

const actionTypes = {
  ADD_BODY: "ADD_BODY",
  UPDATE_BODY: "UPDATE_BODY",
  ROTATE_BODY: "ROTATE_BODY",
  APPLY_SNAPSHOT: "APPLY_SNAPSHOT",
}

const actionCreators = {
  addBody(body: Body): AddBody {
    return {
      type: actionTypes.ADD_BODY,
      payload: {
        body,
      },
    }
  },
  rotateBody(bodyId: string, angle: number): RotateBody {
    return {
      type: actionTypes.ROTATE_BODY,
      payload: {
        bodyId,
        angle,
      },
    }
  },
  updateBody(body: Body): UpdateBody {
    return {
      type: actionTypes.UPDATE_BODY,
      payload: {
        body,
      },
    }
  },
  applySnapshot(frame: number, bodies: Body[]): ApplySnapshot {
    return {
      type: actionTypes.APPLY_SNAPSHOT,
      payload: {
        frame,
        bodies,
      },
    }
  },
}

function reducer(
  state: State = {
    byId: {},
  },
  action: Action,
): State {
  switch (action.type) {
    case actionTypes.ADD_BODY:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.body.id]: action.payload.body,
        },
      }
    case actionTypes.UPDATE_BODY:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.body.id]: {
            ...selectors.getBody(state, action.payload.body.id),
            ...action.payload.body,
          },
        },
      }
    default:
      return state
  }
}

const selectors = {
  getBody(state: State, id: string) {
    return state[id]
  },
}

export default createReduxModule("Physics", {
  actionTypes,
  actionCreators,
  reducer,
  selectors,
})