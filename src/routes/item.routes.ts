import express from 'express'
import * as ItemController from '../controllers/item.controller'

const router = express.Router()

router.get("/", ItemController.getItems)
router.get("/:id", ItemController.getItem)
router.delete("/:id", ItemController.deleteItem)
router.post("/", ItemController.createItem)
router.patch("/:id", ItemController.updateItem)

export default router;