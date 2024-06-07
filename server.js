"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const PORT = process.env.PORT || 5000;
mongoose_1.default.connect(process.env.MONGO_URL)
    .then(() => {
    console.log("mongodb connected");
    app_1.default.listen(PORT, () => {
        console.log(`server running on http://${process.env.HOST}:${PORT}`);
    });
})
    .catch(console.error);
