import { Request, RequestHandler } from "express"
import File from "../models/file"
import createPresignedUrlWithClient from "../fileUtils/presignedUrl";
import deleteFile from "../fileUtils/delete";
import UserModel from "../models/user";
import createHttpError from "http-errors";
import { generateEmbeddingFromS3Doc } from "../fileUtils/generateToken";
import FileEmbeddings from "../models/fileEmbeddings";

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
            if (temp && (temp >= Date.now)) {
                const presignedUrl = await createPresignedUrlWithClient(files[i].bucket!, files[i].key!)
                const date = new Date();
                const seconds = date.getSeconds()
                date.setSeconds(seconds + Number.parseInt(process.env.EXPIRY_PRESIGNED_URL_USER!))
                await File.findByIdAndUpdate(files[i]._id, { urlExpiryDate: date, fileUrl: presignedUrl })
            }
        }
        const user = await UserModel.findById(req.id);
        const messagesNotRead = user?.messageArray.filter(message => message.read === false)
        return res.status(200).render(`index`, { userId: user?._id, files, messages: messagesNotRead });
    } catch (error) {
        next(error)
    }
}

export const uploadFile: RequestHandler = async (req: ExtendedRequest, res, next) => {

    try {
        const options: FileObject = req.file!;
        const presignedUrl = await createPresignedUrlWithClient(options.bucket!, options.key!)
        const date = new Date();
        const seconds = date.getSeconds()
        date.setSeconds(seconds + Number.parseInt(process.env.EXPIRY_PRESIGNED_URL_USER!))

        const file = new File({
            bucket: options.bucket,
            fileName: options.originalname,
            key: options.key,
            size: options.size,
            fileUrl: presignedUrl,
            userId: req.id,
            urlExpiryDate: date
        })

        await file.save()



        const filenameArray = file.fileName.split('.')
        if (filenameArray[filenameArray.length - 1] === "pdf") {
            const htmlWaitState = `
            <!DOCTYPE html>
            <html>
            <head>
            <style>
            .loader {
            border: 16px solid #f3f3f3; /* Light grey */
            border-top: 16px solid #3498db; /* Blue */
            border-radius: 50%;
            width: 120px;
            height: 120px;
            animation: spin 2s linear infinite;
            }
            
            @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
            }
            </style>
            </head>
            <body>
            
                <div id="spinner">
                    <h2>File saved succesfully, now generating vector embeddings. Thanks for being patient.</h2>
                    <div class="loader"></div>
                </div>

                <div id="successful" style="display: none;">
                    <h2>File embedded successfully</h2>
                    <a href="/api/files">Se all files</a>
                </div>
            
            </body>
            </html>
        `

            res.write(htmlWaitState)
            const embedding = await generateEmbeddingFromS3Doc(presignedUrl);

            await new FileEmbeddings({
                embedding: embedding,
                fileId: file._id,
                userId: req.id?.toString()
            }).save()

            res.status(200).end(`
                <script>
                    // Replace this with your actual logic
                    document.getElementById('spinner').style.display = 'none';
                    document.getElementById('successful').style.display = 'block';
                </script>
            `)
            return;
        } else {
            return res.status(200).redirect('/api/files')
        }


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
            return res.status(200).redirect("/api/files");
        } else {
            throw createHttpError(404, "File not found")
        }
    } catch (error) {
        next(error)
    }
}

export const shareFile: RequestHandler = async (req: ExtendedRequest, res, next) => {

    try {
        const expiry = req.body.expiry
        const username = req.body.username
        const file = await File.findById(req.params.fileId).exec()
        const toUser = await UserModel.findOne({ username: username }).exec()

        if (file && toUser) {
            const presignedUrl = await createPresignedUrlWithClient(file.bucket, file.key!, parseInt(expiry) * 60)
            // const date = new Date();
            // const seconds = date.getSeconds()
            // date.setSeconds(seconds + parseInt(expiry) * 60)
            toUser.messageArray.push({
                message: presignedUrl,
                read: false,
                from: req.id
            })
            await toUser.save()
            return res.status(200).redirect("/api/files");
        } else {
            throw createHttpError(404, "user not found")
        }

    } catch (error) {
        next(error)
    }
}
