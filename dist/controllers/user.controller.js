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
exports.markMessage = exports.getMessages = void 0;
const user_1 = __importDefault(require("../models/user"));
const http_errors_1 = __importDefault(require("http-errors"));
const getMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findById(req.id).exec();
    try {
        res.status(201).render("messages", { messages: user === null || user === void 0 ? void 0 : user.messageArray, userId: req.id });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.getMessages = getMessages;
const markMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findById(req.id).exec();
    const messageId = req.params.messageId;
    try {
        if (user) {
            user.messageArray.forEach((message) => {
                var _a;
                if (((_a = message._id) === null || _a === void 0 ? void 0 : _a.toString()) === messageId) {
                    message.read = !message.read;
                }
            });
            yield user.save();
            res.status(302).redirect("/api/user/messages");
            return;
        }
        else {
            throw (0, http_errors_1.default)(404, "message not found");
        }
    }
    catch (error) {
        next(error);
    }
});
exports.markMessage = markMessage;
