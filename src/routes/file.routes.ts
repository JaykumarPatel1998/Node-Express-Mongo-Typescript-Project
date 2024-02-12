import express from 'express'
import * as FileController from '../controllers/file.controller'
import { verifyToken } from '../middleware/authJwt'
import upload from '../fileUtils/upload'

const router = express.Router()

router.get("/",[verifyToken], FileController.getFiles)
router.post("/",[verifyToken, upload.single("file")], FileController.uploadFile)
router.delete("/:fileId",[verifyToken], FileController.deleteFromStorageandDB)
router.post("/:fileId",[verifyToken], FileController.shareFile)

export default router;