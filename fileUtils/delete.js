"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const deleteFile = (bucket, key) => {
    const client = new client_s3_1.S3Client();
    const command = new client_s3_1.DeleteObjectCommand({ Bucket: bucket, Key: key });
    return client.send(command);
};
exports.default = deleteFile;
