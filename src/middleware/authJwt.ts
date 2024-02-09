import { Request, RequestHandler } from "express";
import jwt, { TokenExpiredError, JwtPayload } from "jsonwebtoken";

interface ExtendedRequest extends Request {
    id? : string;
}
export const verifyToken: RequestHandler = (req : ExtendedRequest, res, next) => {
    const {token, refreshToken} = req.cookies

    if (!token || !refreshToken) {
        res.redirect('/signup.html')
        return;
    }

    if (typeof token == "string") {
        jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
            if (err) {
                if (err instanceof TokenExpiredError) {
                    res.redirect('/api/auth/refreshToken')
                    return;
                } else {
                    res.redirect('/signup.html')
                }
            }
            if (decoded) {
            const decodedPayload = decoded as JwtPayload
            req.id = decodedPayload.sub
            }
            next();
        });
    } else {
        res.redirect('/signup.html')
    }
};
