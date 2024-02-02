import { Request, RequestHandler } from "express"
import Item from "../models/item"
import createHttpError from "http-errors"
import mongoose from "mongoose"

interface ExtendedRequest extends Request {
    id? : string;
}

export const getItems: RequestHandler = async (req : ExtendedRequest, res, next) => {
    try {
        const userId = req.id;
        const notes = await Item.find().exec()
        res.status(200).render('index', {
            notes,
            userId
        })
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
        // res.render('index', {path : "GET /:id"})
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
        // res.render('index', {path : "POST /"})
    } catch (error) {
        next(error)
    }
}

interface UpdateItemParams {
    id?: string
}

interface UpdateItemBody {
    title? : string,
    description? : string
}

export const updateItem: RequestHandler<unknown, unknown, UpdateItemBody, unknown> = async (req, res, next) => {
    const params = req.params as UpdateItemParams
    const id = params.id;
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
        // res.render('index', {path : "PATCH /:id"})
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
        // res.render('index', {path : "DELETE /:id"})
    } catch (error) {
        next(error)
    }
}