import express from 'express';
const app = express();
const HOSTNAME = "127.0.0.1";
const PORT = 5000;

app.get("/", (req, res) => {
    res.send("Welcome")
})

app.listen(PORT, () => {
    console.log(`server running on http://${HOSTNAME}:${PORT}`);
});