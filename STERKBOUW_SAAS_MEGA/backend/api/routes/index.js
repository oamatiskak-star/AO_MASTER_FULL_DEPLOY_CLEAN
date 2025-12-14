import express from "express"

import authRoutes from "./auth/index.js"
import calculatieRoutes from "./calculatie/index.js"
import projectenRoutes from "./projecten/index.js"
import risicoRoutes from "./risico/index.js"
import notificatieRoutes from "./notifications/index.js"
import usersRoutes from "./users/index.js"

const router = express.Router()

router.use("/auth", authRoutes)
router.use("/calculatie", calculatieRoutes)
router.use("/projecten", projectenRoutes)
router.use("/risico", risicoRoutes)
router.use("/notificaties", notificatieRoutes)
router.use("/users", usersRoutes)

export default router
