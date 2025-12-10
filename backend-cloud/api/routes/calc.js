const express = require("express")
const router = express.Router()
const controller = require("../controllers/calcController")

router.post("/run", controller.run)

module.exports = router
