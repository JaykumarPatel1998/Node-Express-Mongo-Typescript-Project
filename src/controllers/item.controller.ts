import { RequestHandler } from "express"
import Item from "../models/item"

export const getItems: RequestHandler = async (req, res, next) => {
    try {
        const notes = await Item.find().exec()
        res.status(200).json(notes)
    } catch (error) {
        next(error)
    }
}