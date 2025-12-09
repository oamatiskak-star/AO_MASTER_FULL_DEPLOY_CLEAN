const express = require("express")
const router = express.Router()

const projectRoutes = require("./projects")
const authRoutes = require("./auth")
const uploadRoutes = require("./uploads")
const moduleRoutes = require("./modules")
const systemRoutes = require("./system")

router.use("/projects", projectRoutes)
router.use("/auth", authRoutes)
router.use("/uploads", uploadRoutes)
router.use("/modules", moduleRoutes)
router.use("/system", systemRoutes)

module.exports = router

