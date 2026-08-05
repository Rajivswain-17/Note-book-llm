import express from "express"
import "dotenv/config";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

const app = express()
const PORT = process.env.PORT;

app.all('/api/auth/{*any}', toNodeHandler(auth));


app.get("/", (req, res) => {
    res.send("HEllo world");

});
app.get("/health", (req,res) => {
    res.send("ok");
})

app.listen(8081, () => {
    console.log("server is running on PORT 8081");

})