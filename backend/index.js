const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors");
const path = require('path')
const rootRouter = require('./routes/index.js')


const connectToDb = require("../backend/db.js")


__dirname = path.resolve()


const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

app.use(express.static(path.join(__dirname,'/frontend/dist')));

app.use("/api/v1", rootRouter);

connectToDb();
app.listen(process.env.PORT,()=>{
    console.log("server listening on port")
})


app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'frontend' ,'dist','index.html'));
})