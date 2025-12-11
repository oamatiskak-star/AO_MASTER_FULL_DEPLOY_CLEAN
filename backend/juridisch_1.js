const express = require("express")
const router = express.Router()
const controller = require("../controllers/juridischController")

router.post("/analyse", controller.analyse)

module.exports = router
