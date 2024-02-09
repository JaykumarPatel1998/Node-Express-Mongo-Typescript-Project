import { S3Client } from "@aws-sdk/client-s3";
import { Request } from "express";
import "dotenv/config"
import multer from "multer"
import multerS3 from 'multer-s3'
import File from '../models/file'
import createHttpError from "http-errors";
const s3 = new S3Client({})

interface MulterRequest extends Request { id: string }

const upload = multer({
  fileFilter: async (req, file, cb) => {
    const fileName = file.originalname
    const fileByFileName = await File.findOne({ fileName: fileName }).exec()

    if (fileByFileName) {
      cb(createHttpError(400, "File already exists! delete the existing file if you wanna upload another with same name"))
    } else {
      cb(null, true)
    }
  },
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET!,
    metadata: function (req, file, cb) {
      cb(null, { fieldname: file.fieldname });
    },
    key: function (req: MulterRequest, file, cb) {
      cb(null, req.id + "/" + file.originalname);
    }
  })
})

export default upload