"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const createPresignedUrlWithClient = (bucket, key, expiry) => {
    const client = new client_s3_1.S3Client();
    const command = new client_s3_1.GetObjectCommand({ Bucket: bucket, Key: key });
    return (0, s3_request_presigner_1.getSignedUrl)(client, command, { expiresIn: expiry || Number.parseInt(process.env.EXPIRY_PRESIGNED_URL_USER) });
};
exports.default = createPresignedUrlWithClient;
