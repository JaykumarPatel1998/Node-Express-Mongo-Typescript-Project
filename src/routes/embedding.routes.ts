import express from 'express'
import * as EmbeddingController from '../controllers/embedding.controller'
import { verifyToken } from '../middleware/authJwt'

const router = express.Router()

router.get("/",[verifyToken], EmbeddingController.vectorSearch)

export default router;