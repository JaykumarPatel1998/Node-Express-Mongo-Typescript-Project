import User from "../models/user";
import RefreshToken from "../models/refreshToken";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { RequestHandler } from "express";
import createHttpError from "http-errors";

export const signup: RequestHandler = async (req, res, next) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
    });

    try {
        await user.save();
        res.status(201).redirect("/login.html")
        return;
    } catch (error) {
        next(error)
    }

};

export const signin: RequestHandler = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username }).exec()
        if (!user) {
            throw createHttpError(404, "User not found")
        }

        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            throw createHttpError(401, "Unauthorized: Incorrect password")
        }

        const token = jwt.sign({ sub : user._id }, process.env.JWT_SECRET!, {
            expiresIn: parseInt(process.env.JWT_TOKEN_EXPIRY!)
        });


        const refreshTokenToSend = await RefreshToken.createToken({_id : user._id})

        res.cookie('token', token, {
            httpOnly : true,
            sameSite: "lax"
        })

        res.cookie('refreshToken', refreshTokenToSend, {
            httpOnly : true,
            sameSite: "lax"
        })

        res.status(200).redirect('/api/items')
        return

    } catch (error) {
        next(error)
    }
};

export const refreshToken: RequestHandler =  async (req, res, next) => {
    const { refreshToken : requestToken } = req.cookies;
    console.log('refresh token api has been called');
    if (requestToken == null) {
        res.redirect('login.html')
        return
    }

    try {
        const refreshToken = await RefreshToken.findOne({ token : requestToken });

        if (!refreshToken) {
            res.redirect('/signup.html')
            return
        } else {
            if (refreshToken.verifyExpiration()) {
                RefreshToken.findByIdAndDelete(refreshToken._id, { useFindAndModify: false }).exec();
    
                res.redirect('/signup.html')
                return
            }
    
            const token = jwt.sign({ sub: refreshToken.user._id}, process.env.JWT_SECRET!, {
                expiresIn: parseInt(process.env.JWT_TOKEN_EXPIRY!),
            });
    
            res.cookie('token', token, {
                httpOnly : true,
                sameSite: "lax"
            })
    
            res.cookie('refreshToken', refreshToken.token, {
                httpOnly : true,
                sameSite: "lax"
            })
    
            res.status(200).redirect('/api/items')
            return
        }

    } catch (err) {
        next(err)
    }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const signout: RequestHandler =  async (req, res, next) => {
    const { refreshToken, token } = req.cookies;

    try {
        if( refreshToken && token) {
            res.clearCookie('token')
            res.clearCookie('refreshToken')
        } else if(refreshToken) {
            res.clearCookie('refreshToken')
        } else if(token) {
            res.clearCookie('token')
        }
        res.redirect('/signup.html')
        return;

    } catch (err) {
        return res.status(500).send({ message: err });
    }
};
