const express = require("express")
const app = express()
app.get("/", (request, response) => response.send("Hello, world."))
app.listen(80, () => console.log("Started."))