// @flow

import type {
  ShipId,
  Ship,
  ShipState as CoreShipState,
} from "@subspace/core"
import {
  Ships as CoreShips,
  Players as CorePlayers,
  Protocol,
} from "@subspace/core"

import * as Clients from "../clients"
import * as Players from "../players"
import type { Dispatch, Middleware } from "../../types"

// Actions

export const SHIP_LOAD = "ships/load!"
export type ShipLoad = {
  type: "ships/load!",
  payload: {
    shipId: ShipId,
  },
}

export const SHIP_LOAD_FAILURE = "ships/load_failure"
export type ShipLoadFailure = {
  type: "ships/load_failure",
  payload: {
    shipId: ShipId,
    err: Error,
  },
}

export const SHIP_LOAD_SUCCESS = "ships/load_success"
export type ShipLoadSuccess = {
  type: "ships/load_success",
  payload: {
    ship: Ship,
  },
}

export type ShipAction = ShipLoad | ShipLoadFailure | ShipLoadSuccess

// Action creators

export const loadShip = (shipId: ShipId) => ({
  type: SHIP_LOAD,
  payload: {
    shipId,
  },
})

export const loadShipFailure = (shipId: ShipId, err: Error) => ({
  type: SHIP_LOAD_FAILURE,
  payload: {
    shipId,
    err,
  },
})

export const loadShipSuccess = (ship: Ship) => ({
  type: SHIP_LOAD_SUCCESS,
  payload: {
    ship,
  },
})

// Reducer

type ShipState = CoreShipState

export default CoreShips.default

// Middleware

export const createMiddleware = (db: any): Middleware => {
  return store => next => action => {
    switch (action.type) {
      case SHIP_LOAD: {
        const { shipId } = action.payload
        // Hydrate a player from db and create entities if they don't exist
        // (e.g. player ship)
        db
          .getShip(shipId)
          .then(ship => {
            next(loadShipSuccess(ship))
            next(CoreShips.addShip(ship))
          })
          .catch(err => next(loadShipFailure(shipId, err)))
        break
      }
      case CoreShips.SHIP_ADD:
      case CoreShips.SHIP_UPDATE: {
        const { clients, players } = store.getState()
        const { ship } = action.payload
        const player = CorePlayers.getPlayerByActiveShipId(
          players,
          ship.id,
        )

        if (!player) {
          break
        }

        const client = Clients.getClientByPlayerId(clients, player.id)
        const message = Protocol.shipUpdateMessage(ship)

        // Send updated player state to client
        store.dispatch(Clients.sendClient(client.id, message))

        break
      }
      default:
        break
    }

    return next(action)
  }
}