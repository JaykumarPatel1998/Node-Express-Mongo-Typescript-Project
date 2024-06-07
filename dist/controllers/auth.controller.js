"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signout = exports.refreshToken = exports.signin = exports.signup = void 0;
const user_1 = __importDefault(require("../models/user"));
const refreshToken_1 = __importDefault(require("../models/refreshToken"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_errors_1 = __importDefault(require("http-errors"));
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new user_1.default({
        username: req.body.username,
        email: req.body.email,
        password: bcryptjs_1.default.hashSync(req.body.password, 8),
        messageArray: [{
                message: "Welcome to the Application!"
            }]
    });
    try {
        yield user.save();
        res.status(201).redirect("/login.html");
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.signup = signup;
const signin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findOne({ username: req.body.username }).exec();
        if (!user) {
            throw (0, http_errors_1.default)(404, "User not found");
        }
        const passwordIsValid = bcryptjs_1.default.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            throw (0, http_errors_1.default)(401, "Unauthorized: Incorrect password");
        }
        const token = jsonwebtoken_1.default.sign({ sub: user._id }, process.env.JWT_SECRET, {
            expiresIn: parseInt(process.env.JWT_TOKEN_EXPIRY)
        });
        const refreshTokenToSend = yield refreshToken_1.default.createToken({ _id: user._id });
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: "lax"
        });
        res.cookie('refreshToken', refreshTokenToSend, {
            httpOnly: true,
            sameSite: "lax"
        });
        res.status(200).redirect('/api/files');
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.signin = signin;
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken: requestToken } = req.cookies;
    if (requestToken == null) {
        res.redirect('login.html');
        return;
    }
    try {
        const refreshToken = yield refreshToken_1.default.findOne({ token: requestToken });
        if (!refreshToken) {
            res.redirect('/signup.html');
            return;
        }
        else {
            if (refreshToken.verifyExpiration()) {
                refreshToken_1.default.findByIdAndDelete(refreshToken._id, { useFindAndModify: false }).exec();
                res.redirect('/signup.html');
                return;
            }
            const token = jsonwebtoken_1.default.sign({ sub: refreshToken.user._id }, process.env.JWT_SECRET, {
                expiresIn: parseInt(process.env.JWT_TOKEN_EXPIRY),
            });
            res.cookie('token', token, {
                httpOnly: true,
                sameSite: "lax"
            });
            res.cookie('refreshToken', refreshToken.token, {
                httpOnly: true,
                sameSite: "lax"
            });
            res.status(200).redirect('/api/files');
            return;
        }
    }
    catch (err) {
        next(err);
    }
});
exports.refreshToken = refreshToken;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const signout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken, token } = req.cookies;
    try {
        if (refreshToken && token) {
            res.clearCookie('token');
            res.clearCookie('refreshToken');
        }
        else if (refreshToken) {
            res.clearCookie('refreshToken');
        }
        else if (token) {
            res.clearCookie('token');
        }
        res.redirect('/signup.html');
        return;
    }
    catch (err) {
        return res.status(500).send({ message: err });
    }
});
exports.signout = signout;
