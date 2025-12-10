const express = require("express")
const router = express.Router()

router.use("/projects", require("./projects"))
router.use("/calc", require("./calc"))
router.use("/modules", require("./modules"))
router.use("/uploads", require("./uploads"))
router.use("/juridisch", require("./juridisch"))

module.exports = router
