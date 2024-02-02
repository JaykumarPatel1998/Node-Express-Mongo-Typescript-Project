import { RequestHandler } from "express";
import User from "../models/user"
import createHttpError from "http-errors";


interface UserBody {
    username?: string,
    email?: string,
    password?: string

}
export const checkDuplicateUsernameOrEmail: RequestHandler<unknown, unknown, UserBody, unknown> = async (req, res, next) => {
    // Username and email exist in DB or not?
    try {
        const username = req.body.username
        const email = req.body.email
        if (!username || !email) {
            throw createHttpError(400, "username and email must be provided")
        }

        const userByUsername = await User.findOne({ username: username }).exec()
        if (userByUsername) {
            throw createHttpError(400, "username already exists")
        }

        const userByEmail = await User.findOne({ email: email }).exec()
        if (userByEmail) {
            throw createHttpError(400, "email already taken")
        }
        next()
    } catch (error) {
        next(error)
    }
};
