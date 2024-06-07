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
const client_s3_1 = require("@aws-sdk/client-s3");
require("dotenv/config");
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const file_1 = __importDefault(require("../models/file"));
const http_errors_1 = __importDefault(require("http-errors"));
const s3 = new client_s3_1.S3Client({});
const upload = (0, multer_1.default)({
    fileFilter: (req, file, cb) => __awaiter(void 0, void 0, void 0, function* () {
        const fileName = file.originalname;
        const fileByFileName = yield file_1.default.findOne({ fileName: fileName, userId: req.id }).exec();
        if (fileByFileName) {
            cb((0, http_errors_1.default)(400, "File already exists! delete the existing file if you wanna upload another with same name"));
        }
        else {
            cb(null, true);
        }
    }),
    storage: (0, multer_s3_1.default)({
        s3: s3,
        bucket: process.env.S3_BUCKET,
        metadata: function (req, file, cb) {
            cb(null, { fieldname: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, req.id + "/" + file.originalname);
        }
    })
});
exports.default = upload;
