import User from "../models/user";
import { Request, RequestHandler } from "express";
// import createHttpError from "http-errors";

interface ExtendedRequest extends Request {
    id?: string;
}

export const getMessages: RequestHandler = async (req : ExtendedRequest, res, next) => {
    const user = await User.findById(req.id).exec()
    try {
        res.status(201).render("messages", {messages : user?.messageArray, userId : req.id})
        return;
    } catch (error) {
        next(error)
    }
};