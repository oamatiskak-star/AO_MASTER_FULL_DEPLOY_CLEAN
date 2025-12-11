const express = require("express")
const router = express.Router()
const multer = require("multer")
const controller = require("../controllers/uploadsController")

const upload = multer({ dest: "/tmp" })

router.post("/", upload.single("file"), controller.upload)

module.exports = router
