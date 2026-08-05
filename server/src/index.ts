import express from "express"
import "dotenv/config";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import cors from "cors";
import { register } from "node:module";
import { registerRoutes } from "./routes/index.js";
import { errorHandler } from "./middleware/error-handler.middleware.js";

const app = express()
const PORT = process.env.PORT;
const clientUrl = process.env.CLIENT_URL ?? "http://localhost:3001"; 

app.use(
    cors({
        origin: clientUrl,
        credentials: true,
    })
)

app.all('/api/auth/{*any}', toNodeHandler(auth));


app.get("/", (req, res) => {
    res.send("HEllo world");

});
app.get("/health", (req,res) => {
    res.send("ok");
})

registerRoutes(app);

app.use(errorHandler)

app.listen(8081, () => {
    console.log("server is running on PORT 8081");

})