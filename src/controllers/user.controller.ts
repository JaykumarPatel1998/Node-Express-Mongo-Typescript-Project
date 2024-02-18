import User from "../models/user";
import { Request, RequestHandler } from "express";
import createHttpError from "http-errors";

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

export const markMessage: RequestHandler = async (req : ExtendedRequest, res, next) => {
    const user = await User.findById(req.id).exec()
    const messageId = req.params.messageId;
    try {
        if (user) {
            user.messageArray.forEach((message) => {
                if (message._id?.toString() === messageId) {
                    message.read = !message.read
                }
            })
    
            await user.save()
    
            res.status(302).redirect("/api/user/messages")
            return;
        } else {
            throw createHttpError(404, "message not found")
        }
        
    } catch (error) {
        next(error)
    }
};