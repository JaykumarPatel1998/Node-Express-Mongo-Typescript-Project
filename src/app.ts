import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import itemRoutes from './routes/item.routes'
import createHttpError, {isHttpError} from 'http-errors';

dotenv.config()
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use("/api/items", itemRoutes)

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