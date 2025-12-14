import express from "express"

import ping from "./ping.js"
import projecten from "./projecten.js"
import calculatie from "./calculatie.js"
import risico from "./risico.js"
import bim from "./bim.js"
import constructeurs from "./constructeurs.js"
import kopersportaal from "./kopersportaal.js"
import admin from "./admin.js"

const router = express.Router()

router.use("/ping", ping)
router.use("/projecten", projecten)
router.use("/calculatie", calculatie)
router.use("/risico", risico)
router.use("/bim", bim)
router.use("/constructeurs", constructeurs)
router.use("/kopersportaal", kopersportaal)
router.use("/admin", admin)

export default router
