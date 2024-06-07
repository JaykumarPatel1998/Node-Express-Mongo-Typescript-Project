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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const FileController = __importStar(require("../controllers/file.controller"));
const authJwt_1 = require("../middleware/authJwt");
const upload_1 = __importDefault(require("../fileUtils/upload"));
const router = express_1.default.Router();
router.get("/", [authJwt_1.verifyToken], FileController.getFiles);
router.post("/", [authJwt_1.verifyToken, upload_1.default.single("file")], FileController.uploadFile);
router.delete("/:fileId", [authJwt_1.verifyToken], FileController.deleteFromStorageandDB);
router.post("/:fileId", [authJwt_1.verifyToken], FileController.shareFile);
exports.default = router;
