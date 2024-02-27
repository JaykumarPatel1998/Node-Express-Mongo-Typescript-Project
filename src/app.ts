import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import fileRoutes from './routes/file.routes'
import embeddingRoutes from './routes/embedding.routes'
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import createHttpError, {isHttpError} from 'http-errors';
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

dotenv.config()
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/files", fileRoutes)
app.use("/api/embeddings", embeddingRoutes)

app.use((req, res, next) => {
    next(createHttpError(404, "Enpoint not found! 😥"))
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error)
    let errorMessage = "an error occurred"
    let statusCode = 500
    if (isHttpError(error)) {
        errorMessage = error.message
        statusCode = error.status
    }
    res.status(statusCode).json({
        error : errorMessage,
        status : statusCode
    })
})

export default app;