// @flow

import loop from "./modules/loop"
import physics from "./modules/physics"
import players from "./modules/players"
import ships from "./modules/ships"

const reducers = {
  loop,
  physics,
  players,
  ships,
}

export default reducers

export type Reducers = typeof reducers