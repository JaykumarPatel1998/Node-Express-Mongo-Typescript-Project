import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import itemRoutes from './routes/item.routes'

dotenv.config()
const app = express();

app.use("/api/items", itemRoutes)

app.use((req, res, next) => {
    next(Error("Enpoint not found! 😥"))
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error)
    let errorMessage = "an error occurred"
    if (error instanceof Error) {
        errorMessage = error.message
    }
    res.status(500).json({
        error: errorMessage
    })
})

export default app;