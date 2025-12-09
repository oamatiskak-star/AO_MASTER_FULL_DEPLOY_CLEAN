const express = require("express")
const router = express.Router()
const projectController = require("../controllers/projectController")

router.get("/", projectController.getAll)
router.post("/", projectController.create)
router.get("/:id", projectController.getOne)

module.exports = router

