import { RequestHandler } from "express"
import Item from "../models/item"
import createHttpError from "http-errors"
import mongoose from "mongoose"

export const getItems: RequestHandler = async (req, res, next) => {
    try {
        const notes = await Item.find().exec()
        res.status(200).json(notes)
    } catch (error) {
        next(error)
    }
}

export const getItem: RequestHandler = async (req, res, next) => {
    const id = req.params.id
    try {
        if (!mongoose.isValidObjectId(id)) {
            throw createHttpError(400, "Invalid id: " + id)
        }
        const item = await Item.findById(id).exec()

        if(!item) {
            throw createHttpError(404, "Item not found")
        }
        res.status(200).json(item)
    } catch (error) {
        next(error)
    }
}

interface CreateItemBody {
    title? : string,
    description? : string
}

export const createItem: RequestHandler<unknown, unknown, CreateItemBody, unknown> = async (req, res, next) => {
    const itemToBeSaved = {
        title : req.body.title,
        description : req.body.description
    }

    try {
        if (!itemToBeSaved.title) {
            throw createHttpError(400, "title cannot be empty")
        }
        const newItem = await Item.create(itemToBeSaved)
        res.status(201).json(newItem)
    } catch (error) {
        next(error)
    }
}

interface UpdateItemParams {
    id : string
}

interface UpdateItemBody {
    title? : string,
    description? : string
}

export const updateItem: RequestHandler<UpdateItemParams, unknown, UpdateItemBody, unknown> = async (req, res, next) => {
    const id = req.params.id
    const itemToBeUpdated = {
        title : req.body.title,
        description : req.body.description
    }

    try {
        if (!mongoose.isValidObjectId(id)) {
            throw createHttpError(400, "Invalid id: " + id)
        }

        if (!itemToBeUpdated.title) {
            throw createHttpError(400, "title cannot be empty")
        }

        const item = await Item.findById(id).exec()

        if(!item) {
            throw createHttpError(404, "Item not found")
        }

        item.title = itemToBeUpdated.title
        item.description = itemToBeUpdated.description
        
        const newItem = await item.save()
        res.status(200).json(newItem)
    } catch (error) {
        next(error)
    }
}

export const deleteItem: RequestHandler = async (req, res, next) => {
    const id = req.params.id
    try {
        if (!mongoose.isValidObjectId(id)) {
            throw createHttpError(400, "Invalid id: " + id)
        }
        const item = await Item.findById(id).exec()

        if(!item) {
            throw createHttpError(404, "Item not found")
        }

        await item.deleteOne().exec()
        res.status(204).json("item deleted")
    } catch (error) {
        next(error)
    }
}