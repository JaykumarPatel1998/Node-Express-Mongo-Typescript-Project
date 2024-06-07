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
exports.vectorSearch = void 0;
const generateToken_1 = require("../fileUtils/generateToken");
const mongodb_1 = require("mongodb");
const file_1 = __importDefault(require("../models/file"));
// connect to your Atlas cluster
const uri = process.env.MONGO_URL;
const client = new mongodb_1.MongoClient(uri);
const vectorSearch = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        yield client.connect();
        if (!req.query.searchQuery) {
            return res.render('embeddings', { files: undefined });
        }
        const database = client.db("project");
        const coll = database.collection("fileembeddings");
        const embedding = yield (0, generateToken_1.generateEmbeddingFromText)(req.query.searchQuery);
        const result = yield coll.aggregate([
            {
                "$vectorSearch": {
                    "index": "vector_index",
                    "path": "embedding",
                    "queryVector": embedding,
                    "filter": {
                        "userId": (_a = req.id) === null || _a === void 0 ? void 0 : _a.toString()
                    },
                    "numCandidates": 5,
                    "limit": 4
                }
            }, {
                '$project': {
                    'fileId': 1,
                    'userId': 1,
                    'score': {
                        '$meta': 'vectorSearchScore'
                    }
                }
            }
        ]).toArray();
        console.log(result);
        const files = [];
        for (let i = 0; i < result.length; i++) {
            const fileObj = yield file_1.default.findById(result[i].fileId).exec();
            if (fileObj) {
                files.push({
                    filename: fileObj.fileName,
                    fileUrl: fileObj.fileUrl,
                    score: result[i].score
                });
            }
        }
        return res.render('embeddings', { files });
    }
    catch (err) {
        next(err);
    }
});
exports.vectorSearch = vectorSearch;
