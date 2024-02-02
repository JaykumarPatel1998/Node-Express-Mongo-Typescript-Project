import express from 'express'
import * as ItemController from '../controllers/item.controller'
import { verifyToken } from '../middleware/authJwt'

const router = express.Router()

router.get("/",[verifyToken], ItemController.getItems)
router.get("/:id",[verifyToken], ItemController.getItem)
router.delete("/:id",[verifyToken], ItemController.deleteItem)
router.post("/",[verifyToken], ItemController.createItem)
router.patch("/:id",[verifyToken], ItemController.updateItem)

export default router;