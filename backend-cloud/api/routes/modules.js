const express = require("express")
const router = express.Router()
const moduleController = require("../controllers/moduleController")

router.get("/list", moduleController.list)
router.post("/run", moduleController.run)

module.exports = router

