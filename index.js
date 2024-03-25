const express = require("express");
const app = express();
const connectDB = require("./configDB/configDB.js");
const authRoutes = require("./routes/authRoutes.js");
const cors = require("cors");

const PORT = 9000;
connectDB();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use("", authRoutes);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
