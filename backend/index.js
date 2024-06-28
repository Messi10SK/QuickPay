const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors");

const rootRouter = require('./routes/index.js')


const connectToDb = require("../backend/db.js")

const app = express();
app.use(express.json());
app.use(cors(
    {
        origin: ["https://quick-pay-front.vercel.app/"],
        methods: ["GET","POST","PUT","DELETE"],
        credentials: true,     
    }
));

dotenv.config();



app.use("/api/v1", rootRouter);

connectToDb();
app.listen(process.env.PORT,()=>{
    console.log("server listening on port")
})
