import express from 'express'
import * as ItemController from '../controllers/item.controller'

const router = express.Router()

router.get("/", ItemController.getItems)

export default router;