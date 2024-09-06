const express = require("express");
const cors = require("cors");
const rootRouter = require("./routes/index");

const app = express();

app.use(cors());
app.use(express.json()); 
/*  to be able to read the “body” of an incoming JSON object. Means it is used to parse the data
here: const userName = req.body.userName.
Good Question: why req.body need app.use(express.json()); but  not req.headers
req.query?
Answer: because we dont know what body is. it can text,json,html.javascript etc(check postman)
so we use app.use(express.json()); to parse json and read the body of json specifically.
*/ 

app.use("/api/v1", rootRouter);

// app.post('/api/v1/',(req,res)=>{
//     res.json({
//         messsage: "ho gya"
//     })
// })

app.listen(3000);