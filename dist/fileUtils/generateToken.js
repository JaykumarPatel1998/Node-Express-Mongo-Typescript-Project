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
exports.generateEmbeddingFromText = exports.generateEmbeddingFromS3Doc = void 0;
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const axios_1 = __importDefault(require("axios"));
const generateEmbeddingFromS3Doc = (presignedUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(presignedUrl, { responseType: 'arraybuffer' });
    // Parse the PDF
    const { text } = yield (0, pdf_parse_1.default)(response.data);
    const dataStrip = (text).replace(/\s+/g, " ");
    console.log(dataStrip);
    const embedding = yield (0, exports.generateEmbeddingFromText)(dataStrip);
    // Log the text to the console
    return embedding;
});
exports.generateEmbeddingFromS3Doc = generateEmbeddingFromS3Doc;
const generateEmbeddingFromText = (text) => __awaiter(void 0, void 0, void 0, function* () {
    const TransformersApi = Function('return import("@xenova/transformers")')();
    const { pipeline } = yield TransformersApi;
    const extractor = yield pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    const output = yield extractor(text, {
        pooling: "mean",
        normalize: true,
    });
    return Array.from(output.data);
});
exports.generateEmbeddingFromText = generateEmbeddingFromText;
