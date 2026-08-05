import express from "express"
import "dotenv/config";

const app = express()
const PORT = process.env.PORT;


app.get("/", (req, res) => {
    res.send("HEllo world");

});
app.get("/health", (req,res) => {
    res.send("ok");
})

app.listen(8081, () => {
    console.log("server is running on PORT 8081");

})