const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
const PORT = 4001;
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://127.0.0.1:27017/Login")
  // .connect("'mongodb://localhost:27017/")
  .then(() => {
    console.log("Database connected Successfully");
  })
  .catch(() => console.log("Error in connecting Database"));
app.use(cors());
const registerRoutes = require("./routes/routes");
app.use("/signup", registerRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
