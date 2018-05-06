const express = require("express")
const app = express()
app.use("/", require("./routes"))
app.listen(80, () => console.log("Started."))