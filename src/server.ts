import app from './app';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL!)
.then(() => {
    console.log("mongodb connected")
    app.listen(PORT, () => {
        console.log(`server running on http://${process.env.HOST}:${PORT}`);
    });
})
.catch(console.error)