import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import generateRoute from "./routes/generateRoute.js";
import cors from "cors";

const PORT = process.env.PORT || 5000;
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

app.use("/api/generate", generateRoute);

app.get("/", (req, res) => {
  res.send("AI Website Builder API Running");
});

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
