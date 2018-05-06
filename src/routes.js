const express = require("express")
const path = require("path")
module.exports = express.Router()

module.exports.use(express.static(path.resolve(__dirname, "static")))

