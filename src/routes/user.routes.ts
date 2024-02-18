import express from 'express'
import * as UserController from '../controllers/user.controller'
import { verifyToken } from '../middleware/authJwt'

const router = express.Router()

router.get("/messages",[verifyToken], UserController.getMessages)
router.get("/message/:messageId",[verifyToken], UserController.markMessage)

export default router;