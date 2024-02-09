import { Request, RequestHandler } from "express"
import File from "../models/file"
import createPresignedUrlWithClient from "../fileUtils/presignedUrl";
import deleteFile from "../fileUtils/delete";
import UserModel from "../models/user";

interface FileObject extends Express.Multer.File {
    bucket?: string,
    key?: string,
    location?: string
}

interface ExtendedRequest extends Request {
    id?: string;
}

export const getFiles: RequestHandler = async (req: ExtendedRequest, res, next) => {
    try {
        const files = await File.find({ userId: req.id }).lean().exec();
        for (let i = 0; i < files.length; i++) {
            const temp = files[i].urlExpiryDate?.getMilliseconds;
            if (temp && (temp < Date.now)) {
                const presignedUrl = await createPresignedUrlWithClient(files[i].bucket!, files[i].key!)
                const date = new Date();
                const seconds = date.getSeconds()
                date.setSeconds(seconds + Number.parseInt(process.env.EXPIRY_PRESIGNED_URL_USER!))
                await File.findByIdAndUpdate(files[i]._id, {urlExpiryDate: date, fileUrl: presignedUrl})
            }
        }
        const user = await UserModel.findById(req.id);

        return res.status(200).render(`index`, { userId: user?._id, files, messages : user?.messageArray });
    } catch (error) {
        next(error)
    }
}

// req file send by multer middleware
// {
//     "fieldname": "file",
//     "originalname": "readme.md",
//     "encoding": "7bit",
//     "mimetype": "application/octet-stream",
//     "size": 165,
//     "bucket": "new-bucket-file-to-access",
//     "key": "65c17d4a10ea9f1cd1c59ed5/readme.md",
//     "acl": "private",
//     "contentType": "application/octet-stream",
//     "contentDisposition": null,
//     "contentEncoding": null,
//     "storageClass": "STANDARD",
//     "serverSideEncryption": null,
//     "metadata": {
//     "fieldname": "file"
//     },
//     "location": "https://new-bucket-file-to-access.s3.us-east-1.amazonaws.com/65c17d4a10ea9f1cd1c59ed5/readme.md",
//     "etag": "\"a566097b43a8f68e5e4b9c44c6aaac74\""
//     }
export const uploadFile: RequestHandler = async (req: ExtendedRequest, res, next) => {

    try {
        const options: FileObject = req.file!;
        const presignedUrl = await createPresignedUrlWithClient(options.bucket!, options.key!)
        const date = new Date();
        const seconds = date.getSeconds()
        date.setSeconds(seconds + Number.parseInt(process.env.EXPIRY_PRESIGNED_URL_USER!))

        await new File({
            bucket: options.bucket,
            fileName: options.originalname,
            key: options.key,
            size: options.size,
            fileUrl: presignedUrl,
            userId: req.id,
            urlExpiryDate: date
        }).save()

        res.status(200).redirect("/api/files/")
        return;
    } catch (error) {
        next(error)
    }
}

export const deleteFromStorageandDB: RequestHandler = async (req: ExtendedRequest, res, next) => {

    try {
        const file = await File.findById(req.params.fileId)
        if (file) {
            await deleteFile(file.bucket, file.key!);
            await File.findByIdAndDelete(file._id);
        }
        const httpResponse = {
            "message" : "File deleted successfully"
        }
        res.status(200).send(httpResponse)
        return;
    } catch (error) {
        next(error)
    }
}
