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
exports.checkDuplicateUsernameOrEmail = void 0;
const user_1 = __importDefault(require("../models/user"));
const http_errors_1 = __importDefault(require("http-errors"));
const checkDuplicateUsernameOrEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Username and email exist in DB or not?
    try {
        const username = req.body.username;
        const email = req.body.email;
        if (!username || !email) {
            throw (0, http_errors_1.default)(400, "username and email must be provided");
        }
        const userByUsername = yield user_1.default.findOne({ username: username }).exec();
        if (userByUsername) {
            throw (0, http_errors_1.default)(400, "username already exists");
        }
        const userByEmail = yield user_1.default.findOne({ email: email }).exec();
        if (userByEmail) {
            throw (0, http_errors_1.default)(400, "email already taken");
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.checkDuplicateUsernameOrEmail = checkDuplicateUsernameOrEmail;
