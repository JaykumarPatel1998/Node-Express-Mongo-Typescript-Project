import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

const deleteFile = (bucket : string, key: string) => {
  const client = new S3Client();
  const command = new DeleteObjectCommand({ Bucket: bucket, Key: key });
  return client.send(command)
};

export default deleteFile;
