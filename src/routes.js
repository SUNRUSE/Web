const express = require("express")
module.exports = express.Router()

module.exports.get("/", (request, response) => response.send("Hello, world."))

