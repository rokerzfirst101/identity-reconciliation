import express from 'express';

const app = express();
const PORT = 8080;

app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.listen(PORT, () => {
    console.info(`Server started at http://localhost:${PORT}`)
})