// @flow

require("dotenv").config()
require("source-map-support/register")

// Doesn't play nice with VS Code debugger
// require("remotedev-server")({ hostname: "0.0.0.0", port: 3000 })

// Necessary to kill remotedev-server
process.on("SIGUSR2", () => process.exit(0))

require("./server")