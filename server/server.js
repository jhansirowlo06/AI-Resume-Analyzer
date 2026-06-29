const historyRoutes = require("./routes/historyRoutes");
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const documentRoutes = require("./routes/documentRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/documents", documentRoutes);
app.use("/api/history", historyRoutes);
app.get("/", (req, res) => {
  res.send("IntelOps Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

