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
exports.shareFile = exports.deleteFromStorageandDB = exports.uploadFile = exports.getFiles = void 0;
const file_1 = __importDefault(require("../models/file"));
const presignedUrl_1 = __importDefault(require("../fileUtils/presignedUrl"));
const delete_1 = __importDefault(require("../fileUtils/delete"));
const user_1 = __importDefault(require("../models/user"));
const http_errors_1 = __importDefault(require("http-errors"));
const generateToken_1 = require("../fileUtils/generateToken");
const fileEmbeddings_1 = __importDefault(require("../models/fileEmbeddings"));
const getFiles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const files = yield file_1.default.find({ userId: req.id }).lean().exec();
        for (let i = 0; i < files.length; i++) {
            const temp = (_a = files[i].urlExpiryDate) === null || _a === void 0 ? void 0 : _a.getMilliseconds;
            if (temp && (temp >= Date.now)) {
                const presignedUrl = yield (0, presignedUrl_1.default)(files[i].bucket, files[i].key);
                const date = new Date();
                const seconds = date.getSeconds();
                date.setSeconds(seconds + Number.parseInt(process.env.EXPIRY_PRESIGNED_URL_USER));
                yield file_1.default.findByIdAndUpdate(files[i]._id, { urlExpiryDate: date, fileUrl: presignedUrl });
            }
        }
        const user = yield user_1.default.findById(req.id);
        const messagesNotRead = user === null || user === void 0 ? void 0 : user.messageArray.filter(message => message.read === false);
        return res.status(200).render(`index`, { userId: user === null || user === void 0 ? void 0 : user.username, files, messages: messagesNotRead });
    }
    catch (error) {
        next(error);
    }
});
exports.getFiles = getFiles;
const uploadFile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const options = req.file;
        const presignedUrl = yield (0, presignedUrl_1.default)(options.bucket, options.key);
        const date = new Date();
        const seconds = date.getSeconds();
        date.setSeconds(seconds + Number.parseInt(process.env.EXPIRY_PRESIGNED_URL_USER));
        const file = new file_1.default({
            bucket: options.bucket,
            fileName: options.originalname,
            key: options.key,
            size: options.size,
            fileUrl: presignedUrl,
            userId: req.id,
            urlExpiryDate: date
        });
        yield file.save();
        const filenameArray = file.fileName.split('.');
        if (filenameArray[filenameArray.length - 1] === "pdf") {
            const htmlWaitState = `
            <!DOCTYPE html>
            <html>
            <head>
            <style>
            .loader {
            border: 16px solid #f3f3f3; /* Light grey */
            border-top: 16px solid #3498db; /* Blue */
            border-radius: 50%;
            width: 120px;
            height: 120px;
            animation: spin 2s linear infinite;
            }
            
            @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
            }
            </style>
            </head>
            <body>
            
                <div id="spinner">
                    <h2>File saved succesfully, now generating vector embeddings. Thanks for being patient.</h2>
                    <div class="loader"></div>
                </div>

                <div id="successful" style="display: none;">
                    <h2>File embedded successfully</h2>
                    <a href="/api/files">Se all files</a>
                </div>
            
            </body>
            </html>
        `;
            res.write(htmlWaitState);
            const embedding = yield (0, generateToken_1.generateEmbeddingFromS3Doc)(presignedUrl);
            yield new fileEmbeddings_1.default({
                embedding: embedding,
                fileId: file._id,
                userId: (_b = req.id) === null || _b === void 0 ? void 0 : _b.toString()
            }).save();
            res.status(200).end(`
                <script>
                    // Replace this with your actual logic
                    document.getElementById('spinner').style.display = 'none';
                    document.getElementById('successful').style.display = 'block';
                </script>
            `);
            return;
        }
        else {
            return res.status(200).redirect('/api/files');
        }
    }
    catch (error) {
        next(error);
    }
});
exports.uploadFile = uploadFile;
const deleteFromStorageandDB = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = yield file_1.default.findById(req.params.fileId);
        if (file) {
            yield (0, delete_1.default)(file.bucket, file.key);
            yield file_1.default.findByIdAndDelete(file._id);
            yield fileEmbeddings_1.default.deleteOne({
                fileId: file._id
            });
            return res.status(200).redirect("/api/files");
        }
        else {
            throw (0, http_errors_1.default)(404, "File not found");
        }
    }
    catch (error) {
        next(error);
    }
});
exports.deleteFromStorageandDB = deleteFromStorageandDB;
const shareFile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expiry = req.body.expiry;
        const username = req.body.username;
        const file = yield file_1.default.findById(req.params.fileId).exec();
        const toUser = yield user_1.default.findOne({ username: username }).exec();
        if (file && toUser) {
            const presignedUrl = yield (0, presignedUrl_1.default)(file.bucket, file.key, parseInt(expiry) * 60);
            // const date = new Date();
            // const seconds = date.getSeconds()
            // date.setSeconds(seconds + parseInt(expiry) * 60)
            toUser.messageArray.push({
                message: presignedUrl,
                read: false,
                from: req.id
            });
            yield toUser.save();
            return res.status(200).redirect("/api/files");
        }
        else {
            throw (0, http_errors_1.default)(404, "user not found");
        }
    }
    catch (error) {
        next(error);
    }
});
exports.shareFile = shareFile;
