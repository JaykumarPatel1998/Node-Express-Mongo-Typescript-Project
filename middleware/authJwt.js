"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const { token, refreshToken } = req.cookies;
    if (!token || !refreshToken) {
        res.redirect('/signup.html');
        return;
    }
    if (typeof token == "string") {
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                if (err instanceof jsonwebtoken_1.TokenExpiredError) {
                    res.redirect('/api/auth/refreshToken');
                    return;
                }
                else {
                    res.redirect('/signup.html');
                }
            }
            if (decoded) {
                const decodedPayload = decoded;
                req.id = decodedPayload.sub;
            }
            next();
        });
    }
    else {
        res.redirect('/signup.html');
    }
};
exports.verifyToken = verifyToken;
