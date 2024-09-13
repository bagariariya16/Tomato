import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";


//app config
const app = express();
const port = 3000;

//middleware
app.use(express.json());
app.use(cors());
app.use(cors({ origin: 'http://localhost:5173' }));

//dB connection
connectDB();

//api endpoints
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)

app.get("/",(req,res) =>{
    res.send("API WORKING")
})

app.listen(port , ()=>{
    console.log(`Server Started on https://localhost:${port}`)
})

//mongodb+srv://bagariaria16:zooPPJA35RWLJzh1@cluster0.l4imz.mongodb.net/?
