import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
    getSignedUrl,
  } from "@aws-sdk/s3-request-presigner";

const createPresignedUrlWithClient = (bucket : string, key: string, expiry?: number) => {
  const client = new S3Client();
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn: expiry || Number.parseInt(process.env.EXPIRY_PRESIGNED_URL_USER!) });
};

export default createPresignedUrlWithClient;
