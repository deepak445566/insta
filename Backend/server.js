import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import UserRouter from "./routes/UserRouter.js";
import OwnerRouter from "./routes/OwnerRouter.js";
import ItemRouter from "./routes/ItemRouter.js";
import OwnerFoodRouter from "./routes/OwnerFoodRouter.js";

const app = express();

await connectDB();
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}));
app.use(cookieParser());

app.use(express.json()); //frontend sa re.body ma data laka aata hai taki ham ussa readable bana sakha//
app.use("/api/user", UserRouter);
app.use("/api/owner", OwnerRouter);
app.use("/api/item", ItemRouter);
app.use("/api/foodOwner", OwnerFoodRouter)



app.get("/", (req, res) => {
  res.send("hi");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`server runn on POrt ${PORT}`);
});
